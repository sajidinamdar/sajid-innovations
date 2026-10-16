# REST API Documentation: sajidtech Platform

All API endpoints reside under the `/api` route prefix.

---

## Public Endpoints

### 1. Health Check
- **Route**: `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "service": "sajidtech-solutions-api",
  "timestamp": "2026-10-15T12:00:00.000Z"
}
```

### 2. Submit Project Idea
- **Route**: `POST /api/ideas`
- **Request Body**:
```json
{
  "name": "Arjun Mehta",
  "email": "arjun@example.com",
  "phone": "+91 9820123456",
  "company": "FinTech Labs",
  "title": "Document AI Knowledge Engine",
  "service_category": "RAG Application (Document Intelligence)",
  "problem_description": "We need to search through 500-page regulatory PDFs...",
  "target_users": "Internal compliance officers",
  "desired_solution": "Vector embeddings search",
  "requested_features": "PDF upload, source citations",
  "budget_range": "₹50,000 – ₹1,00,000",
  "timeline": "Within 2–4 weeks",
  "preferred_contact": "whatsapp",
  "consent": true,
  "honeypot": ""
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "ref_id": "SI-2026-849201",
  "message": "Thank you for sharing your idea. Your submission has been received..."
}
```

### 3. List Public Projects
- **Route**: `GET /api/projects`
- **Response**: `200 OK`
```json
{
  "projects": [ ... ]
}
```

---

## Authentication Endpoints

### 1. Admin Login
- **Route**: `POST /api/auth/login`
- **Request**:
```json
{
  "username": "admin",
  "password": "your_secure_password"
}
```
- **Response**: `200 OK`
```json
{
  "token": "adm_...",
  "user": { "username": "admin", "role": "admin" }
}
```

### 2. Current Administrator Session
- **Route**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## Protected Administrator Endpoints
*(Requires `Authorization: Bearer <token>`)*

### 1. Dashboard Statistics
- **Route**: `GET /api/admin/stats`
- **Response**: `200 OK`
```json
{
  "total": 3,
  "newCount": 1,
  "contactedCount": 1,
  "inProgressCount": 1,
  "completedCount": 0
}
```

### 2. List Inquiries (with Search & Filters)
- **Route**: `GET /api/admin/ideas?search=&status=&category=&page=1&limit=15`
- **Response**: `200 OK` with pagination metadata.

### 3. Single Inquiry Details
- **Route**: `GET /api/admin/ideas/{id}`

### 4. Update Inquiry Triage
- **Route**: `PATCH /api/admin/ideas/{id}`
- **Request**:
```json
{
  "status": "contacted",
  "internal_notes": "Discussed scope on WhatsApp, sending technical proposal Friday.",
  "follow_up_date": "2026-10-20"
}
```

### 5. Delete Inquiry
- **Route**: `DELETE /api/admin/ideas/{id}`
