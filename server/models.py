from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from .db import Base
from datetime import datetime

class ScanStatus(str, enum.Enum):
    in_progress = "in_progress"
    completed = "completed"

class ScannedItem(Base):
    __tablename__ = "scanned_items"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(64), nullable=True)   # e.g., OCR letter or code
    confidence = Column(Float, nullable=True)   # 0..100
    raw_text = Column(Text, nullable=True)      # full OCR text if needed
    image_path = Column(String, nullable=False) # server path in /uploads
    status = Column(Enum(ScanStatus), default=ScanStatus.in_progress, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    # optional: link back to the scan that produced it
    source_scan_id = Column(Integer, ForeignKey("scanned_items.id"), nullable=True)

    label = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    raw_text = Column(String, nullable=True)
    image_path = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)  # when it entered inventory

    # relationship (optional)
    source_scan = relationship("ScannedItem", backref="inventory_row", uselist=False)