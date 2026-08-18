# 🎓 Full MERN Stack LMS (Learning Management System) - Step-by-Step Notes
> **Video Source:** [Becodemy - All Functional MERN Stack LMS Series with Next 13 & TypeScript (Part 1)](https://www.youtube.com/watch?v=kf6yyxMck8Y)  
> **Topic:** Complete Industrial-Level LMS Backend Architecture (Node.js, Express, TypeScript, MongoDB, Redis, Cloudinary)

---

## 📌 Table of Contents
1. [Project Overview & Architecture Plan](#1-project-overview--architecture-plan)
2. [Tech Stack Explanation (Why We Use What)](#2-tech-stack-explanation-why-we-use-what)
3. [Step 1: Project & TypeScript Server Setup](#3-step-1-project--typescript-server-setup)
4. [Step 2: Database & Cloud Services Connections](#4-step-2-database--cloud-services-connections)
5. [Step 3: Robust Error Handling Architecture](#5-step-3-robust-error-handling-architecture)
6. [Step 4: User Model & Secure Authentication System](#6-step-4-user-model--secure-authentication-system)
7. [Step 5: Authentication & Role Authorization Middlewares](#7-step-5-authentication--role-authorization-middlewares)
8. [Step 6: User Profile Management & Avatar Upload](#8-step-6-user-profile-management--avatar-upload)
9. [Step 7: Course Management System (CRUD, Q&A, Reviews)](#9-step-7-course-management-system-crud-qa-reviews)
10. [Step 8: Orders, Payments & Automated Cron Notifications](#10-step-8-orders-payments--automated-cron-notifications)
11. [Step 9: Admin Dashboard & Analytics Engine](#11-step-9-admin-dashboard--analytics-engine)
12. [Step 10: Dynamic Layout Management (Hero, FAQ, Categories)](#12-step-10-dynamic-layout-management-hero-faq-categories)
13. [Step 11: Advanced Redis Caching & Cache Invalidation](#13-step-11-advanced-redis-caching--cache-invalidation)
14. [Quick Reference API Cheat Sheet](#14-quick-reference-api-cheat-sheet)

---

## 1. Project Overview & Architecture Plan
*(Timestamp: 00:00:00 - 00:37:34)*

### 🎯 What is this LMS?
An industrial-grade online education platform (like Udemy / Coursera) containing:
- **Student Features:** Browse courses, view previews, purchase courses, watch video lessons, ask questions in video timestamps, write reviews, and receive email updates.
- **Admin Features:** Upload video lessons, structure modules, manage pricing, view financial & user growth analytics, handle user roles, customize homepage hero banners/FAQs/categories.
- **Performance & Security:** High-speed in-memory session and cache storage with Redis, JWT authentication with silent refresh tokens, and Cloudinary media processing.

### 📐 Backend Folder Architecture
```text
server/
├── @types/             # Custom TypeScript definitions
├── controllers/        # Business logic for endpoints (user, course, order, etc.)
├── mails/              # EJS email templates (activation, question reply, order confirmation)
├── middleware/         # Auth guards, error handlers, role validators
├── models/             # Mongoose database schemas (User, Course, Order, Notification, Layout)
├── routes/             # Express API routes
├── services/           # Reusable database and cache services
├── utils/              # Redis client, DB connection, JWT helpers, email sender, error classes
├── app.ts              # Express app configuration & global middleware
├── server.ts           # Server initialization & database bootstrap
├── tsconfig.json       # TypeScript compiler settings
└── package.json        # Dependencies & start scripts
```

---

## 2. Tech Stack Explanation (Why We Use What)
*(Timestamp: 00:37:34 - 00:53:09)*

| Technology | Why It's Used | In Simple Words |
| :--- | :--- | :--- |
| **TypeScript** | Static typing, interface checking, IntelliSense | Catches code errors before running the application |
| **Node.js & Express** | Fast, scalable, non-blocking asynchronous server | The engine that handles API requests and responses |
| **MongoDB & Mongoose** | Flexible JSON-like document database | Stores users, courses, orders, and site data |
| **Redis** | Super-fast in-memory key-value database | Stores user sessions & caches course data for speed |
| **Cloudinary** | Cloud image and video management CDN | Stores user profile pictures and course thumbnails |
| **JWT (JSON Web Tokens)** | Stateless token-based user verification | Securely tracks logged-in users with Access & Refresh tokens |
| **Nodemailer + EJS** | Email sending with customizable HTML templates | Sends OTP codes and notification emails to users |
| **Node-Cron** | Task scheduler for background routines | Automatically deletes old read notifications |

---

## 3. Step 1: Project & TypeScript Server Setup
*(Timestamp: 00:53:09 - 01:04:21)*

### 1. Initialize Node project
```bash
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm i express dotenv mongoose ioredis jsonwebtoken bcryptjs cors cookie-parser cloudinary nodemailer ejs node-cron

# Development dependencies (TypeScript & Type Definitions)
npm i -D typescript ts-node-dev @types/node @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcryptjs @types/nodemailer @types/ejs @types/node-cron
```

### 3. Initialize TypeScript Configuration (`tsconfig.json`)
```bash
npx tsc --init
```
Key settings to enable inside `tsconfig.json`:
- `"target": "es2020"`
- `"module": "commonjs"`
- `"rootDir": "./"`
- `"outDir": "./dist"`
- `"strict": true`
- `"esModuleInterop": true`

### 4. Create `app.ts` (Express Configuration)
```typescript
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";

dotenv.config();
export const app = express();

// 1. Body parser with limits for base64 / Cloudinary uploads
app.use(express.json({ limit: "50mb" }));

// 2. Cookie parser for reading tokens
app.use(cookieParser());

// 3. CORS configuration for frontend connection
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// 4. Testing route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "API is working properly" });
});

// 5. Global Error Handling Middleware (Always at the bottom)
app.use(ErrorMiddleware);
```

### 5. Create `server.ts` (Server Launcher)
```typescript
import { app } from "./app";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server connected on port ${PORT}`);
  connectDB();
});
```

---

## 4. Step 2: Database & Cloud Services Connections
*(Timestamp: 01:04:21 - 01:26:03)*

### 1. MongoDB Connection (`utils/db.ts`)
```typescript
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl: string = process.env.DB_URI || "";

const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`🍃 Database connected with ${data.connection.host}`);
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

export default connectDB;
```

### 2. Redis Connection (`utils/redis.ts`)
Redis acts as a high-speed cache and stores user sessions.
```typescript
import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("⚡ Redis connected successfully");
    return process.env.REDIS_URL;
  }
  throw new Error("Redis connection failed: REDIS_URL missing");
};

export const redis = new Redis(redisClient());
```

---

## 5. Step 3: Robust Error Handling Architecture
*(Timestamp: 01:26:03 - 01:43:22)*

Instead of using repetitive `try-catch` blocks everywhere with messy response formats, we use:
1. **`ErrorHandler` Class:** Custom class inheriting from JavaScript's built-in `Error`.
2. **`CatchAsyncError` Wrapper:** Automatically catches unhandled promise rejections.
3. **`ErrorMiddleware`:** Centralized error interceptor handling MongoDB & JWT errors cleanly.

### Custom Error Class (`utils/ErrorHandler.ts`)
```typescript
class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
```

### Async Error Wrapper (`middleware/catchAsyncErrors.ts`)
```typescript
import { Request, Response, NextFunction } from "express";

export const CatchAsyncError =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
```

### Central Error Middleware (`middleware/error.ts`)
```typescript
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB ObjectId Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate Key Error (e.g. email already exists)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }

  // JWT Token Expired
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired, try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
```

---

## 6. Step 4: User Model & Secure Authentication System
*(Timestamp: 01:43:22 - 03:12:02)*

### How Authentication Works:
1. **Register:** User enters Name, Email, Password. Server generates a 4-digit OTP, creates an Activation Token (signed JWT containing user info + OTP), and emails the OTP using an EJS template.
2. **Activate:** User inputs the 4-digit code. Server verifies the code against the token and creates the user in MongoDB.
3. **Login:** Server verifies email & password (via bcrypt), generates an **Access Token** (short-lived, e.g. 5m) and a **Refresh Token** (long-lived, e.g. 3 days), caches user data in **Redis**, and stores tokens in **HTTP-only secure cookies**.

### User Model (`models/user.model.ts`)
```typescript
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: (value: string) => emailRegexPattern.test(value),
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Do not return password by default in queries
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    courses: [{ courseId: String }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password!, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign Access Token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// Sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
```

### JWT Token Helper & Redis Session Storage (`utils/jwt.ts`)
```typescript
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Token cookie options
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  maxAge: 5 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
  maxAge: 3 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Save session to Redis
  redis.set(user._id.toString(), JSON.stringify(user));

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
```

---

## 7. Step 5: Authentication & Role Authorization Middlewares
*(Timestamp: 03:12:02 - 03:23:34)*

### Middleware Guards (`middleware/auth.ts`)
1. **`isAuthenticated`:** Reads `access_token` cookie, decodes user ID, pulls session from Redis, and sets `req.user`.
2. **`authorizeRoles`:** Protects administrative endpoints from regular users.

```typescript
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// Check if user is logged in
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(new ErrorHandler("Please login to access this resource", 400));
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is invalid", 400));
    }

    // Retrieve active user from Redis session
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User session expired, please login again", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);

// Role Authorization Middleware (e.g. admin only)
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
```

---

## 8. Step 6: User Profile Management & Avatar Upload
*(Timestamp: 03:49:16 - 04:19:55)*

Key user profile functionalities:
1. **Update User Info:** Allows modifying user name and email.
2. **Update Password:** Checks `oldPassword` using `comparePassword`, and assigns `newPassword`.
3. **Update Avatar with Cloudinary:**
   - Deletes the previous image from Cloudinary using `public_id`.
   - Uploads new base64 image to `"avatars"` folder.
   - Updates user record in MongoDB and synchronizes cache in Redis.

```typescript
// Updating Avatar Controller Snippet
export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (avatar && user) {
      // If user already has an avatar on Cloudinary, delete old one
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await user.save();
      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({ success: true, user });
    }
  }
);
```

---

## 9. Step 7: Course Management System (CRUD, Q&A, Reviews)
*(Timestamp: 04:19:55 - 06:14:48)*

### Course Schema Architecture (`models/course.model.ts`)
A course contains:
- Basic info: `name`, `description`, `price`, `estimatedPrice`, `thumbnail`, `tags`, `level`, `demoUrl`.
- Benefits & Prerequisites list.
- **`courseData` (Sections/Episodes):** Title, description, `videoUrl`, `videoLength`, Q&A section.
- **Reviews & Ratings:** User comments with star ratings and instructor replies.

```typescript
interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: Array<{ title: string; url: string }>;
  suggestion: string;
  questions: IComment[];
}
```

### Key Course Operations:
- **Public Course View (`getSingleCourse` & `getAllCourses`):** Returns course data *without* private video URLs (for unpurchased visitors). Data is cached in Redis for fast load times.
- **Purchased Course View (`getCourseByUser`):** Verifies that the logged-in user has purchased the course (by checking `user.courses`) and provides full video streaming URLs and course content.
- **Add Question & Reply in Video:** Students can post questions under a specific video section. Instructors receive an automated email notification with link and details when a question is asked.
- **Add Review & Rating:** Enrolled students can rate the course (1–5 stars) and write feedback. Calculates the average rating dynamically.

---

## 10. Step 8: Orders, Payments & Automated Cron Notifications
*(Timestamp: 06:14:48 - 07:14:23)*

### 1. Order Creation Workflow (`controllers/order.controller.ts`)
1. User provides `courseId` and `payment_info`.
2. Validates that the user has not already purchased the course.
3. Sends an order confirmation invoice email (via EJS template).
4. Adds the `courseId` to the user's `courses` array in MongoDB and updates the Redis session.
5. Increments the course `purchased` count.
6. Creates a new **Notification** document for the Admin Dashboard.

### 2. Automated Notification Cleanup with `node-cron` (`utils/analytics.generator.ts`)
Deletes all notifications marked as `"read"` that are older than 30 days every night at midnight:
```typescript
import cron from "node-cron";
import notificationModel from "../models/notification.model";

// Cron job runs at 00:00 every day
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("🧹 Deleted 30-day-old read notifications");
});
```

---

## 11. Step 9: Admin Dashboard & Analytics Engine
*(Timestamp: 07:14:23 - 08:00:16)*

### 12-Month Historical Analytics Generator (`utils/analytics.generator.ts`)
Generates monthly counts of new users, course sales, and revenue for the last 12 months for rendering Admin charts.

```typescript
import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    last12Months.push({ month: monthYear, count });
  }
  return { last12Months };
}
```

---

## 12. Step 10: Dynamic Layout Management (Hero, FAQ, Categories)
*(Timestamp: 08:00:16 - 08:39:20)*

Instead of hardcoding the homepage banner, FAQ items, and category filters, an Admin can dynamically manage them via the `Layout` model.

### Layout Schema (`models/layout.model.ts`)
```typescript
const layoutSchema = new Schema({
  type: { type: String }, // "Banner", "FAQ", or "Categories"
  faq: [{ question: String, answer: String }],
  categories: [{ title: String }],
  banner: {
    image: { public_id: String, url: String },
    title: String,
    subTitle: String,
  },
});
```

### Endpoints:
- `POST /create-layout` (Admin only)
- `PUT /edit-layout` (Admin only)
- `GET /get-layout/:type` (Public - used by Next.js frontend to render Hero & FAQ)

---

## 13. Step 11: Advanced Redis Caching & Cache Invalidation
*(Timestamp: 08:39:20 - 08:55:00)*

### Why Invalidate Caches?
When an admin edits a course or updates the hero layout, visitors shouldn't see stale cached data from Redis.

### Strategy:
1. **On Read:** Check Redis for key `allCourses`. If found, return instantly. If not found, fetch from MongoDB, store in Redis, and return.
2. **On Write/Update/Delete:** Update MongoDB **and** delete or update the Redis key (`redis.del("allCourses")`).

```typescript
// Example: Invalidate Cache on Course Update
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Update in MongoDB
    const course = await courseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // 2. Invalidate / update Redis cache
    await redis.set(req.params.id, JSON.stringify(course));
    await redis.del("allCourses");

    res.status(200).json({ success: true, course });
  }
);
```

---

## 14. Quick Reference API Cheat Sheet

### 🔐 Auth & User Routes (`/api/v1/`)
- `POST /registration` - Register user & send OTP email
- `POST /activate-user` - Verify OTP & create database account
- `POST /login` - Login with email/password & receive cookies
- `GET /logout` - Logout & clear Redis session
- `GET /refresh` - Generate new access token using refresh token
- `GET /me` - Get logged-in user profile
- `PUT /update-user-info` - Update name/email
- `PUT /update-user-password` - Update password
- `PUT /update-user-avatar` - Upload new profile photo

### 📚 Course Routes (`/api/v1/`)
- `POST /create-course` - *(Admin)* Create new course with sections
- `PUT /edit-course/:id` - *(Admin)* Update existing course
- `GET /get-course/:id` - Get single course preview (Public)
- `GET /get-courses` - Get all courses list (Public)
- `GET /get-course-content/:id` - Get full course video content *(Enrolled users only)*
- `PUT /add-question` - Post a question under a video
- `PUT /add-answer` - Reply to a question & notify student
- `PUT /add-review/:id` - Add rating and review
- `PUT /add-reply` - *(Admin)* Reply to user review

### 🛒 Order & Admin Routes (`/api/v1/`)
- `POST /create-order` - Purchase course
- `GET /get-notifications` - *(Admin)* Fetch real-time system alerts
- `PUT /update-notification/:id` - *(Admin)* Mark alert as read
- `GET /get-users-analytics` - *(Admin)* 12-month user sign-up analytics
- `GET /get-courses-analytics` - *(Admin)* 12-month course creation analytics
- `GET /get-orders-analytics` - *(Admin)* 12-month sales & revenue analytics
- `POST /create-layout` / `PUT /edit-layout` - Manage Hero, FAQ, and Categories
