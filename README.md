<div align="center">

# ⚡ EduPulse LMS — Full-Stack Next.js 15 Learning Management System

An industrial-grade, full-stack Learning Management System built with **Next.js 15 (App Router)**, **MongoDB Mongoose**, **Secure HTTP-Only JWT Cookie Authentication**, **Vercel Blob Video Streaming**, and **Stripe Payments**. Built incrementally in structured parts.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.5-green?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🗺️ Project Roadmap & Progress

| Part | Phase | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Part 1** | **Foundation & Auth Engine** | ✅ **Completed** | Next.js 15 Setup, 5 Mongoose Schemas, HTTP-Only JWT Auth, Protected Dashboard |
| **Part 2** | Course Catalog & Management | ⏳ *Up Next* | Public Catalog, Filtering, Categories, Course CRUD & Admin Studio |
| **Part 3** | Video Streaming & Classroom | ⏳ *Upcoming* | Vercel Blob Video Upload, Interactive Classroom & Lesson Tracking |
| **Part 4** | Payments & Enrollments | ⏳ *Upcoming* | Stripe Webhooks, Checkout Sessions, Enrollment Guard & Invoices |
| **Part 5** | Analytics & Administration | ⏳ *Upcoming* | Revenue Charts, Enrollment Analytics, User Role Access Controls |
| **Part 6** | Deployment & Polish | ⏳ *Upcoming* | Production Deployment, Security Audits & Optimizations |

---

## 🏛️ Part 1: Foundation Overview

In **Part 1**, we built the core architecture and full-stack authentication system:

- **Database Model Layer (`src/models/`):** Initialized all 5 core Mongoose schemas with validation, compound indexing, and hot-reload safe exports:
  - `User`: Email uniqueness, Bcrypt 10 rounds password hashing (`select: false`), role support (`student` / `admin`).
  - `Category`: Unique names and URL slugs.
  - `Course`: Multi-level courses with pricing and category relations.
  - `Lesson`: Video durations, free preview flags, and compound index on `{ course: 1, order: 1 }`.
  - `Enrollment`: Unique compound index on `{ user: 1, course: 1 }` preventing duplicate course enrollments.
- **Stateless JWT Auth Engine (`src/lib/`):**
  - Cached global MongoDB connection handler (`src/lib/db.ts`).
  - JWT token signing & verification (`src/lib/jwt.ts`).
  - Secure HTTP-Only cookie handler (`lms_token`, SameSite Lax, 7-day expiration).
  - Universal server & route handler session extractors (`src/lib/auth.ts`).
- **RESTful Auth Endpoints (`src/app/api/auth/`):**
  - `POST /api/auth/register` — Validates email uniqueness and issues signed session cookie.
  - `POST /api/auth/login` — Compares bcrypt hash and establishes session.
  - `POST /api/auth/logout` — Clears authentication cookie.
  - `GET /api/auth/me` — Fetches active user session from token.
- **Client Session Context & Protection:**
  - `AuthContext.tsx` with instant session hydration and reactive state.
  - Role-aware sticky header navigation (`Navbar.tsx`).
  - Protected Dashboard (`/dashboard`) with client & server redirection to `/login` for unauthenticated requests.

---

## 📸 Part 1 Verification Screenshots

### 1. User Registration (`/register`)
![User Registration](docs/screenshots/01_register_page.png)

### 2. User Login (`/login`)
![User Login](docs/screenshots/02_login_page.png)

### 3. Authenticated Protected Dashboard (`/dashboard`)
![Authenticated Dashboard](docs/screenshots/03_dashboard_authenticated.png)

### 4. Duplicate Account Protection (Error Banner)
![Duplicate Registration Error](docs/screenshots/04_duplicate_registration_error.png)

---

## 🚀 Quick Start & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/MaazzAlii/edupulse-lms-nextjs.git
cd edupulse-lms-nextjs
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edupulse_lms?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📖 Architecture & Notes
For a comprehensive architectural breakdown and code structure, see **[LMS_Step_By_Step_Notes.md](./LMS_Step_By_Step_Notes.md)**.
