# CivicMate 100% Free Deployment Guide

This configuration avoids billing-required APIs.

## Free Replacements

| Original service | Free replacement used now |
| --- | --- |
| Google Maps Places API | OpenStreetMap data through Overpass API |
| Cloudinary | MongoDB GridFS upload storage |
| Gemini API | Built-in no-key CivicMate assistant |
| Paid database | MongoDB Atlas M0 free cluster |
| Paid frontend hosting | Vercel free/hobby deployment |
| Paid backend hosting | Render free web service, or another free Node host |

## Required Environment Variables

Backend:

```env
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-vercel-app.vercel.app
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/civicmate
JWT_ACCESS_SECRET=generate-a-long-random-secret
JWT_REFRESH_SECRET=generate-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
AI_SERVICE_URL=https://your-ai-service.onrender.com
OVERPASS_URL=https://overpass-api.de/api/interpreter
```

Frontend:

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

AI service:

```env
YOLO_MODEL_PATH=models/civicmate-yolov8.pt
```

## Important Free-Tier Notes

- MongoDB Atlas M0 has limited storage, so compress uploaded images before heavy use.
- Public Overpass API is free but shared. Keep requests user-triggered and avoid polling.
- Render free services may sleep after inactivity; first request can be slow.
- The built-in chatbot is deterministic and free. It is not a general LLM, but it covers CivicMate workflows.
- YOLOv8 is open source, but hosted inference on a free CPU can be slow.

## Deployment Order

1. Create MongoDB Atlas M0 cluster.
2. Deploy `ai-service` to Render.
3. Deploy `server` to Render.
4. Deploy `client` to Vercel.
5. Update backend `CLIENT_URL` after Vercel gives the final URL.
6. Test registration, complaint creation, image upload, emergency search, chatbot, and notifications.
