# Sajid Innovations — Software & AI Solutions Platform

> **"Have an Idea? Let's Build It."**  
> *Built by Sajid Inamdar — Software & AI Solutions Builder*

---

## 🌟 Overview

**Sajid Innovations** is a modern, high-performance web platform and digital portfolio designed for **Sajid Inamdar**. It bridges the gap between everyday business owners, startup founders, and technical execution—enabling clients to explore software solutions, review real-world working projects, submit structured project ideas, and get in touch directly via WhatsApp, email, or phone.

---

## 🚀 Key Features

- **Branded Modern UI**: Built with a sleek dark aesthetic (`#0B0F17`), custom 3D "SI" monogram logo, mobile-responsive layouts, and accessible contrast.
- **Direct Email Alert System (Gmail SMTP)**:
  - Whenever a customer fills out the project inquiry form, an instant HTML notification with full client details is automatically sent to `inamdarsajid46@gmail.com`.
  - The customer receives an immediate confirmation receipt containing their unique Reference ID (`SI-2026-XXXXXX`) and 1-click WhatsApp follow-up link.
- **1-Click WhatsApp Synchronization**: Seamlessly connects customers directly to WhatsApp chat (`+91 8329465339`) with pre-filled project details and inquiry reference IDs.
- **Client-Focused Services (Plain English, Zero IT Jargon)**:
  1. *Business Websites & Online Presence*
  2. *Custom Web Applications & Portals*
  3. *Secure User Accounts & Behind-the-Scenes Engines*
  4. *Smart AI Chatbots & Customer Assistants*
  5. *Working Startup Prototypes (MVP)*
  6. *Automated Workflows & Daily Time-Savers*
- **Real-World Working Projects**:
  1. **CaterServ**: Hotel & Catering Online Booking Platform
  2. **Harit Setu**: Digital Platform & Marketplace for Farmers
  3. **AI Smart Email Writer & Automated Dispatcher**: Automated drafting and outbound email system
  4. **Baap Teams**: Organization Workspace & Team Collaboration Hub
  5. **QuickShare**: Secure File Sharing & Shortened Link Platform
  6. **Python 24/7 Smart Business Chatbot**: Always-on customer support and FAQ bot
- **11 Plain-English FAQs**: Direct, non-technical answers answering client questions about pricing, mobile compatibility, timelines, data privacy, and maintenance.
- **Administrator Portal (`#admin`)**: Secure interface for reviewing inquiries, changing lead status (New, Contacted, In Progress, Closed), and logging private internal notes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React |
| **Email Service** | Node.js, Nodemailer (Gmail SSL / App Password) |
| **Development Backend** | Express-compatible Vite API Middleware plugin |
| **Production Backend (Optional)** | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| **Security** | Honeypot anti-spam validation, sanitized HTML emails, JWT / Session token auth |

---

## 📁 Repository Structure

```text
├── public/                 # Favicon and logo assets (SI 3D monogram)
│   ├── favicon.ico
│   ├── favicon.png
│   └── logo.png
├── src/
│   ├── components/         # Navbar, Footer, FloatingWidget, Modals
│   ├── config/             # siteConfig.ts (All content, services, projects, FAQs)
│   ├── pages/              # AdminPage (Lead triage dashboard)
│   ├── sections/           # Hero, About, Services, Projects, Process, FAQ, Contact
│   ├── server/             # API server plugin & emailService.ts
│   ├── services/           # Frontend API client
│   ├── types/              # TypeScript interfaces
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entrypoint
├── backend/                # Optional Python FastAPI backend
│   ├── app/                # Routers, models, database session
│   └── requirements.txt
├── .env.example            # Environment variables template
├── .gitignore              # Production-grade git exclusion rules
├── index.html              # HTML shell & SEO meta tags
├── package.json            # Node dependencies
└── vite.config.ts          # Vite configuration with API & Email middleware
```

---

## 💻 Quick Start & Running Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/sajidinamdar/sajidinnovations.git
cd "New folder"

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# SMTP Configuration for Direct Email Alerts
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="inamdarsajid46@gmail.com"
SMTP_PASS="your-16-char-gmail-app-password"
NOTIFICATION_RECIPIENT="inamdarsajid46@gmail.com"
SENDER_NAME="Sajid Innovations Alerts"
```

> [!NOTE]
> For Gmail, generate a 16-character **App Password** from [Google Account Security](https://myaccount.google.com/apppasswords) (requires 2-Step Verification enabled).

### 4. Start the Application
```powershell
npm run dev
```

The application will start at:
- **Website**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/#admin`
  - *Username*: `admin`
  - *Password*: `sajidtech2026!`

---

## 🔨 Build for Production

```powershell
npm run build
```

This generates optimized static files in the `dist/` directory ready for deployment to any web host (Vercel, Netlify, Render, AWS, Hostinger, or VPS).

---

## 📞 Contact Information

- **Founder**: Sajid Inamdar
- **Brand**: Sajid Innovations — Software & AI Solutions
- **Primary Phone**: [+91 8329465339](tel:+918329465339)
- **Alternative Phone**: [+91 7798779332](tel:+917798779332)
- **WhatsApp**: [+91 8329465339](https://wa.me/918329465339)
- **Email**: [inamdarsajid46@gmail.com](mailto:inamdarsajid46@gmail.com)
- **Instagram**: [@sajidinamdar_](https://www.instagram.com/sajidinamdar_/)

---

© 2026 Sajid Innovations. All rights reserved.
