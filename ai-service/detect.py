import io
import os
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from PIL import Image

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None


MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "models/civicmate-yolov8.pt")

ISSUE_MAP = {
    "pothole": ("Potholes", "High"),
    "garbage": ("Garbage accumulation", "Medium"),
    "streetlight": ("Broken streetlights", "High"),
    "water_leakage": ("Water leakage", "Critical"),
    "road_damage": ("Road damage", "High"),
}

app = FastAPI(title="CivicMate YOLOv8 Detection Service", version="1.0.0")
model = YOLO(MODEL_PATH) if YOLO and os.path.exists(MODEL_PATH) else None


class DetectRequest(BaseModel):
    imageUrl: Optional[str] = None


def fallback_detection():
    return {"issueType": "Other", "confidence": 0.0, "priority": "Medium"}


def image_from_bytes(payload: bytes):
    try:
        return Image.open(io.BytesIO(payload)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image payload") from exc


def run_detection(image):
    if not model:
        return fallback_detection()

    results = model.predict(image, conf=0.25, verbose=False)
    boxes = results[0].boxes if results else None
    if boxes is None or len(boxes) == 0:
        return fallback_detection()

    best = max(boxes, key=lambda box: float(box.conf[0]))
    class_id = int(best.cls[0])
    class_name = model.names.get(class_id, "other")
    issue_type, priority = ISSUE_MAP.get(class_name, ("Other", "Medium"))

    return {
        "issueType": issue_type,
        "confidence": round(float(best.conf[0]), 3),
        "priority": priority,
    }


@app.get("/health")
def health():
    return {"ok": True, "modelLoaded": model is not None}


@app.post("/detect")
async def detect(request: Request):
    content_type = request.headers.get("content-type", "")

    if content_type.startswith("multipart/form-data"):
        form = await request.form()
        image = form.get("image")
        if not image:
            raise HTTPException(status_code=400, detail="Image file is required")
        payload = await image.read()
        return run_detection(image_from_bytes(payload))

    body = DetectRequest(**(await request.json()))
    if body.imageUrl:
        response = requests.get(body.imageUrl, timeout=15)
        response.raise_for_status()
        return run_detection(image_from_bytes(response.content))

    raise HTTPException(status_code=400, detail="Provide image upload or imageUrl")
