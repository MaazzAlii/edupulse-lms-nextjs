<div align="center">

# ⚡ EduPulse LMS — Next.js 14 Learning Management System

An industrial-grade, full-stack Learning Management System built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Stripe Checkout Simulation**, and an interactive **Admin Studio**.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Deployable-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🌟 Key Features

### 👨‍🎓 Student Learning Experience
- **Interactive Video Classroom (`/learn/[courseId]`):** Video streaming with playlist navigation, timestamp jumping, lesson completion checkboxes, and live Q&A threads with instructor replies.
- **Course Catalog & Filtering (`/courses`):** Filter by category (Web Dev, AI, Cloud, UI/UX, Data Science), skill level (Beginner, Intermediate, Expert), price sorting, and instant search.
- **Detailed Course Syllabus (`/courses/[id]`):** Module breakdown, free preview video modal, instructor credentials, and student reviews.
- **Stripe Checkout & Instant Enrollment:** Card payment gateway modal with promo coupons, instant invoice generation, and immediate course access.
- **Student Dashboard ("My Learning"):** Track percentage completion per course and generate verifiable completion certificates.

### 🛡️ Instructor & Admin Studio (`/admin`)
- **Executive Analytics Dashboard:** Gross revenue metrics, total student count, 12-month sales chart, and top performing masterclasses.
- **Full Course Builder Studio (`/admin/courses`):** Create, edit, publish/draft, and delete masterclasses with comprehensive section/lesson/video builders.
- **User & Access Management (`/admin/users`):** Manage student accounts, inspect enrollments, and toggle roles (Admin ↔ Student).
- **Financial Analytics (`/admin/analytics`):** Category revenue distribution and payment gateway volume split.

---

## 📸 Interface Walkthrough & Screenshots

### 1. Landing Page & Hero
![Home Page Hero](docs/screenshots/01_home_page_hero.png)

### 2. Category Navigation
![Categories](docs/screenshots/02_home_page_categories.png)

### 3. Course Catalog with Filters & Search
![Courses Catalog](docs/screenshots/03_courses_catalog.png)

### 4. Course Details & Syllabus
![Course Details](docs/screenshots/04_course_details.png)

### 5. Interactive Video Player Classroom
![Classroom Video Player](docs/screenshots/05_learn_classroom.png)

### 6. Student Portal & Progress Tracker
![Student Portal](docs/screenshots/06_student_portal.png)

### 7. Admin Executive Dashboard & 12-Month Sales Chart
![Admin Dashboard](docs/screenshots/07_admin_dashboard.png)

### 8. Course Management Studio (Full CRUD)
![Admin Courses](docs/screenshots/08_admin_courses.png)

### 9. User Role Management
![Admin Users](docs/screenshots/09_admin_users.png)

### 10. Financial & Category Revenue Analytics
![Admin Analytics](docs/screenshots/10_admin_analytics.png)

---

## 🚀 Quick Start & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/MaazzAlii/edupulse-lms-nextjs.git
cd edupulse-lms-nextjs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deploying to Vercel (1-Click Ready)

This repository is optimized for zero-configuration deployment on **Vercel**:
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import `edupulse-lms-nextjs`.
4. Click **"Deploy"**. Next.js App Router will automatically compile all static and dynamic edge routes.

---

## 📖 Architecture & Learning Notes
Check the complete step-by-step backend and LMS architecture guide in **[LMS_Step_By_Step_Notes.md](./LMS_Step_By_Step_Notes.md)**.
