#!/usr/bin/env python3
"""Create gallery images from actual verified Playwright full-assembly captures.

The clean gallery screenshots come from scripts/smoke-solidcraft-full.mjs.
No synthetic render or old procedural model is used.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs" / "solidcraft-cad"
OUT = ROOT / "public" / "assets" / "engine-previews"
OUT.mkdir(parents=True, exist_ok=True)

ENGINES = ("turbojet", "turbofan", "afterburning-turbofan", "centrifugal-turbojet", "geared-turbofan")
for engine in ENGINES:
    source = SRC / f"gallery-{engine}.png"
    with Image.open(source) as picture:
        if picture.width != 1440 or picture.height != 900:
            raise ValueError(f"Unexpected capture size {picture.size}: {source}")
        # Include the complete machine without interface labels or navigation.
        # The long afterburning engine needs a right-shifted frame so that its
        # CAD variable-area nozzle remains visible end-to-end.
        region = (345, 190, 1395, 820) if engine == 'afterburning-turbofan' else (220, 190, 1270, 820)
        view = picture.crop(region)
        view = view.resize((1120, 672), Image.Resampling.LANCZOS)
        target = OUT / f"{engine}.png"
        view.save(target, optimize=True)
        print(f"{engine}: {target} ({target.stat().st_size} bytes)")
