# CivicMate AI Service

This service exposes a YOLOv8-compatible issue detection endpoint.

## Endpoints

- `GET /health`
- `POST /detect`

`/detect` accepts either multipart image upload or JSON with `imageUrl`.

Response:

```json
{
  "issueType": "Potholes",
  "confidence": 0.91,
  "priority": "High"
}
```

## Model

Place trained weights at `models/civicmate-yolov8.pt` or set `YOLO_MODEL_PATH`.

The expected classes are:

- pothole
- garbage
- streetlight
- water_leakage
- road_damage

If no model is present, the service returns a deterministic development fallback.
