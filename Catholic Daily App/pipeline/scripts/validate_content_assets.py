#!/usr/bin/env python3
"""
Validate sample JSON files against the shapes defined in pipeline/schemas/.
Uses only the Python 3 standard library (no pip install required).

  python3 validate_content_assets.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SAMPLES = ROOT / "samples"

DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
SHA256 = re.compile(r"^[a-f0-9]{64}$")
KINDS = frozenset({"FIRST", "PSALM", "SECOND", "GOSPEL"})


def _err(path: str, msg: str) -> None:
    raise ValueError(f"{path}: {msg}")


def _require_str(d: dict, key: str, path: str, *, min_len: int = 1) -> str:
    v = d.get(key)
    if not isinstance(v, str) or len(v) < min_len:
        _err(path, f"'{key}' must be a non-empty string")
    return v


def validate_readings_import(data: Any, path: str) -> None:
    if not isinstance(data, dict):
        _err(path, "root must be object")
    _require_str(data, "bundle_version", path)
    _require_str(data, "effective_from", path)
    if not DATE.match(data["effective_from"]):
        _err(path, "effective_from must be YYYY-MM-DD")
    _require_str(data, "source_attribution", path)
    days = data.get("days")
    if not isinstance(days, list) or len(days) < 1:
        _err(path, "'days' must be a non-empty array")
    for i, day in enumerate(days):
        dp = f"{path} days[{i}]"
        if not isinstance(day, dict):
            _err(dp, "must be object")
        ld = _require_str(day, "liturgical_date", dp)
        if not DATE.match(ld):
            _err(dp, "liturgical_date must be YYYY-MM-DD")
        cm = day.get("cycle_metadata")
        if cm is not None and not isinstance(cm, dict):
            _err(dp, "cycle_metadata must be object or omitted")
        blocks = day.get("blocks")
        if not isinstance(blocks, list) or len(blocks) < 1:
            _err(dp, "'blocks' must be a non-empty array")
        for j, block in enumerate(blocks):
            bp = f"{dp} blocks[{j}]"
            if not isinstance(block, dict):
                _err(bp, "must be object")
            so = block.get("sort_order")
            if not isinstance(so, int) or so < 0:
                _err(bp, "sort_order must be integer >= 0")
            kind = block.get("kind")
            if kind not in KINDS:
                _err(bp, f"kind must be one of {sorted(KINDS)}")
            body = block.get("body")
            if not isinstance(body, str) or len(body) < 1:
                _err(bp, "body must be non-empty string")
            for opt in ("reference", "title"):
                v = block.get(opt)
                if v is not None and not isinstance(v, str):
                    _err(bp, f"{opt} must be string or omitted")
            sl = block.get("source_line")
            if sl is not None and not isinstance(sl, str):
                _err(bp, "source_line must be string or null or omitted")


def validate_readings_manifest(data: Any, path: str) -> None:
    if not isinstance(data, dict):
        _err(path, "root must be object")
    _require_str(data, "readings_bundle_version", path)
    _require_str(data, "bundle_url", path)
    h = _require_str(data, "sha256", path)
    if not SHA256.match(h):
        _err(path, "sha256 must be 64 lowercase hex chars")
    mav = data.get("min_app_version")
    if mav is not None and (not isinstance(mav, str) or len(mav) < 1):
        _err(path, "min_app_version must be non-empty string or omitted")


def validate_editorial_piece(data: Any, path: str) -> None:
    if not isinstance(data, dict):
        _err(path, "root must be object")
    ld = _require_str(data, "liturgical_date", path)
    if not DATE.match(ld):
        _err(path, "liturgical_date must be YYYY-MM-DD")
    _require_str(data, "body", path)
    _require_str(data, "byline", path)
    _require_str(data, "published_at", path)
    for bkey in ("ai_assisted", "human_reviewed"):
        v = data.get(bkey)
        if v is not None and not isinstance(v, bool):
            _err(path, f"{bkey} must be boolean or omitted")
    for skey in ("title", "language", "source_attribution", "external_id"):
        v = data.get(skey)
        if v is not None and not isinstance(v, str):
            _err(path, f"{skey} must be string or omitted")


def validate_editorial_index(data: Any, path: str) -> None:
    if not isinstance(data, dict):
        _err(path, "root must be object")
    _require_str(data, "updated_at", path)
    pieces = data.get("pieces")
    if not isinstance(pieces, list):
        _err(path, "'pieces' must be array")
    for i, p in enumerate(pieces):
        pp = f"{path} pieces[{i}]"
        if not isinstance(p, dict):
            _err(pp, "must be object")
        ld = _require_str(p, "liturgical_date", pp)
        if not DATE.match(ld):
            _err(pp, "liturgical_date must be YYYY-MM-DD")
        _require_str(p, "url", pp)


VALIDATION_MAP: list[tuple[str, Any]] = [
    ("readings-import.sample.json", validate_readings_import),
    ("readings-manifest.sample.json", validate_readings_manifest),
    ("editorial-index.sample.json", validate_editorial_index),
    ("editorial/2026-04-06.json", validate_editorial_piece),
]


def main() -> int:
    for rel, fn in VALIDATION_MAP:
        p = SAMPLES / rel
        data = json.loads(p.read_text(encoding="utf-8"))
        fn(data, str(p.relative_to(SAMPLES)))
    print(f"OK: validated {len(VALIDATION_MAP)} sample file(s) (stdlib checks).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as e:
        print(e, file=sys.stderr)
        raise SystemExit(1)
