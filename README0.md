# CivicMate

CivicMate is an AI powered smart citizen assistance platform for reporting civic issues, detecting issue categories from uploaded images, tracking complaint status, finding emergency services, connecting with verified service providers, and receiving realtime updates.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Socket.io client
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, Socket.io
- Storage: MongoDB GridFS on the free MongoDB Atlas M0 tier
- Maps/Emergency data: OpenStreetMap through the public Overpass API
- AI: built-in no-key civic assistant plus a YOLOv8-compatible Python detection service
- Deployment: Vercel frontend, Render backend, MongoDB Atlas database

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

Run the Python AI service separately when using local image detection:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn detect:app --host 0.0.0.0 --port 8000
```

## Workspaces

- `client/` - React application
- `server/` - Express API and Socket.io server
- `ai-service/` - YOLOv8 detection microservice
- `docs/` - architecture and deployment notes

## Core Roles

- Citizen: report and track complaints, find emergency services, chat with AI, view history
- Service Provider: register business profile, receive assignments, update service status
- Admin: manage complaints, assign work, verify providers, manage users, view analytics

## Free-Only Environment

Use `.env.example` as the source of truth for required variables. The default architecture does not require Cloudinary, Google Maps, Gemini, Mapbox, or paid API keys. Never commit real secrets.

## Tests

```bash
npm test
```

Server tests use Vitest and Supertest. Frontend tests use Vitest and React Testing Library.
