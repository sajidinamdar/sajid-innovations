# Deployment Guide: sajidtech Platform

This guide explains how to deploy the **sajidtech** portfolio and software solutions platform to production.

---

## Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS deployed to **Vercel** or **Cloudflare Pages**.
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy 2.0 deployed to **Render**, **Railway**, or **Fly.io**.
- **Database**: Managed **PostgreSQL** (Neon, Supabase, Railway, or AWS RDS).
- **Domain**: Configured via DNS records (A / CNAME).

---

## 1. Database Setup (PostgreSQL)

1. Provision a PostgreSQL instance on Neon, Supabase, or Railway.
2. Copy your connection URI:
   ```
   postgresql+asyncpg://<username>:<password>@<host>:5432/<database_name>
   ```

---

## 2. Backend Deployment (Render or Railway)

### Using Render
1. Create a new **Web Service** linked to your repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   - `ENVIRONMENT`: `production`
   - `DATABASE_URL`: Your PostgreSQL async URI
   - `SECRET_KEY`: Generate a random 64-char string (`openssl rand -hex 32`)
   - `ADMIN_USERNAME`: Your chosen admin username
   - `ADMIN_PASSWORD`: Your strong admin password
   - `CORS_ORIGINS`: `["https://your-frontend-domain.vercel.app"]`
   - `ADMIN_NOTIFICATION_EMAIL`: `inamdarsajid46@gmail.com`

---

## 3. Frontend Deployment (Vercel)

1. Import your GitHub repository to **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - If deploying with separate backend URL:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
6. Add `vercel.json` rewrites for SPA routing:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://your-backend.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 4. Domain & SSL Setup

1. Add your custom domain in Vercel settings (e.g. `sajidtech.com`).
2. Point your DNS records:
   - `A` record for `@` pointing to `76.76.21.21`
   - `CNAME` for `www` pointing to `cname.vercel-dns.com`
3. SSL certificates are provisioned automatically via Let's Encrypt.
