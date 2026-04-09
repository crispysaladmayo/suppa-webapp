#!/usr/bin/env python3
"""
Build a 6-month KWI readings seed package centered on today.

Input must be a licensed readings-import JSON (same shape as readings-import.sample.json).
The script filters to a date window (today - 3 months .. today + 3 months), then writes:
1) filtered readings import JSON
2) SQLite readings bundle (.db)
3) metadata report (coverage + missing dates)

Example:
  python3 build_kwi_seed_window.py \
    --licensed-import ../in/readings-kwi-licensed.json \
    --output-import ../out/readings-import.kwi-window.json \
    --output-db ../out/readings-kwi-window.db \
    --report ../out/readings-kwi-window.report.json
"""

from __future__ import annotations

import argparse
import json
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

from build_readings_bundle import build_db


def _parse_iso_day(raw: str) -> date:
    return datetime.strptime(raw, "%Y-%m-%d").date()


def _first_of_month(d: date) -> date:
    return d.replace(day=1)


def _shift_months(d: date, delta: int) -> date:
    month_idx = d.month - 1 + delta
    year = d.year + month_idx // 12
    month = month_idx % 12 + 1
    return date(year, month, 1)


def _window_for_today(today: date) -> tuple[date, date]:
    start = _first_of_month(_shift_months(today, -3))
    end = _first_of_month(_shift_months(today, 4)) - timedelta(days=1)
    return start, end


def _each_day(start: date, end: date) -> list[str]:
    days: list[str] = []
    cursor = start
    while cursor <= end:
        days.append(cursor.isoformat())
        cursor += timedelta(days=1)
    return days


def _build_filtered_payload(
    data: dict[str, Any],
    start: date,
    end: date,
    *,
    bundle_version: str | None,
) -> tuple[dict[str, Any], list[str], list[str]]:
    raw_days = data.get("days")
    if not isinstance(raw_days, list):
        raise ValueError("'days' must be a list in licensed import JSON")

    available_by_date: dict[str, dict[str, Any]] = {}
    for item in raw_days:
        if not isinstance(item, dict):
            continue
        liturgical_date = item.get("liturgical_date")
        if not isinstance(liturgical_date, str):
            continue
        if liturgical_date in available_by_date:
            raise ValueError(f"Duplicate liturgical_date found: {liturgical_date}")
        available_by_date[liturgical_date] = item

    expected_dates = _each_day(start, end)
    filtered_days: list[dict[str, Any]] = []
    missing_dates: list[str] = []
    for liturgical_date in expected_dates:
        day_entry = available_by_date.get(liturgical_date)
        if day_entry is None:
            missing_dates.append(liturgical_date)
            continue
        filtered_days.append(day_entry)

    payload = dict(data)
    payload["bundle_version"] = (
        bundle_version
        if bundle_version
        else f"{date.today().isoformat()}-kwi-window"
    )
    payload["effective_from"] = start.isoformat()
    payload["conference_code"] = data.get("conference_code") or "KWI"
    payload["days"] = filtered_days
    return payload, expected_dates, missing_dates


def main() -> int:
    p = argparse.ArgumentParser(description="Build KWI seed window from licensed readings import.")
    p.add_argument(
        "--licensed-import",
        "-i",
        type=Path,
        required=True,
        help="Licensed readings import JSON (readings-import shape).",
    )
    p.add_argument("--output-import", type=Path, required=True, help="Output filtered JSON.")
    p.add_argument("--output-db", type=Path, required=True, help="Output SQLite bundle (.db).")
    p.add_argument("--report", type=Path, required=True, help="Output report JSON.")
    p.add_argument(
        "--today",
        type=str,
        help="Override current day (YYYY-MM-DD) for reproducible builds.",
    )
    p.add_argument(
        "--bundle-version",
        type=str,
        help="Override generated bundle_version value.",
    )
    p.add_argument(
        "--allow-missing-days",
        action="store_true",
        help="Allow writing outputs even when the window has missing dates.",
    )
    args = p.parse_args()

    today = _parse_iso_day(args.today) if args.today else date.today()
    start, end = _window_for_today(today)

    source = json.loads(args.licensed_import.read_text(encoding="utf-8"))
    payload, expected_dates, missing_dates = _build_filtered_payload(
        source,
        start,
        end,
        bundle_version=args.bundle_version,
    )

    if missing_dates and not args.allow_missing_days:
        raise SystemExit(
            "Missing liturgical dates in licensed source for requested window. "
            "Re-run with --allow-missing-days to emit partial output.\n"
            f"Missing count: {len(missing_dates)}"
        )

    args.output_import.parent.mkdir(parents=True, exist_ok=True)
    args.output_db.parent.mkdir(parents=True, exist_ok=True)
    args.report.parent.mkdir(parents=True, exist_ok=True)

    args.output_import.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    build_db(payload, args.output_db)

    report = {
        "today": today.isoformat(),
        "window_start": start.isoformat(),
        "window_end": end.isoformat(),
        "expected_days": len(expected_dates),
        "available_days": len(payload["days"]),
        "missing_days": len(missing_dates),
        "missing_dates": missing_dates,
        "source_file": str(args.licensed_import),
        "output_import": str(args.output_import),
        "output_db": str(args.output_db),
    }
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Window: {start.isoformat()} -> {end.isoformat()}")
    print(f"Available days: {len(payload['days'])}/{len(expected_dates)}")
    print(f"Wrote import JSON: {args.output_import}")
    print(f"Wrote DB: {args.output_db}")
    print(f"Wrote report: {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
