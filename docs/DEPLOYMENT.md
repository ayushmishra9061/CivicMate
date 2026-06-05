# Deployment Guide

For the zero-cost setup, use [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md). This project now defaults to free/open replacements for Cloudinary, Google Maps, and Gemini.

## MongoDB Atlas

1. Create an Atlas cluster.
2. Create an application database user.
3. Add Render outbound IPs or `0.0.0.0/0` during development only.
4. Put the connection string in `MONGO_URI`.

## Backend on Render

1. Create a Web Service from the repository.
2. Set root directory to `server`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Add environment variables from `.env.example`.
6. Set `CLIENT_URL` to the Vercel frontend URL.

## Frontend on Vercel

1. Import the repository.
2. Set root directory to `client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL` and `VITE_SOCKET_URL`.

## AI Service

Deploy `ai-service` as a separate Render Web Service or container service.

1. Upload the trained YOLOv8 weights as a private artifact or mount.
2. Set `YOLO_MODEL_PATH`.
3. Set backend `AI_SERVICE_URL` to the AI service URL.

## Production Checklist

- Rotate JWT secrets before launch.
- Restrict CORS to trusted frontend origins.
- Keep complaint image uploads within the MongoDB Atlas M0 storage limits.
- Enable MongoDB Atlas backups.
- Add uptime checks for API and AI service.
- Configure custom domains and HTTPS.
