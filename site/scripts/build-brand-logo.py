#!/usr/bin/env python3
"""Regenerate centred FAB dragon logo assets (header PNG + favicons)."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ORIG = ROOT / "src/assets/brand/fab-dragon-logo-trademark.jpeg"
ASSET = ROOT / "src/assets/brand/fab-dragon-logo-round-square.jpeg"
PUBLIC = ROOT / "public"
PUBLIC_IMG = PUBLIC / "images/fab-dragon-logo.png"
BG = (255, 255, 255)
BOTTOM = 432
MARGIN = 10


def build() -> Image.Image:
    orig = Image.open(ORIG).convert("RGB")
    strip = np.array(orig)[:BOTTOM]
    mask = np.any(strip < 248, axis=2)
    ys, xs = np.where(mask)
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    content = strip[y0 : y1 + 1, x0 : x1 + 1]
    ch, cw = content.shape[:2]
    side = max(cw, ch) + MARGIN * 2
    canvas = Image.new("RGB", (side, side), BG)
    canvas.paste(Image.fromarray(content), ((side - cw) // 2, (side - ch) // 2))
    return canvas


def main() -> None:
    canvas = build()
    canvas.save(ASSET, quality=92, optimize=True)
    rgba = canvas.convert("RGBA")
    rgba.resize((144, 144), Image.Resampling.LANCZOS).save(PUBLIC_IMG, optimize=True)
    for size, name in [(16, "favicon-16.png"), (32, "favicon-32.png"), (48, "favicon-48.png"), (180, "apple-touch-icon.png")]:
        rgba.resize((size, size), Image.Resampling.LANCZOS).save(PUBLIC / name, optimize=True)
    rgba.resize((32, 32), Image.Resampling.LANCZOS).save(PUBLIC / "favicon.png", optimize=True)
    canvas.save(PUBLIC / "favicon-source.jpeg", quality=92)
    print(f"Wrote centred logo assets ({canvas.size[0]}x{canvas.size[1]})")


if __name__ == "__main__":
    main()
