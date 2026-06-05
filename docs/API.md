# CivicMate API

Base URL: `/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Complaints

- `POST /complaints` multipart form with `description`, `issueType`, `location`, optional `image`
- `GET /complaints`
- `GET /complaints/:id`
- `PUT /complaints/:id`
- `DELETE /complaints/:id`
- `PUT /complaints/:id/assign`

Status values: `Submitted`, `Verified`, `Assigned`, `In Progress`, `Resolved`, `Closed`.

## AI

- `POST /ai/detect`
- `POST /ai/chat`
- `GET /ai/chat/history`

Detection response:

```json
{
  "issueType": "Potholes",
  "confidence": 0.91,
  "priority": "High"
}
```

## Emergency

- `GET /emergency/hospitals?lat=0&lng=0`
- `GET /emergency/police?lat=0&lng=0`
- `GET /emergency/firestations?lat=0&lng=0`
- `GET /emergency/ambulance?lat=0&lng=0`

## Providers

- `GET /providers`
- `POST /providers`
- `PUT /providers/:id`

## Notifications

- `GET /notifications`
- `PUT /notifications/:id/read`

Socket events:

- Client emits `join:user` with user id.
- Client emits `join:admin` for admin room.
- Server emits `notification:new`.
- Server emits `complaint:new`.

## Admin

- `GET /admin/analytics`
- `GET /admin/users`
