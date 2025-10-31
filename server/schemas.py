from pydantic import BaseModel
from typing import Optional, Literal

Status = Literal["in_progress", "completed"]

class ScannedItemBase(BaseModel):
    label: Optional[str] = None
    confidence: Optional[float] = None
    raw_text: Optional[str] = None
    image_url: str
    status: Status

class ScannedItemOut(ScannedItemBase):
    id: int
    created_at: str
    class Config:
        orm_mode = True

class InventoryItemOut(BaseModel):
    id: int
    label: Optional[str]
    confidence: Optional[float]
    raw_text: Optional[str]
    image_url: Optional[str]
    created_at: str

    class Config:
        orm_mode = True

class InventoryGroupOut(BaseModel):
    label: Optional[str]
    count: int
    latest_image_url: Optional[str] = None
    latest_created_at: Optional[str] = None
    avg_confidence: Optional[float] = None