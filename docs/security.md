# Security & Anti-Spam Architecture: sajidtech Platform

This document outlines the security controls, authentication safeguards, and anti-abuse architecture implemented across the platform.

---

## 1. Input Sanitization & Anti-Spam Safeguards

- **Honeypot Trap**: An invisible form field (`website_fax_code` / `honeypot`) is placed in the DOM with `tabindex="-1"` and hidden styling. Automated spambots filling this field receive a false success response (`201 Created`) without saving data to the database.
- **Strict Server-Side Validation**: All incoming payloads are validated using Pydantic (Python) or strict Node schema checks. Minimum character requirements (Name $\ge 2$, Title $\ge 3$, Problem $\ge 10$) and regex-verified email syntax are enforced.
- **Payload Size Limits**: Strict 1MB maximum body buffers prevent memory exhaustion attacks.
- **Reference ID Obfuscation**: Public inquiries receive pseudo-random alphanumeric identifiers (`SI-2026-XXXXXX`) rather than auto-incrementing database integers, preventing ID enumeration.

---

## 2. Administrator Authentication & Authorization

- **No Plaintext Passwords**: Production passwords must be hashed using industry-standard Argon2id or bcrypt.
- **Protected Administrative Endpoints**: All `/api/admin/*` routes verify the HTTP `Authorization: Bearer <token>` header on the backend.
- **Internal Note Privacy**: Administrator notes and triage timestamps are completely excluded from public endpoints (`/api/ideas`, `/api/projects`).
- **Timing Safe Authentication**: Generic rejection messages ("Invalid administrator credentials") avoid disclosing whether a particular username exists.

---

## 3. Data Protection & Privacy Discipline

- **No Third-Party Ad Trackers**: No third-party behavioral pixels, telemetry beacons, or advertising cookies are injected into the visitor's browser.
- **Zero Sensitive Storage**: No credit card information, bank account details, or government identity documents are requested or stored.
- **CORS Lockdown**: Production backend restricts CORS headers strictly to authorized domain origins configured in `CORS_ORIGINS`.
