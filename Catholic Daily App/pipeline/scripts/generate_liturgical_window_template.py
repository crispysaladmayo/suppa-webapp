#!/usr/bin/env python3
"""
Generate a full date-window liturgical template (past/future months) with placeholder blocks.

This is for dev seeding only. Replace placeholder text with licensed KWI content
before production use.
"""

from __future__ import annotations

import argparse
import json
from datetime import date, datetime, timedelta
from pathlib import Path


def _shift_months(d: date, delta: int) -> date:
    month_idx = d.month - 1 + delta
    year = d.year + month_idx // 12
    month = month_idx % 12 + 1
    return date(year, month, 1)


def _first_of_month(d: date) -> date:
    return d.replace(day=1)


def _window(today: date, back_months: int, forward_months: int) -> tuple[date, date]:
    start = _first_of_month(_shift_months(today, -back_months))
    end = _first_of_month(_shift_months(today, forward_months + 1)) - timedelta(days=1)
    return start, end


def main() -> int:
    p = argparse.ArgumentParser(description="Generate liturgical placeholder JSON for a date window.")
    p.add_argument("--output", "-o", type=Path, required=True, help="Output readings-import JSON file.")
    p.add_argument("--today", type=str, help="Override today (YYYY-MM-DD).")
    p.add_argument("--back-months", type=int, default=3)
    p.add_argument("--forward-months", type=int, default=3)
    p.add_argument("--bundle-version", type=str, default=f"{date.today().isoformat()}-dev-window-template")
    args = p.parse_args()

    today = datetime.strptime(args.today, "%Y-%m-%d").date() if args.today else date.today()
    start, end = _window(today, args.back_months, args.forward_months)

    days = []
    cursor = start
    while cursor <= end:
        d = cursor.isoformat()
        days.append(
            {
                "liturgical_date": d,
                "cycle_metadata": {
                    "note": "Placeholder only. Replace with licensed KWI liturgical day metadata.",
                },
                "blocks": [
                    {
                        "sort_order": 0,
                        "kind": "FIRST",
                        "reference": "TBD",
                        "title": "Bacaan pertama (placeholder)",
                        "body": f"PLACEHOLDER KWI LICENSED TEXT REQUIRED for {d}.",
                    },
                    {
                        "sort_order": 1,
                        "kind": "PSALM",
                        "reference": "TBD",
                        "title": "Mazmur tanggapan (placeholder)",
                        "body": f"PLACEHOLDER KWI LICENSED TEXT REQUIRED for {d}.",
                    },
                    {
                        "sort_order": 2,
                        "kind": "GOSPEL",
                        "reference": "TBD",
                        "title": "Injil (placeholder)",
                        "body": f"PLACEHOLDER KWI LICENSED TEXT REQUIRED for {d}.",
                    },
                ],
            },
        )
        cursor += timedelta(days=1)

    payload = {
        "bundle_version": args.bundle_version,
        "conference_code": "KWI",
        "effective_from": start.isoformat(),
        "source_attribution": "DEV TEMPLATE ONLY — replace with licensed KWI text before production.",
        "content_license_tag": "UNLICENSED_TEMPLATE",
        "days": days,
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
    print(f"Window: {start.isoformat()} -> {end.isoformat()} ({len(days)} days)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
