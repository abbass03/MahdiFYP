# server/app.py
from __future__ import annotations

import os
from io import BytesIO
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
from sqlalchemy import func
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from .ocr import run_ocr
from .models import ScannedItem, ScanStatus, InventoryItem
from .schemas import (
    ScannedItemOut,
    InventoryItemOut,
    InventoryGroupOut,
)

# ---------- App & config ----------

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RoboWarehouse API", version="0.1.0")

# CORS: allow your front-end during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads dir & static mounting
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ---------- Helpers ----------

def to_public_url(path: Optional[str]) -> Optional[str]:
    if not path:
        return None
    return f"/uploads/{os.path.basename(path)}"


def _scan_to_out(i: ScannedItem) -> ScannedItemOut:
    return ScannedItemOut(
        id=i.id,
        label=i.label,
        confidence=i.confidence,
        raw_text=i.raw_text,
        image_url=to_public_url(i.image_path),
        status=i.status.value,
        created_at=i.created_at.isoformat(),
    )


def _inventory_to_out(r: InventoryItem) -> InventoryItemOut:
    return InventoryItemOut(
        id=r.id,
        label=r.label,
        confidence=r.confidence,
        raw_text=r.raw_text,
        image_url=to_public_url(r.image_path),
        created_at=r.created_at.isoformat(),
    )


# ---------- Routes ----------

@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "docs": "/docs"}


# --- Scans (inbound log) ---

@app.post("/scans", response_model=ScannedItemOut, tags=["scans"])
async def create_scan(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload an image (robot or human), run OCR, create an 'in_progress' scan."""
    raw = await file.read()
    try:
        img = Image.open(BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image")

    filename = f"{os.path.splitext(file.filename or 'scan')[0]}_{os.getpid()}_{str(abs(hash(raw)))[:6]}.png"
    save_path = os.path.join(UPLOAD_DIR, filename)
    img.save(save_path)

    # OCR
    label, conf, results = run_ocr(img)

    # Persist
    item = ScannedItem(
        label=label,
        confidence=conf,
        raw_text=", ".join([r[1] for r in results]) if results else None,
        image_path=save_path,
        status=ScanStatus.in_progress,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _scan_to_out(item)


@app.get("/scans", response_model=List[ScannedItemOut], tags=["scans"])
def list_scans(db: Session = Depends(get_db)):
    items = (
        db.query(ScannedItem)
        .order_by(ScannedItem.created_at.desc())
        .all()
    )
    return [_scan_to_out(i) for i in items]


@app.post("/scans/{scan_id}/approve", response_model=ScannedItemOut, tags=["scans"])
def approve_scan(scan_id: int, db: Session = Depends(get_db)):
    """Mark a scan completed AND copy it into inventory_items."""
    item = db.query(ScannedItem).filter(ScannedItem.id == scan_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Scan not found")

    # mark scan completed
    item.status = ScanStatus.completed
    db.add(item)

    # copy into inventory (do not move/delete the file)
    inv = InventoryItem(
        source_scan_id=item.id,
        label=item.label,
        confidence=item.confidence,
        raw_text=item.raw_text,
        image_path=item.image_path,
        created_at=datetime.utcnow(),
    )
    db.add(inv)

    db.commit()
    db.refresh(item)
    return _scan_to_out(item)


@app.post("/scans/clear_completed", tags=["scans"])
def clear_completed_scans(db: Session = Depends(get_db)):
    """
    Remove ALL completed scans from the scans log ONLY.
    We DO NOT delete image files here because inventory cards may reference them.
    """
    deleted = (
        db.query(ScannedItem)
        .filter(ScannedItem.status == ScanStatus.completed)
        .delete(synchronize_session=False)
    )
    db.commit()
    return {"deleted": int(deleted)}


# --- Inventory (approved stock) ---

@app.get("/inventory", response_model=List[InventoryItemOut], tags=["inventory"])
def inventory(db: Session = Depends(get_db)):
    rows = (
        db.query(InventoryItem)
        .order_by(InventoryItem.created_at.desc())
        .all()
    )
    return [_inventory_to_out(r) for r in rows]


@app.get("/inventory/grouped", response_model=List[InventoryGroupOut], tags=["inventory"])
def inventory_grouped(db: Session = Depends(get_db)):
    """
    One row per label with: count, avg_confidence, latest image/time.
    """
    agg = (
        db.query(
            InventoryItem.label.label("label"),
            func.count(InventoryItem.id).label("count"),
            func.avg(InventoryItem.confidence).label("avg_conf"),
            func.max(InventoryItem.created_at).label("latest_ts"),
        )
        .group_by(InventoryItem.label)
        .all()
    )

    out: List[InventoryGroupOut] = []
    for row in agg:
        latest = (
            db.query(InventoryItem)
            .filter(InventoryItem.label == row.label)
            .order_by(InventoryItem.created_at.desc())
            .first()
        )
        out.append(
            InventoryGroupOut(
                label=row.label,
                count=int(row.count or 0),
                avg_confidence=float(row.avg_conf or 0.0) if row.avg_conf is not None else None,
                latest_created_at=row.latest_ts.isoformat() if row.latest_ts else None,
                latest_image_url=to_public_url(latest.image_path) if latest else None,
            )
        )
    return out
