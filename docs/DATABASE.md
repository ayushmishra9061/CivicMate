# Database Schema

## Users

```json
{
  "name": "String",
  "email": "String unique",
  "password": "String hashed",
  "role": "citizen | provider | admin",
  "phone": "String",
  "address": "String",
  "createdAt": "Date"
}
```

## Complaints

```json
{
  "complaintId": "CM-YYYYMMDD-XXXXXX",
  "userId": "ObjectId<User>",
  "issueType": "Potholes | Garbage accumulation | Broken streetlights | Water leakage | Road damage | Other",
  "description": "String",
  "imageUrl": "String",
  "location": { "address": "String", "lat": "Number", "lng": "Number", "ward": "String", "city": "String" },
  "priority": "Low | Medium | High | Critical",
  "status": "Submitted | Verified | Assigned | In Progress | Resolved | Closed",
  "assignedTo": "ObjectId<ServiceProvider>",
  "createdAt": "Date"
}
```

## ServiceProviders

```json
{
  "businessName": "String",
  "category": "Electrician | Plumber | Carpenter | Cleaner | Technician",
  "phone": "String",
  "location": { "address": "String", "lat": "Number", "lng": "Number" },
  "rating": "Number",
  "verified": "Boolean"
}
```

## Notifications

```json
{
  "userId": "ObjectId<User>",
  "title": "String",
  "message": "String",
  "read": "Boolean"
}
```

## ChatHistory

```json
{
  "userId": "ObjectId<User>",
  "messages": [
    { "role": "user | assistant", "content": "String", "createdAt": "Date" }
  ]
}
```
