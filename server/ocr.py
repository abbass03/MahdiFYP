import re
import numpy as np
from PIL import Image
from typing import Tuple, Optional, List
import easyocr

LANGS = ["en"]
CONF_THRESHOLD = 0.30
ONLY_AZ = True

_reader = None
def get_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(LANGS, gpu=False)
    return _reader

def _pick_best_letter(results) -> Optional[Tuple[str, float]]:
    if not results:
        return None
    cleaned = []
    for _, text, conf in results:
        if conf is None or conf < CONF_THRESHOLD:
            continue
        t = (text or "").strip()
        cleaned.append((t, float(conf)))
    if not cleaned:
        return None
    if ONLY_AZ:
        az = [(t, c) for (t, c) in cleaned if len(t) == 1 and re.match(r"^[A-Za-z]$", t)]
        if az:
            t, c = max(az, key=lambda x: x[1])
            return (t.lower(), c)
    t, c = max(cleaned, key=lambda x: x[1])
    if len(t) > 1:
        letters = [(ch, c) for ch in t if re.match(r"[A-Za-z]", ch)]
        if letters:
            ch, c = max(letters, key=lambda x: x[1])
            return (ch.lower(), c)
    return (t.lower(), c)

def run_ocr(pil_image: Image.Image):
    reader = get_reader()
    np_img = np.array(pil_image.convert("RGB"))
    results = reader.readtext(np_img)  # [(bbox, text, conf), ...]
    best = _pick_best_letter(results)
    if best is None:
        return None, 0.0, results
    label, conf = best
    return label, conf * 100.0, results
