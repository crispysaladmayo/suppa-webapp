#!/usr/bin/env python3
"""
Fetch Pope Leo homily records from Vatican sources (best effort) for the last N months.

Outputs:
1) homily history JSON (for audit/cache)
2) homily latest JSON (Android app seed/feed shape)

Example:
  python3 fetch_vatican_leo_homilies.py \
    --months-back 3 \
    --history-out ../out/homily-history.leo.json \
    --latest-out ../out/homily-latest.leo.json
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
import urllib.parse
import urllib.request
from dataclasses import dataclass, asdict
from datetime import date, datetime, timedelta, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path

BASE_INDEX_URL = "https://www.vaticannews.va/en/pope.html"
VATICAN_HOSTS = {"www.vaticannews.va", "www.vatican.va", "vatican.va"}
USER_AGENT = "CatholicDailyAppSeedBot/1.0 (+https://github.com/)"


def _shift_months(d: date, delta: int) -> date:
    month_idx = d.month - 1 + delta
    year = d.year + month_idx // 12
    month = month_idx % 12 + 1
    return date(year, month, 1)


def _first_of_month(d: date) -> date:
    return d.replace(day=1)


def _fetch_text(url: str, timeout_sec: int = 25, *, insecure_skip_verify: bool = False) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    ssl_context = None
    if insecure_skip_verify:
        ssl_context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=timeout_sec, context=ssl_context) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


class _HrefCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        for k, v in attrs:
            if k.lower() == "href" and v:
                self.hrefs.append(v)


class _ArticleParagraphCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_paragraph = False
        self._paragraph_parts: list[str] = []
        self.paragraphs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "p":
            self._in_paragraph = True
            self._paragraph_parts = []

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "p" and self._in_paragraph:
            text = " ".join("".join(self._paragraph_parts).split())
            if text:
                self.paragraphs.append(unescape(text))
            self._in_paragraph = False
            self._paragraph_parts = []

    def handle_data(self, data: str) -> None:
        if self._in_paragraph:
            self._paragraph_parts.append(data)


def _extract_meta(html: str, prop_name: str) -> str | None:
    pattern = re.compile(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop_name)}["\'][^>]+content=["\']([^"\']+)["\']',
        re.IGNORECASE,
    )
    m = pattern.search(html)
    return m.group(1).strip() if m else None


def _normalize_url(base_url: str, href: str) -> str | None:
    abs_url = urllib.parse.urljoin(base_url, href)
    parsed = urllib.parse.urlparse(abs_url)
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.netloc not in VATICAN_HOSTS:
        return None
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, "", "", ""))


def _discover_candidate_urls(index_url: str, *, insecure_skip_verify: bool) -> list[str]:
    html = _fetch_text(index_url, insecure_skip_verify=insecure_skip_verify)
    parser = _HrefCollector()
    parser.feed(html)
    out: set[str] = set()
    for href in parser.hrefs:
        normalized = _normalize_url(index_url, href)
        if not normalized:
            continue
        path = urllib.parse.urlparse(normalized).path.lower()
        if "/en/pope/news/" not in path:
            continue
        out.add(normalized)
    return sorted(out)


def _parse_isoish_date(raw: str | None) -> date | None:
    if not raw:
        return None
    raw = raw.strip()
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S.%f%z"):
        try:
            return datetime.strptime(raw, fmt).date()
        except ValueError:
            pass
    m = re.search(r"(\d{4}-\d{2}-\d{2})", raw)
    if m:
        return datetime.strptime(m.group(1), "%Y-%m-%d").date()
    return None


def _extract_article_date(html: str, url: str) -> date | None:
    # Vatican News often includes article:published_time
    meta_date = _extract_meta(html, "article:published_time")
    parsed_meta = _parse_isoish_date(meta_date)
    if parsed_meta:
        return parsed_meta
    # Fallback to URL path segment (e.g. /2026/03/...)
    m = re.search(r"/(\d{4})/(\d{2})/", url)
    if m:
        return date(int(m.group(1)), int(m.group(2)), 1)
    m = re.search(r"/documents/(\d{4})(\d{2})(\d{2})-", url)
    if m:
        return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    return None


@dataclass
class HomilyRecord:
    homily_date: str
    title: str | None
    body: str | None
    language: str
    rights_mode: str
    source_url: str
    source_name: str
    external_id: str


def _record_from_article(url: str, html: str, article_day: date) -> HomilyRecord:
    title = _extract_meta(html, "og:title") or _extract_meta(html, "twitter:title")
    parser = _ArticleParagraphCollector()
    parser.feed(html)
    paragraphs = [p for p in parser.paragraphs if len(p) > 20]
    body = "\n\n".join(paragraphs) if paragraphs else None
    rights_mode = "FULL" if body else "LINK_ONLY"
    ext = f"vaticannews-leoxiv-{article_day.isoformat()}-{abs(hash(url)) % 10_000_000}"
    return HomilyRecord(
        homily_date=article_day.isoformat(),
        title=title,
        body=body,
        language="en",
        rights_mode=rights_mode,
        source_url=url,
        source_name="Vatican News",
        external_id=ext,
    )


def _cutoff_date(today: date, months_back: int) -> date:
    # Inclusive window starts at first day of (today shifted by -months_back months)
    return _first_of_month(_shift_months(today, -months_back))


def main() -> int:
    p = argparse.ArgumentParser(description="Fetch Pope Leo homily records from Vatican News.")
    p.add_argument("--index-url", default=BASE_INDEX_URL, help="Vatican index page for discovery.")
    p.add_argument("--months-back", type=int, default=3, help="How many months back (inclusive).")
    p.add_argument("--today", type=str, help="Override today (YYYY-MM-DD).")
    p.add_argument("--history-out", type=Path, required=True, help="Output history JSON.")
    p.add_argument("--latest-out", type=Path, required=True, help="Output latest JSON for app.")
    p.add_argument(
        "--insecure-skip-verify",
        action="store_true",
        help="Skip SSL cert verification (last resort for constrained local Python trust store).",
    )
    p.add_argument(
        "--allow-empty",
        action="store_true",
        help="Write outputs even if no homily pages are discovered in window.",
    )
    p.add_argument(
        "--source-urls-file",
        type=Path,
        help="Optional newline-separated Vatican URLs to include in discovery.",
    )
    args = p.parse_args()

    today = datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else datetime.now(timezone.utc).date()
    cutoff = _cutoff_date(today, args.months_back)

    candidate_urls = set(
        _discover_candidate_urls(
        args.index_url,
        insecure_skip_verify=args.insecure_skip_verify,
        ),
    )
    if args.source_urls_file and args.source_urls_file.exists():
        for line in args.source_urls_file.read_text(encoding="utf-8").splitlines():
            raw = line.strip()
            if not raw or raw.startswith("#"):
                continue
            normalized = _normalize_url(args.index_url, raw)
            if normalized:
                candidate_urls.add(normalized)
    records: list[HomilyRecord] = []
    for url in sorted(candidate_urls):
        try:
            html = _fetch_text(url, insecure_skip_verify=args.insecure_skip_verify)
            article_day = _extract_article_date(html, url)
            if article_day is None or article_day < cutoff or article_day > today:
                continue
            title = (_extract_meta(html, "og:title") or "").lower()
            html_lc = html.lower()
            looks_like_homily = (
                "homily of pope leo xiv" in html_lc
                or "homi\u200bly of pope leo xiv" in html_lc
                or "homily" in title
                or "holy mass" in title
                or "mass" in title
            )
            if not looks_like_homily:
                continue
            record = _record_from_article(url, html, article_day)
            if "vatican.va" in urllib.parse.urlparse(url).netloc:
                record.source_name = "Vatican.va"
            records.append(record)
        except Exception:
            # Keep fetch pipeline resilient to individual page errors.
            continue

    records.sort(key=lambda r: (r.homily_date, r.source_url), reverse=True)
    deduped: list[HomilyRecord] = []
    seen: set[str] = set()
    for r in records:
        key = r.source_url
        if key in seen:
            continue
        seen.add(key)
        deduped.append(r)

    if not deduped and not args.allow_empty:
        raise SystemExit(
            "No homily records found in Vatican discovery window. "
            "Use --allow-empty to write LINK_ONLY fallback manually."
        )

    if not deduped:
        latest = HomilyRecord(
            homily_date=today.isoformat(),
            title="No homily discovered in configured window",
            body=None,
            language="en",
            rights_mode="LINK_ONLY",
            source_url=args.index_url,
            source_name="Vatican News",
            external_id=f"vaticannews-leoxiv-fallback-{today.isoformat()}",
        )
        deduped = [latest]

    history_payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "window_start": cutoff.isoformat(),
        "window_end": today.isoformat(),
        "records": [asdict(r) for r in deduped],
    }
    latest_payload = asdict(deduped[0])

    args.history_out.parent.mkdir(parents=True, exist_ok=True)
    args.latest_out.parent.mkdir(parents=True, exist_ok=True)
    args.history_out.write_text(json.dumps(history_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.latest_out.write_text(json.dumps(latest_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Discovered candidate pages: {len(candidate_urls)}")
    print(f"Records in window: {len(deduped)}")
    print(f"Wrote history: {args.history_out}")
    print(f"Wrote latest: {args.latest_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
