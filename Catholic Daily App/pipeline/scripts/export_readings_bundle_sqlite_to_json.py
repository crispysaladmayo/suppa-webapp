#!/usr/bin/env python3
"""
Export android `readings_bundle.db` into readings-import.v1 JSON
(pipeline/schemas/readings-import.v1.schema.json) for static web / tooling.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path


def load_bundle(conn: sqlite3.Connection) -> tuple[dict, int]:
    row = conn.execute(
        "SELECT id, bundle_version, conference_code, effective_from, "
        "source_attribution, content_license_tag FROM readings_bundle ORDER BY id DESC LIMIT 1"
    ).fetchone()
    if not row:
        raise SystemExit("No readings_bundle row found")
    bundle_id = row[0]
    header = {
        "bundle_version": row[1],
        "conference_code": row[2] or "KWI",
        "effective_from": row[3],
        "source_attribution": row[4],
    }
    if row[5]:
        header["content_license_tag"] = row[5]
    return header, bundle_id


def cycle_metadata_object(raw: str | None) -> dict | None:
    if not raw or not raw.strip():
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"raw": raw}


def export_days(conn: sqlite3.Connection, bundle_id: int) -> list[dict]:
    days = []
    for liturgical_date, cycle_raw, day_id in conn.execute(
        "SELECT liturgical_date, cycle_metadata, id FROM readings_day WHERE bundle_id = ? ORDER BY liturgical_date",
        (bundle_id,),
    ):
        blocks = []
        for sort_order, kind, reference, title, body, source_line in conn.execute(
            "SELECT sort_order, kind, reference, title, body, source_line FROM reading_block "
            "WHERE readings_day_id = ? ORDER BY sort_order ASC",
            (day_id,),
        ):
            b: dict = {
                "sort_order": int(sort_order),
                "kind": kind,
                "body": body,
            }
            if reference:
                b["reference"] = reference
            if title:
                b["title"] = title
            if source_line is not None:
                b["source_line"] = source_line
            blocks.append(b)
        day: dict = {"liturgical_date": liturgical_date, "blocks": blocks}
        meta = cycle_metadata_object(cycle_raw)
        if meta is not None:
            day["cycle_metadata"] = meta
        days.append(day)
    return days


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "sqlite_path",
        type=Path,
        nargs="?",
        default=Path(__file__).resolve().parents[2]
        / "android"
        / "app"
        / "src"
        / "main"
        / "assets"
        / "readings_bundle.db",
    )
    p.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output JSON path (default: alongside sqlite as readings_bundle.export.json)",
    )
    args = p.parse_args()
    db_path: Path = args.sqlite_path
    if not db_path.is_file():
        print(f"Missing database: {db_path}", file=sys.stderr)
        sys.exit(1)
    out = args.output or db_path.with_name("readings_bundle.export.json")

    conn = sqlite3.connect(str(db_path))
    try:
        header, bundle_id = load_bundle(conn)
        days = export_days(conn, bundle_id)
    finally:
        conn.close()

    doc = {**header, "days": days}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(days)} days to {out}")


if __name__ == "__main__":
    main()
