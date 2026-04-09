#!/usr/bin/env python3
"""
Build a readings-only SQLite bundle from JSON (see schemas/readings-import.v1.schema.json).

Usage:
  python3 build_readings_bundle.py --input ../samples/readings-import.sample.json --output ../out/readings-sample.db

The sha256 stored in readings_bundle is the SHA-256 (hex) of the canonical JSON import payload
(sort_keys=True, UTF-8, no ASCII escaping of non-ASCII). Reproducible given the same source JSON.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sqlite3
import sys
from pathlib import Path


def _repo_sql_path() -> Path:
    return Path(__file__).resolve().parent.parent / "sql" / "readings_tables.sql"


def _fingerprint_import(data: dict) -> str:
    canonical = json.dumps(data, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def build_db(data: dict, output: Path) -> None:
    conference = data.get("conference_code") or "KWI"
    bundle_version = data["bundle_version"]
    effective_from = data["effective_from"]
    source_attribution = data["source_attribution"]
    license_tag = data.get("content_license_tag")
    days = data["days"]

    sha = _fingerprint_import(data)
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        output.unlink()

    conn = sqlite3.connect(str(output))
    try:
        conn.executescript(_repo_sql_path().read_text(encoding="utf-8"))
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO readings_bundle (
              bundle_version, conference_code, effective_from,
              source_attribution, content_license_tag, sha256
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                bundle_version,
                conference,
                effective_from,
                source_attribution,
                license_tag,
                sha,
            ),
        )
        bundle_id = cur.lastrowid

        for day in days:
            liturgical_date = day["liturgical_date"]
            cycle = day.get("cycle_metadata")
            cycle_json = json.dumps(cycle, sort_keys=True, ensure_ascii=False) if cycle is not None else None
            cur.execute(
                """
                INSERT INTO readings_day (bundle_id, liturgical_date, cycle_metadata)
                VALUES (?, ?, ?)
                """,
                (bundle_id, liturgical_date, cycle_json),
            )
            day_id = cur.lastrowid
            for block in day["blocks"]:
                cur.execute(
                    """
                    INSERT INTO reading_block (
                        readings_day_id, sort_order, kind, reference, title, body, source_line
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        day_id,
                        int(block["sort_order"]),
                        block["kind"],
                        block.get("reference"),
                        block.get("title"),
                        block["body"],
                        block.get("source_line"),
                    ),
                )
        conn.commit()
    finally:
        conn.close()


def main() -> int:
    p = argparse.ArgumentParser(description="Build readings SQLite bundle from JSON import file.")
    p.add_argument("--input", "-i", type=Path, required=True, help="Path to readings import JSON")
    p.add_argument("--output", "-o", type=Path, required=True, help="Output .db path")
    args = p.parse_args()

    raw = args.input.read_text(encoding="utf-8")
    data = json.loads(raw)
    build_db(data, args.output)
    print(f"Wrote {args.output}")
    print(f"Bundle fingerprint (sha256 of canonical import JSON): {_fingerprint_import(data)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
