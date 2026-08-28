# EduPulse LMS - Complete Project Dump
=========================================
Consolidated full codebase dump for external analysis, debugging, architecture verification, and data flow tracing.


## LEVEL 1: ROOT CONFIGURATION & DEPENDENCY FILES

--- FILE: package.json ---
{
  "name": "edupulse-lms",
  "version": "1.0.0",
  "private": true,
  "description": "⚡ EduPulse LMS — Full-Stack Next.js 15 Learning Management System with Complete Authentication, MongoDB Mongoose, and Protected Routes",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@vercel/blob": "^2.8.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.453.0",
    "mongoose": "^8.5.2",
    "next": "^15.1.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.17.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.1.7",
    "playwright": "^1.62.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3"
  }
}


--- FILE: tsconfig.json ---
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}


--- FILE: next.config.mjs ---
import dns from "node:dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setting DNS servers is not allowed
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;


--- FILE: postcss.config.mjs ---
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;


--- FILE: tailwind.config.ts ---
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        surface: "var(--surface)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          tint: "var(--primary-tint)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          tint: "var(--gold-tint)",
        },
        green: {
          DEFAULT: "var(--green)",
          tint: "var(--green-tint)",
        },
        red: {
          DEFAULT: "var(--red)",
          tint: "var(--red-tint)",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Times New Roman", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "IBM Plex Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;


--- FILE: .eslintrc.json ---
{
  "extends": "next/core-web-vitals"
}


--- FILE: .gitignore ---
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts


--- FILE: .env.example ---
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
BLOB_READ_WRITE_TOKEN=



--- FILE: .env.local ---
# MongoDB Connection (Atlas Cluster)
MONGO_URI=mongodb+srv://maaz:MaazAli@cluster0.rqxedta.mongodb.net/edupulse_lms?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=dev_jwt_super_secret_key_edupulse_foundation_2026
JWT_EXPIRE=7d


--- FILE: next-env.d.ts ---
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.


## LEVEL 2: MAIN ENTRY POINT & INITIALIZATION FILES

--- FILE: src/app/layout.tsx ---
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EduPulse LMS — Modern Next.js 15 Learning Platform",
  description:
    "Full-Stack Learning Management System built with Next.js 15, TypeScript, MongoDB Mongoose, JWT Authentication, and Protected Routes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}


--- FILE: src/app/admin/layout.tsx ---
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LayoutDashboard,
  FolderTree,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">
            Verifying administrative privileges...
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      exact: false,
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      exact: false,
    },
  ];

  const isNavActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border md:min-h-screen flex flex-col shrink-0">
        {/* Admin Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-foreground tracking-tight leading-tight">
                Admin Portal
              </h2>
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                EduPulse Core
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-gold" : "text-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="px-3 py-2 rounded-xl bg-primary-tint/40 border border-primary/10 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gold font-semibold uppercase">
                Administrator
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-primary hover:bg-primary-tint/60 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Storefront
            </span>
            <ExternalLink className="w-3 h-3 text-muted" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}


--- FILE: src/context/AuthContext.tsx ---
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Registration failed" };
      }

      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "An unexpected error occurred" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Login failed" };
      }

      setUser(data.user);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


--- FILE: src/components/Navbar.tsx ---
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, LogOut, LayoutDashboard, Shield, BookOpen, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:bg-primary-dark transition-colors">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary tracking-tight leading-none group-hover:text-primary-dark transition-colors">
                EduPulse
              </span>
              <span className="text-[11px] font-semibold text-gold tracking-widest uppercase mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              Courses
            </Link>
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "bg-primary-tint text-primary font-semibold"
                  : "text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname.startsWith("/admin")
                    ? "bg-gold-tint text-gold font-semibold"
                    : "text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                <Shield className="w-4 h-4 text-gold" />
                Admin Portal
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Auth / User State */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-20 h-8 bg-gray-200/60 animate-pulse rounded-lg" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-tint text-gold border border-gold/30">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-tint/60 border border-primary/10">
                <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-semibold text-foreground leading-tight max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted capitalize leading-none">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted hover:text-red hover:bg-red-tint rounded-lg transition-colors border border-transparent hover:border-red/20"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark hover:bg-primary-tint/70 rounded-lg transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm shadow-primary/20 hover:shadow-md transition-all active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


## LEVEL 3: CORE SERVICES, API HANDLERS & BACKEND LOGIC

--- FILE: src/lib/db.ts ---
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // If MONGO_URI is missing, throw an error in server context when called
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env or .env.local"
    );
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;


--- FILE: src/lib/jwt.ts ---
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_jwt_secret_key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export interface JWTPayload {
  id: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}


--- FILE: src/lib/auth.ts ---
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";

export const AUTH_COOKIE = "lms_token";

/**
 * For use inside Route Handlers. Reads cookie from NextRequest,
 * verifies token, and retrieves the User document from DB.
 */
export async function getAuthUserFromRequest(
  req: NextRequest
): Promise<IUser | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch {
    return null;
  }
}

/**
 * For use inside Server Components and Server Actions.
 * In Next.js 15, cookies() is asynchronous.
 */
export async function getServerUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch {
    return null;
  }
}


--- FILE: src/lib/adminGuard.ts ---
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError } from "@/lib/response";
import { IUser } from "@/models/User";

export async function requireAdmin(
  req: NextRequest
): Promise<IUser | NextResponse> {
  const user = await getAuthUserFromRequest(req);

  if (!user) {
    return apiError("Not authenticated", 401);
  }

  if (user.role !== "admin") {
    return apiError("Admin access required", 403);
  }

  return user;
}


--- FILE: src/lib/response.ts ---
import { NextResponse } from "next/server";

export function apiError(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

export function apiSuccess(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}


--- FILE: src/lib/videoUpload.ts ---
import { put } from "@vercel/blob";

export class VideoUploadError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "VideoUploadError";
    this.statusCode = statusCode;
  }
}

const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

/**
 * Uploads a video file to Vercel Blob storage.
 * Performs validation for MIME type, size, and environment configuration.
 */
export async function uploadVideo(
  file: File
): Promise<{ url: string; size: number }> {
  if (!file) {
    throw new VideoUploadError("No video file provided", 400);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new VideoUploadError(
      `Invalid video file type: "${file.type || "unknown"}". Allowed types are video/mp4, video/webm, and video/quicktime.`,
      400
    );
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new VideoUploadError(
      `File size (${sizeInMB}MB) exceeds the maximum limit of 200MB.`,
      400
    );
  }

  // Verify Blob token is configured
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new VideoUploadError(
      "Vercel Blob storage is not configured. BLOB_READ_WRITE_TOKEN environment variable is missing.",
      500
    );
  }

  // Sanitize filename: replace spaces and unsafe characters with hyphen
  const sanitizedName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  const pathname = `lessons/${Date.now()}-${sanitizedName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });

    return {
      url: blob.url,
      size: file.size,
    };
  } catch (err: any) {
    if (err instanceof VideoUploadError) throw err;
    throw new VideoUploadError(
      `Failed to upload video to Vercel Blob: ${err.message || err}`,
      500
    );
  }
}


--- FILE: src/models/User.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;


--- FILE: src/models/Category.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

export default Category;


--- FILE: src/models/Course.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);

export default Course;


--- FILE: src/models/Lesson.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  title: string;
  order: number;
  videoUrl: string;
  durationSeconds: number;
  isPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
      default: 1,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on course and order
lessonSchema.index({ course: 1, order: 1 });

const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;


--- FILE: src/models/Enrollment.ts ---
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: "Pending" | "Paid";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  completedLessons: mongoose.Types.ObjectId[];
  enrolledAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    stripeSessionId: {
      type: String,
      default: "",
    },
    stripePaymentIntentId: {
      type: String,
      default: "",
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  {
    timestamps: { createdAt: "enrolledAt", updatedAt: true },
  }
);

// Unique compound index so a user can only have one enrollment per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;


--- FILE: src/app/api/auth/register/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return apiError("Please provide name, email, and password", 400);
    }

    if (password.length < 6) {
      return apiError("Password must be at least 6 characters long", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return apiError("An account with this email already exists", 400);
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "student",
    });

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = apiSuccess(
      {
        message: "Account created successfully",
        user: userResponse,
      },
      201
    );

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return apiError(error.message || "Failed to register user", 500);
  }
}


--- FILE: src/app/api/auth/login/route.ts ---
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError("Please provide email and password", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Select password explicitly since it has select: false on schema
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return apiError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = apiSuccess({
      message: "Logged in successfully",
      user: userResponse,
    });

    // Set HTTP-only auth cookie
    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return apiError(error.message || "Failed to log in", 500);
  }
}


--- FILE: src/app/api/auth/logout/route.ts ---
import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = apiSuccess({
    message: "Logged out successfully",
  });

  // Clear HTTP-only auth cookie
  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}


--- FILE: src/app/api/auth/me/route.ts ---
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return apiError("Not authenticated", 401);
    }

    return apiSuccess({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Auth check error:", error);
    return apiError(error.message || "Authentication check failed", 500);
  }
}


--- FILE: src/app/api/categories/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// GET /api/categories - Public: Returns all categories sorted by name
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return apiSuccess({ categories });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch categories", 500);
  }
}

// POST /api/categories - Admin only: Creates a new category
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return apiError("Category name is required", 400);
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    if (!slug) {
      return apiError("Invalid category name resulting in empty slug", 400);
    }

    await connectDB();

    // Check if category name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: trimmedName }, { slug }],
    });

    if (existingCategory) {
      return apiError("A category with this name or slug already exists", 400);
    }

    const newCategory = await Category.create({
      name: trimmedName,
      slug,
    });

    return apiSuccess({ category: newCategory }, 201);
  } catch (error: any) {
    if (error.code === 11000) {
      return apiError("Category name or slug already exists", 400);
    }
    return apiError(error.message || "Failed to create category", 500);
  }
}


--- FILE: src/app/api/categories/[id]/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid category ID", 400);
    }

    await connectDB();

    const category = await Category.findById(id);
    if (!category) {
      return apiError("Category not found", 404);
    }

    // Check if any course references this category
    const courseCount = await Course.countDocuments({ category: id });
    if (courseCount > 0) {
      return apiError(
        `Cannot delete category "${category.name}" because ${courseCount} course(s) still reference it. Please reassign or delete those courses first.`,
        400
      );
    }

    await Category.findByIdAndDelete(id);

    return apiSuccess({ message: "Category deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete category", 500);
  }
}


--- FILE: src/app/api/courses/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function generateUniqueCourseSlug(title: string): Promise<string> {
  const baseSlug = slugify(title) || "course";
  let slug = baseSlug;
  let counter = 1;

  while (await Course.exists({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// GET /api/courses - Public Catalog: Filter by keyword, category, level.
// Admin users can see draft courses; non-admins/anonymous only see isPublished: true
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword")?.trim();
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();

    // Check if requester is admin
    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    const filter: Record<string, any> = {};

    // Non-admins only see published courses
    if (!isAdmin) {
      filter.isPublished = true;
    }

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (level && ["Beginner", "Intermediate", "Advanced"].includes(level)) {
      filter.level = level;
    }

    const courses = await Course.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess({ courses });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch courses", 500);
  }
}

// POST /api/courses - Admin only: Creates a new course (default isPublished: false)
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const {
      title,
      description,
      category,
      instructor,
      level = "Beginner",
      price = 0,
      thumbnailUrl = "",
    } = body;

    if (!title || !description || !category || !instructor) {
      return apiError(
        "Title, description, category, and instructor are required fields",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return apiError("Invalid category ID format", 400);
    }

    await connectDB();

    // Validate category exists in DB
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return apiError("Category not found", 404);
    }

    if (price < 0) {
      return apiError("Price cannot be negative", 400);
    }

    const slug = await generateUniqueCourseSlug(title);

    const course = await Course.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      category: categoryDoc._id,
      instructor: instructor.trim(),
      level,
      price: Number(price),
      thumbnailUrl: thumbnailUrl?.trim() || "",
      isPublished: false,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "category",
      "name slug"
    );

    return apiSuccess({ course: populatedCourse }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create course", 500);
  }
}


--- FILE: src/app/api/courses/[id]/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Course not found", 404);
    }

    await connectDB();

    const course = await Course.findById(id).populate("category", "name slug");

    if (!course) {
      return apiError("Course not found", 404);
    }

    // If unpublished, only admins can view
    if (!course.isPublished) {
      const authUser = await getAuthUserFromRequest(req);
      if (authUser?.role !== "admin") {
        return apiError("Course not found", 404);
      }
    }

    return apiSuccess({ course });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch course", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid course ID", 400);
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.instructor !== undefined) updateData.instructor = body.instructor.trim();
    if (body.level !== undefined) updateData.level = body.level;
    if (body.price !== undefined) {
      if (Number(body.price) < 0) {
        return apiError("Price cannot be negative", 400);
      }
      updateData.price = Number(body.price);
    }
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl.trim();
    if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished);

    await connectDB();

    if (body.category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(body.category)) {
        return apiError("Invalid category ID format", 400);
      }
      const categoryDoc = await Category.findById(body.category);
      if (!categoryDoc) {
        return apiError("Category not found", 404);
      }
      updateData.category = categoryDoc._id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!updatedCourse) {
      return apiError("Course not found", 404);
    }

    return apiSuccess({ course: updatedCourse });
  } catch (error: any) {
    return apiError(error.message || "Failed to update course", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid course ID", 400);
    }

    await connectDB();

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    return apiSuccess({ message: "Course deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete course", 500);
  }
}


--- FILE: src/app/api/courses/[id]/lessons/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";
import { uploadVideo, VideoUploadError } from "@/lib/videoUpload";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Course not found", 404);
    }

    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    // If unpublished, only admins can view
    if (!course.isPublished && !isAdmin) {
      return apiError("Course not found", 404);
    }

    const rawLessons = await Lesson.find({ course: id }).sort({ order: 1 });

    // Sanitize videoUrl for non-admins if isPreview is false
    const lessons = rawLessons.map((lesson) => {
      const lessonObj = lesson.toObject();
      if (!isAdmin && !lessonObj.isPreview) {
        lessonObj.videoUrl = "";
      }
      return lessonObj;
    });

    return apiSuccess({ lessons });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch lessons", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Course not found", 404);
    }

    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return apiError("Course not found", 404);
    }

    const formData = await req.formData();
    const title = formData.get("title") as string | null;
    const orderStr = formData.get("order") as string | null;
    const isPreviewStr = formData.get("isPreview") as string | null;
    const videoFile = formData.get("video") as File | null;

    if (!title || !title.trim()) {
      return apiError("Lesson title is required", 400);
    }

    if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
      return apiError("A valid video file is required", 400);
    }

    let uploadResult;
    try {
      uploadResult = await uploadVideo(videoFile);
    } catch (uploadErr: any) {
      if (uploadErr instanceof VideoUploadError) {
        return apiError(uploadErr.message, uploadErr.statusCode);
      }
      return apiError(uploadErr.message || "Video upload failed", 500);
    }

    let order = 1;
    if (orderStr !== null && orderStr !== undefined && orderStr !== "") {
      order = Number(orderStr);
      if (isNaN(order)) order = 1;
    } else {
      // Auto-assign next order number if not specified
      const lastLesson = await Lesson.findOne({ course: id }).sort({ order: -1 });
      if (lastLesson) {
        order = lastLesson.order + 1;
      }
    }

    const isPreview = isPreviewStr === "true" || isPreviewStr === "1";

    const lesson = await Lesson.create({
      course: course._id,
      title: title.trim(),
      order,
      isPreview,
      videoUrl: uploadResult.url,
      durationSeconds: 0,
    });

    return apiSuccess({ lesson }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create lesson", 500);
  }
}


--- FILE: src/app/api/admin/courses/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

// GET /api/admin/courses - Admin only: Returns all courses (published + drafts)
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const courses = await Course.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess({ courses });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch admin courses", 500);
  }
}


--- FILE: src/app/api/lessons/[id]/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import { getAuthUserFromRequest } from "@/lib/auth";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Lesson not found", 404);
    }

    await connectDB();

    const lesson = await Lesson.findById(id).populate("course", "title slug isPublished");
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    const lessonObj = lesson.toObject();
    if (!isAdmin && !lessonObj.isPreview) {
      lessonObj.videoUrl = "";
    }

    return apiSuccess({ lesson: lessonObj });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch lesson", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid lesson ID", 400);
    }

    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return apiError("Lesson title cannot be empty", 400);
      }
      updateData.title = body.title.trim();
    }

    if (body.order !== undefined) {
      const orderNum = Number(body.order);
      if (isNaN(orderNum) || orderNum < 1) {
        return apiError("Order must be a positive number", 400);
      }
      updateData.order = orderNum;
    }

    if (body.isPreview !== undefined) {
      updateData.isPreview = Boolean(body.isPreview);
    }

    await connectDB();

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLesson) {
      return apiError("Lesson not found", 404);
    }

    return apiSuccess({ lesson: updatedLesson });
  } catch (error: any) {
    return apiError(error.message || "Failed to update lesson", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid lesson ID", 400);
    }

    await connectDB();

    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    return apiSuccess({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    return apiError(error.message || "Failed to delete lesson", 500);
  }
}


--- FILE: src/app/api/lessons/[id]/video/route.ts ---
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";
import { uploadVideo, VideoUploadError } from "@/lib/videoUpload";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid lesson ID", 400);
    }

    await connectDB();

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return apiError("Lesson not found", 404);
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;

    if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
      return apiError("A valid video file is required", 400);
    }

    let uploadResult;
    try {
      uploadResult = await uploadVideo(videoFile);
    } catch (uploadErr: any) {
      if (uploadErr instanceof VideoUploadError) {
        return apiError(uploadErr.message, uploadErr.statusCode);
      }
      return apiError(uploadErr.message || "Video upload failed", 500);
    }

    lesson.videoUrl = uploadResult.url;
    await lesson.save();

    return apiSuccess({
      message: "Lesson video updated successfully",
      lesson,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to update lesson video", 500);
  }
}


## LEVEL 4: UI COMPONENTS, SCREENS & STYLING

--- FILE: src/app/globals.css ---
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #faf8f6;
  --foreground: #221b20;
  --muted: #7a7078;
  --border: #e8e1e4;
  --surface: #ffffff;
  --primary: #6b2d5c;
  --primary-dark: #4f2144;
  --primary-tint: #f3e8f0;
  --gold: #c9972a;
  --gold-tint: #faf1dd;
  --green: #2e8b57;
  --green-tint: #e6f4ec;
  --red: #c0392b;
  --red-tint: #fbe9e7;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
}

/* Glassmorphism & Cards */
.card-surface {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: 0 4px 20px -2px rgba(107, 45, 92, 0.05);
}

.card-surface-hover {
  transition: all 0.2s ease-in-out;
}
.card-surface-hover:hover {
  border-color: rgba(107, 45, 92, 0.3);
  box-shadow: 0 10px 25px -5px rgba(107, 45, 92, 0.1);
  transform: translateY(-2px);
}


--- FILE: src/app/page.tsx ---
"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  BookOpen,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
}

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlLevel = searchParams.get("level") || "";

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedLevel, setSelectedLevel] = useState(urlLevel);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  // Sync state if URL changes externally
  useEffect(() => {
    setKeywordInput(urlKeyword);
    setSelectedCategory(urlCategory);
    setSelectedLevel(urlLevel);
  }, [urlKeyword, urlCategory, urlLevel]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Fetch courses whenever query params change
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (urlKeyword) params.set("keyword", urlKeyword);
      if (urlCategory) params.set("category", urlCategory);
      if (urlLevel) params.set("level", urlLevel);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/courses${queryString}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [urlKeyword, urlCategory, urlLevel]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateFilters = (newKeyword?: string, newCat?: string, newLvl?: string) => {
    const params = new URLSearchParams();
    const k = newKeyword !== undefined ? newKeyword : keywordInput;
    const c = newCat !== undefined ? newCat : selectedCategory;
    const l = newLvl !== undefined ? newLvl : selectedLevel;

    if (k.trim()) params.set("keyword", k.trim());
    if (c) params.set("category", c);
    if (l) params.set("level", l);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(keywordInput, undefined, undefined);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    updateFilters(undefined, catId, undefined);
  };

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    updateFilters(undefined, undefined, lvl);
  };

  const resetAllFilters = () => {
    setKeywordInput("");
    setSelectedCategory("");
    setSelectedLevel("");
    router.push("/");
  };

  const hasActiveFilters = Boolean(urlKeyword || urlCategory || urlLevel);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero / Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-tint/40 via-surface to-background border-b border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-tint border border-primary/20 text-primary text-xs font-semibold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Explore Top Tech & Business Programs</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              Master New Skills with{" "}
              <span className="text-primary underline decoration-gold/40 decoration-4 underline-offset-8">
                Industry Experts
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto">
              Discover accredited courses designed to accelerate your career.
              Learn at your own pace with hands-on projects and verified credentials.
            </p>

            {/* Search and Filters Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 bg-surface p-2 rounded-2xl border border-border shadow-lg shadow-primary/5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              >
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Search courses by title (e.g. React, Python)..."
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent text-foreground placeholder:text-muted/70 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filters Controls Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-primary" />
              Category:
            </span>

            <button
              onClick={() => handleCategoryChange("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedCategory
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:bg-black/5"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat._id
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "bg-surface border border-border text-muted hover:text-foreground hover:bg-black/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Level Filter & Reset */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-2.5 py-1.5 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
              <select
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer pr-1"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted hover:text-primary hover:bg-primary-tint transition-all"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between">
          <p className="text-xs text-muted font-medium">
            {loading ? (
              "Searching courses..."
            ) : (
              <>
                Showing <strong className="text-foreground">{courses.length}</strong>{" "}
                {courses.length === 1 ? "course" : "courses"}
                {hasActiveFilters && " for current filters"}
              </>
            )}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="card-surface overflow-hidden p-4 flex flex-col gap-4 animate-pulse"
              >
                <div className="w-full h-44 bg-gray-200/80 rounded-xl" />
                <div className="h-4 bg-gray-200/80 rounded-md w-1/3" />
                <div className="h-6 bg-gray-200/80 rounded-md w-4/5" />
                <div className="h-10 bg-gray-200/80 rounded-md w-full" />
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-border/60">
                  <div className="h-4 bg-gray-200/80 rounded-md w-1/4" />
                  <div className="h-6 bg-gray-200/80 rounded-md w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="card-surface p-12 text-center my-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary-tint text-primary mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No courses found
            </h3>
            <p className="text-sm text-muted mb-6">
              We couldn&apos;t find any published courses matching your current search
              or filter criteria.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        ) : (
          /* Course Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="group card-surface overflow-hidden flex flex-col card-surface-hover hover:border-primary/30"
              >
                {/* Thumbnail / Header */}
                <div className="relative w-full h-48 bg-primary-tint/50 overflow-hidden flex items-center justify-center">
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  {/* Fallback pattern when no thumbnail */}
                  {!course.thumbnailUrl && (
                    <div className="flex flex-col items-center gap-2 text-primary/70 group-hover:scale-105 transition-transform duration-300">
                      <GraduationCap className="w-12 h-12 text-gold" />
                      <span className="text-xs font-bold tracking-wider uppercase text-primary/60">
                        {course.category?.name || "Course"}
                      </span>
                    </div>
                  )}

                  {/* Badges Overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {course.category && (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-surface/90 backdrop-blur-md text-primary shadow-sm border border-border">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm ${
                        course.level === "Beginner"
                          ? "bg-green-tint text-green border border-green/30"
                          : course.level === "Intermediate"
                          ? "bg-gold-tint text-gold border border-gold/30"
                          : "bg-red-tint text-red border border-red/30"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary-tint text-primary flex items-center justify-center font-bold text-[10px]">
                        {course.instructor.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[120px]">
                        {course.instructor}
                      </span>
                    </div>

                    <div className="text-right">
                      {course.price === 0 ? (
                        <span className="text-sm font-extrabold text-green">
                          Free
                        </span>
                      ) : (
                        <span className="text-base font-extrabold text-foreground">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}


--- FILE: src/app/login/page.tsx ---
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 mb-4">
            <GraduationCap className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted mt-2">
            Sign in to access your dashboard and courses
          </p>
        </div>

        {/* Card */}
        <div className="card-surface p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-tint border border-red/30 flex items-start gap-3 text-red">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/register/page.tsx ---
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(name, email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 mb-4">
            <GraduationCap className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted mt-2">
            Join EduPulse LMS to start your learning journey
          </p>
        </div>

        {/* Card */}
        <div className="card-surface p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-tint border border-red/30 flex items-start gap-3 text-red">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5"
              >
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/dashboard/page.tsx ---
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  User,
  Mail,
  Shield,
  Key,
  Calendar,
  Sparkles,
  CheckCircle2,
  Lock,
  LogOut,
  GraduationCap,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 card-surface p-8 max-w-sm text-center shadow-lg">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              Verifying Authentication
            </h2>
            <p className="text-xs text-muted mt-1">
              Checking HTTP-Only cookie session tokens...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-tint text-green text-xs font-semibold mb-2 border border-green/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Protected Route Access Granted</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            User Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">
            Welcome back, <span className="font-semibold text-primary">{user.name}</span>! Your session is verified.
          </p>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red/30 bg-red-tint text-red font-semibold text-xs hover:bg-red hover:text-white transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="card-surface p-6 md:col-span-2 shadow-md">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shadow-md shadow-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.role === "admin"
                      ? "bg-gold-tint text-gold border border-gold/40"
                      : "bg-primary-tint text-primary border border-primary/30"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  {user.role.toUpperCase()}
                </span>
                <span className="text-[11px] text-muted font-mono">
                  ID: {user._id}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Account Attributes & Security Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Full Name
                </div>
                <div className="text-sm font-bold text-foreground mt-1">
                  {user.name}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Email Address
                </div>
                <div className="text-sm font-bold text-foreground mt-1 truncate">
                  {user.email}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold" />
                  Assigned Role
                </div>
                <div className="text-sm font-bold text-foreground capitalize mt-1">
                  {user.role}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-green" />
                  Auth Method
                </div>
                <div className="text-sm font-bold text-foreground mt-1">
                  HTTP-Only JWT Cookie
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Foundation Status Sidebar */}
        <div className="space-y-6">
          <div className="card-surface p-6 shadow-md bg-gradient-to-br from-primary-tint/60 to-surface">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Foundation Verified</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Your session cookie is active, validated, and state is preserved across page refreshes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Mongoose Connection:</span>
                <span className="font-semibold text-green">Connected</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Auth Cookie:</span>
                <span className="font-semibold text-green font-mono">lms_token</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface/90 border border-border">
                <span className="text-muted">Next Part:</span>
                <span className="font-semibold text-primary">Part 2: Courses</span>
              </div>
            </div>
          </div>

          <div className="card-surface p-6 shadow-md">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-3">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>Enrolled Courses</span>
            </div>
            <p className="text-xs text-muted mb-4">
              Course catalog and enrollment features will become active in Part 2 and Part 4.
            </p>
            <div className="p-4 rounded-xl border border-dashed border-border text-center bg-background/50">
              <span className="text-xs text-muted">No enrollments yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/courses/[id]/page.tsx ---
"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  Play,
  AlertCircle,
  Video,
  CheckCircle2,
} from "lucide-react";

interface CourseDetail {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LessonSummary {
  _id: string;
  title: string;
  order: number;
  isPreview: boolean;
  durationSeconds: number;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourseAndLessons() {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
          fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();

        if (courseRes.status === 404 || !courseData.success || !courseData.course) {
          setError("Course not found or is currently unavailable.");
          setCourse(null);
        } else {
          setCourse(courseData.course);
        }

        if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
          setLessons(lessonsData.lessons);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourseAndLessons();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-muted">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-tint text-red mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Course Not Found
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            {error ||
              "The course you are looking for does not exist or has been unpublished by the instructor."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header Breadcrumb Banner */}
      <section className="bg-gradient-to-b from-primary-tint/50 via-surface to-background border-b border-border py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {course.category && (
              <span className="px-3 py-1 text-xs font-bold rounded-lg bg-primary-tint text-primary border border-primary/20">
                {course.category.name}
              </span>
            )}
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                course.level === "Beginner"
                  ? "bg-green-tint text-green border border-green/30"
                  : course.level === "Intermediate"
                  ? "bg-gold-tint text-gold border border-gold/30"
                  : "bg-red-tint text-red border border-red/30"
              }`}
            >
              {course.level}
            </span>
            {!course.isPublished && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gold-tint text-gold border border-gold/30">
                Draft (Admin Preview)
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight max-w-4xl">
            {course.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {course.instructor.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-xs text-muted block">Instructor</span>
                <span className="font-semibold text-foreground">
                  {course.instructor}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>
                Added on{" "}
                {new Date(course.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="card-surface p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                About This Course
              </h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {course.description}
              </p>
            </div>

            {/* Real Curriculum View (Part 3) */}
            <div className="card-surface p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Course Curriculum
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-tint text-primary">
                  {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                </span>
              </div>

              {lessons.length === 0 ? (
                <div className="p-8 bg-primary-tint/20 rounded-xl border border-border text-center">
                  <Video className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
                  <h3 className="text-sm font-bold text-foreground mb-1">
                    Curriculum In Progress
                  </h3>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    The lessons for this course are currently being published by the instructor.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        lesson.isPreview
                          ? "bg-surface hover:bg-primary-tint/30 border-border hover:border-primary/40 cursor-pointer"
                          : "bg-surface/50 border-border/60 opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            lesson.isPreview
                              ? "bg-primary text-white shadow-sm"
                              : "bg-border text-muted"
                          }`}
                        >
                          #{lesson.order}
                        </div>
                        <span
                          className={`text-sm font-semibold truncate ${
                            lesson.isPreview ? "text-foreground" : "text-muted"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.isPreview ? (
                          <Link
                            href={`/learn/${course._id}/${lesson._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-tint text-green hover:bg-green/20 border border-green/30 transition-colors shadow-sm"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Preview</span>
                          </Link>
                        ) : (
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-border/50 text-muted select-none"
                            title="Enroll to unlock (Part 4)"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column / Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-surface p-6 sm:p-7 shadow-xl shadow-primary/5 border-primary/20 space-y-6">
              {/* Media Preview if exists */}
              {course.thumbnailUrl ? (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-primary-tint/40 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-36 rounded-xl bg-primary-tint/40 flex flex-col items-center justify-center text-primary/60 border border-border">
                  <GraduationCap className="w-10 h-10 text-gold mb-1" />
                  <span className="text-xs font-semibold">Course Preview</span>
                </div>
              )}

              {/* Pricing Display */}
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Tuition & Access
                </span>
                <div className="flex items-baseline gap-2">
                  {course.price === 0 ? (
                    <span className="text-3xl font-black text-green">Free</span>
                  ) : (
                    <span className="text-3xl font-black text-foreground">
                      ${course.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-muted">one-time payment</span>
                </div>
              </div>

              {/* Visibly Disabled Enroll Button with explicit caption */}
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gray-200 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2 border border-gray-300 shadow-none transition-none"
                  title="Payments coming in Part 4"
                >
                  <Lock className="w-4 h-4" />
                  <span>Enroll in Course</span>
                </button>
                <p className="text-[11px] text-center text-muted font-medium">
                  🔒 Payments & enrollment coming in Part 4
                </p>
              </div>

              {/* Course Highlights */}
              <div className="pt-4 border-t border-border space-y-3 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Curriculum:</span>
                  <span className="font-semibold text-foreground">
                    {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-semibold text-foreground">
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-semibold text-foreground">
                    {course.instructor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-foreground">
                    {course.category?.name || "General"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Access:</span>
                  <span className="font-semibold text-foreground">
                    Lifetime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


--- FILE: src/app/learn/[courseId]/[lessonId]/page.tsx ---
"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Lock,
  Film,
  BookOpen,
  Layers,
  GraduationCap,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
  instructor: string;
}

interface LessonItem {
  _id: string;
  course: string;
  title: string;
  order: number;
  videoUrl?: string;
  durationSeconds: number;
  isPreview: boolean;
}

export default function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId, lessonId } = resolvedParams;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseAndLessons() {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
          fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
        ]);

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();

        if (!courseRes.ok || !courseData.success || !courseData.course) {
          setError(courseData.message || "Course not found");
          return;
        }
        setCourse(courseData.course);

        if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
          setLessons(lessonsData.lessons);
          const found = lessonsData.lessons.find(
            (l: LessonItem) => l._id === lessonId
          );
          if (found) {
            setCurrentLesson(found);
          } else if (lessonsData.lessons.length > 0) {
            setCurrentLesson(lessonsData.lessons[0]);
          } else {
            setError("No lessons found for this course.");
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load player data");
      } finally {
        setLoading(false);
      }
    }

    if (courseId && lessonId) {
      fetchCourseAndLessons();
    }
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted">Loading lesson video player...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !currentLesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card-surface p-10 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-tint text-red mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Lesson Unavailable
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            {error || "The requested lesson could not be found."}
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Course Overview</span>
          </Link>
        </div>
      </div>
    );
  }

  // Find index in lessons array for prev / next
  const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  // Gating rule: lesson has a non-empty videoUrl
  const isPlayable = Boolean(currentLesson.videoUrl && currentLesson.videoUrl.trim().length > 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Top Learning Bar */}
      <div className="border-b border-border bg-surface sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/courses/${courseId}`}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-black/5 transition-colors shrink-0"
              title="Return to Course Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <span className="text-[11px] font-bold text-primary block truncate uppercase tracking-wider">
                {course.title}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-foreground truncate">
                Lesson {currentLesson.order}: {currentLesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Prev Lesson Button */}
            {prevLesson ? (
              <Link
                href={`/learn/${courseId}/${prevLesson._id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground bg-background hover:bg-black/5 border border-border transition-colors"
                title={`Previous: ${prevLesson.title}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted bg-border/40 border border-border cursor-not-allowed opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>
            )}

            {/* Next Lesson Button */}
            {nextLesson ? (
              <Link
                href={`/learn/${courseId}/${nextLesson._id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
                title={`Next: ${nextLesson.title}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted bg-border/40 border border-border cursor-not-allowed opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Video Screen or Locked Placeholder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-surface overflow-hidden p-2 sm:p-3 shadow-lg">
              {isPlayable ? (
                <div className="rounded-xl overflow-hidden bg-black shadow-2xl relative aspect-video flex items-center justify-center">
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    src={currentLesson.videoUrl}
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                </div>
              ) : (
                /* Locked State Placeholder (No empty video tag) */
                <div className="rounded-xl bg-gradient-to-b from-surface to-background border border-border p-8 sm:p-12 text-center aspect-video flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-gold-tint text-gold flex items-center justify-center mb-4 shadow-md shadow-gold/10">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold mb-1">
                    Enrolled Students Only
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2">
                    This lesson unlocks after enrollment (Part 4)
                  </h2>
                  <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed mb-6">
                    You are viewing a protected lesson. Full streaming access and learning resources unlock upon course enrollment.
                  </p>
                  <Link
                    href={`/courses/${courseId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-gold" />
                    <span>View Course Details</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Lesson Details Card */}
            <div className="card-surface p-6 sm:p-7 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-primary-tint text-primary text-xs font-bold">
                  Lesson #{currentLesson.order}
                </span>
                {currentLesson.isPreview ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-green-tint text-green text-xs font-bold border border-green/30">
                    Free Preview
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-border text-muted text-xs font-semibold">
                    Full Course Access
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {currentLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Instructor: <strong className="text-foreground">{course.instructor}</strong> • Part of the{" "}
                <Link
                  href={`/courses/${courseId}`}
                  className="text-primary hover:underline font-semibold"
                >
                  {course.title}
                </Link>{" "}
                curriculum.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Curriculum Navigation */}
          <div className="lg:col-span-1">
            <div className="card-surface p-5 sm:p-6 space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Course Content
                </h3>
                <span className="text-xs text-muted font-medium">
                  {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                </span>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                {lessons.map((lesson) => {
                  const isActive = lesson._id === currentLesson._id;

                  return (
                    <Link
                      key={lesson._id}
                      href={`/learn/${courseId}/${lesson._id}`}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 font-bold"
                          : "bg-surface hover:bg-primary-tint/30 text-foreground border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-primary-tint text-primary"
                          }`}
                        >
                          {lesson.order}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {lesson.isPreview ? (
                          <span
                            className={`p-1 rounded-md text-[10px] ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "text-green bg-green-tint border border-green/30"
                            }`}
                            title="Preview Available"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </span>
                        ) : (
                          <span
                            className={`p-1 rounded-md text-[10px] ${
                              isActive ? "text-white/80" : "text-muted"
                            }`}
                            title="Locked"
                          >
                            <Lock className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


--- FILE: src/app/admin/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderTree,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: string;
  price: number;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminOverviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [courseRes, catRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/categories"),
        ]);

        const courseData = await courseRes.json();
        const catData = await catRes.json();

        if (courseData.success && Array.isArray(courseData.courses)) {
          setCourses(courseData.courses);
        }
        if (catData.success && Array.isArray(catData.categories)) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error("Failed to load admin overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;
  const totalCategories = categories.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-tint text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administration Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Dashboard & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Monitor learning content, catalog status, and course taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-foreground hover:bg-black/5 transition-all shadow-sm"
          >
            <FolderTree className="w-3.5 h-3.5 text-primary" />
            <span>Manage Categories</span>
          </Link>

          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            <span>Manage Courses</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Total Courses
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Total catalog items</p>
        </div>

        {/* Published Courses */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-green uppercase tracking-wider">
              Published
            </span>
            <div className="w-9 h-9 rounded-xl bg-green-tint text-green flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-green">
            {loading ? "..." : publishedCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Live in public catalog</p>
        </div>

        {/* Drafts */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Drafts
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-tint text-gold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold">
            {loading ? "..." : draftCourses}
          </div>
          <p className="text-[11px] text-muted mt-1">Unpublished courses</p>
        </div>

        {/* Categories */}
        <div className="card-surface p-5 card-surface-hover">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">
              Categories
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {loading ? "..." : totalCategories}
          </div>
          <p className="text-[11px] text-muted mt-1">Curated taxonomy tracks</p>
        </div>
      </div>

      {/* Recent Courses Table Preview */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Recent Courses
            </h2>
            <p className="text-xs text-muted">
              Latest additions to the LMS repository
            </p>
          </div>
          <Link
            href="/admin/courses"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No courses created yet. Click &quot;Manage Courses&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <tr key={course._id} className="hover:bg-primary-tint/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {course.category?.name || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-muted">{course.instructor}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-2.5 h-2.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/courses/${course._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


--- FILE: src/app/admin/categories/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Notifications / Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirm delete dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to create category");
        return;
      }

      setSuccessMessage(`Category "${data.category.name}" created successfully!`);
      setNewCategoryName("");
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Plainly display backend error (e.g. courses still reference it)
        setErrorMessage(data.message || "Failed to delete category");
        setCategoryToDelete(null);
        return;
      }

      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
          <FolderTree className="w-3.5 h-3.5" />
          Category Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Course Categories
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Organize courses into structured topics and disciplines.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Create Form & Categories Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="card-surface p-6">
          <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add New Category
          </h2>
          <p className="text-xs text-muted mb-4">
            Category slug will be generated automatically on submission.
          </p>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label
                htmlFor="categoryName"
                className="block text-xs font-semibold text-foreground mb-1.5"
              >
                Category Name <span className="text-red">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Cloud Computing"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newCategoryName.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-gold" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories Table Column */}
        <div className="lg:col-span-2 card-surface overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Existing Categories
              </h2>
              <p className="text-xs text-muted">
                {categories.length} total active categories
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>Loading categories...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No categories found. Create your first category using the form.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-primary-tint/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted bg-surface px-2 py-0.5 rounded border border-border">
                          <Hash className="w-2.5 h-2.5" />
                          {cat.slug}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted">
                        {new Date(cat.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          disabled={deletingId === cat._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red hover:bg-red-tint transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Category?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete category{" "}
              <strong className="text-foreground">
                &quot;{categoryToDelete.name}&quot;
              </strong>
              ? If any courses are assigned to this category, deletion will be
              prevented by the server.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/admin/courses/page.tsx ---
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  DollarSign,
  GraduationCap,
  Video,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number | string;
  thumbnailUrl: string;
}

const initialFormState: CourseFormData = {
  title: "",
  description: "",
  category: "",
  instructor: "",
  level: "Beginner",
  price: 0,
  thumbnailUrl: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Delete State
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toggle Publish loading tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [coursesRes, catRes] = await Promise.all([
        fetch("/api/admin/courses", { cache: "no-store" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);

      const coursesData = await coursesRes.json();
      const catData = await catRes.json();

      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      ...initialFormState,
      category: categories.length > 0 ? categories[0]._id : "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?._id || "",
      instructor: course.instructor,
      level: course.level,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl || "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData(initialFormState);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.instructor.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const endpoint = editingCourse
        ? `/api/courses/${editingCourse._id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        instructor: formData.instructor.trim(),
        level: formData.level,
        price: Number(formData.price),
        thumbnailUrl: formData.thumbnailUrl.trim(),
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Operation failed");
        return;
      }

      setSuccessMessage(
        editingCourse
          ? `Course "${data.course.title}" updated successfully.`
          : `Course "${data.course.title}" created successfully as Draft.`
      );

      closeModal();
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      setTogglingId(course._id);
      setErrorMessage(null);
      setSuccessMessage(null);

      const newStatus = !course.isPublished;
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update publication status");
        return;
      }

      setSuccessMessage(
        `Course "${course.title}" is now ${
          newStatus ? "Published (Public)" : "Draft (Hidden)"
        }.`
      );

      // Local state update for snappy UI
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isPublished: newStatus } : c))
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/courses/${courseToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to delete course");
        setCourseToDelete(null);
        return;
      }

      setSuccessMessage(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
      await fetchInitialData();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Manage Courses
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Create, configure, publish, and update course offerings.
          </p>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              All Courses Repository
            </h2>
            <p className="text-xs text-muted">
              {courses.length} total courses registered
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-primary-tint/30 text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Toggle Publish</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted">
                    No courses found. Click &quot;Create New Course&quot; to add your
                    first course.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-primary-tint/20 transition-colors"
                  >
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <CheckCircle className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gold-tint text-gold border border-gold/30">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="font-bold text-foreground truncate">
                        {course.title}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {course.slug}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-primary-tint text-primary">
                        {course.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Instructor */}
                    <td className="py-3.5 px-4 text-muted font-medium">
                      {course.instructor}
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface border border-border">
                        {course.level}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </td>

                    {/* Publish/Unpublish Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={togglingId === course._id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          course.isPublished
                            ? "bg-gold-tint text-gold hover:bg-gold/20"
                            : "bg-green-tint text-green hover:bg-green/20"
                        }`}
                        title={
                          course.isPublished
                            ? "Click to unpublish (switch to draft)"
                            : "Click to publish (make public)"
                        }
                      >
                        {togglingId === course._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : course.isPublished ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-gold" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-green" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/courses/${course._id}/lessons`}
                          className="p-1.5 rounded-lg text-primary hover:text-white hover:bg-primary transition-colors bg-primary-tint"
                          title="Manage Lessons & Videos"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/courses/${course._id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="View Course Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                          title="Edit Course"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCourseToDelete(course)}
                          className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red-tint transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="card-surface p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                  <GraduationCap className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingCourse ? "Edit Course" : "Create New Course"}
                  </h3>
                  <p className="text-xs text-muted">
                    {editingCourse
                      ? "Update existing course attributes"
                      : "New courses default to Draft mode until published"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Modern Full-Stack Development with Next.js"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Course Description <span className="text-red">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Comprehensive description of what students will master..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Category and Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category <span className="text-red">*</span>
                  </label>
                  {categories.length === 0 ? (
                    <div className="text-xs text-red p-2 bg-red-tint rounded-lg">
                      No categories found. Please create a category first.
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Instructor Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Jenkins"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* Level, Price, Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-muted text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Thumbnail Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || categories.length === 0}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-gold" />
                      <span>{editingCourse ? "Update Course" : "Save Course"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-12 h-12 rounded-xl bg-red-tint text-red flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Delete Course?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{courseToDelete.title}&quot;
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCourseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


--- FILE: src/app/admin/courses/[id]/lessons/page.tsx ---
"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Plus,
  Edit2,
  Trash2,
  Upload,
  RefreshCw,
  Eye,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Play,
  Film,
  Layers,
} from "lucide-react";

interface CourseInfo {
  _id: string;
  title: string;
  slug: string;
  instructor: string;
  level: string;
  price: number;
  isPublished: boolean;
}

interface LessonItem {
  _id: string;
  course: string;
  title: string;
  order: number;
  videoUrl: string;
  durationSeconds: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewLessonFormData {
  title: string;
  order: number | string;
  isPreview: boolean;
  videoFile: File | null;
}

interface EditLessonFormData {
  title: string;
  order: number | string;
  isPreview: boolean;
}

export default function AdminCourseLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Lesson Form
  const [newLessonData, setNewLessonData] = useState<NewLessonFormData>({
    title: "",
    order: "",
    isPreview: false,
    videoFile: null,
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Edit Metadata Modal
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditLessonFormData>({
    title: "",
    order: 1,
    isPreview: false,
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Replace Video Modal
  const [replacingLesson, setReplacingLesson] = useState<LessonItem | null>(null);
  const [replaceVideoFile, setReplaceVideoFile] = useState<File | null>(null);
  const [isReplacingVideo, setIsReplacingVideo] = useState<boolean>(false);

  // Delete Lesson Modal
  const [deletingLesson, setDeletingLesson] = useState<LessonItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchCourseAndLessons = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`, { cache: "no-store" }),
        fetch(`/api/courses/${courseId}/lessons`, { cache: "no-store" }),
      ]);

      const courseData = await courseRes.json();
      const lessonsData = await lessonsRes.json();

      if (!courseRes.ok || !courseData.success || !courseData.course) {
        setErrorMessage(courseData.message || "Failed to load course details.");
        return;
      }
      setCourse(courseData.course);

      if (lessonsData.success && Array.isArray(lessonsData.lessons)) {
        setLessons(lessonsData.lessons);
        // Pre-fill next order for convenience
        const nextOrder =
          lessonsData.lessons.length > 0
            ? Math.max(...lessonsData.lessons.map((l: LessonItem) => l.order)) + 1
            : 1;
        setNewLessonData((prev) => ({
          ...prev,
          order: nextOrder,
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch course lessons.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseAndLessons();
    }
  }, [courseId, fetchCourseAndLessons]);

  // Handle Add Lesson Submission
  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLessonData.title.trim()) {
      setErrorMessage("Please enter a lesson title.");
      return;
    }

    if (!newLessonData.videoFile) {
      setErrorMessage("Please select a video file (MP4, WebM, or QuickTime).");
      return;
    }

    // Client-side quick checks
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(newLessonData.videoFile.type)) {
      setErrorMessage("Invalid file format. Please upload an MP4, WebM, or QuickTime video.");
      return;
    }

    if (newLessonData.videoFile.size > 200 * 1024 * 1024) {
      const sizeMB = (newLessonData.videoFile.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`Video size (${sizeMB}MB) exceeds 200MB maximum limit.`);
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("title", newLessonData.title.trim());
      formData.append("order", String(newLessonData.order || 1));
      formData.append("isPreview", String(newLessonData.isPreview));
      formData.append("video", newLessonData.videoFile);

      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to upload video and create lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${data.lesson.title}" uploaded & created successfully!`);

      // Reset form
      const nextOrder = (Number(newLessonData.order) || 1) + 1;
      setNewLessonData({
        title: "",
        order: nextOrder,
        isPreview: false,
        videoFile: null,
      });

      // Clear file input element
      const fileInput = document.getElementById("lesson-video-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during video upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Open Edit Metadata Modal
  const openEditModal = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setEditFormData({
      title: lesson.title,
      order: lesson.order,
      isPreview: lesson.isPreview,
    });
    setErrorMessage(null);
  };

  const handleEditLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    if (!editFormData.title.trim()) {
      setErrorMessage("Lesson title cannot be empty.");
      return;
    }

    try {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/lessons/${editingLesson._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editFormData.title.trim(),
          order: Number(editFormData.order),
          isPreview: editFormData.isPreview,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to update lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${data.lesson.title}" updated successfully.`);
      setEditingLesson(null);
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Replace Video Modal
  const openReplaceVideoModal = (lesson: LessonItem) => {
    setReplacingLesson(lesson);
    setReplaceVideoFile(null);
    setErrorMessage(null);
  };

  const handleReplaceVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingLesson || !replaceVideoFile) {
      setErrorMessage("Please select a new video file.");
      return;
    }

    try {
      setIsReplacingVideo(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("video", replaceVideoFile);

      const res = await fetch(`/api/lessons/${replacingLesson._id}/video`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to replace lesson video.");
        return;
      }

      setSuccessMessage(`Video for "${replacingLesson.title}" replaced successfully!`);
      setReplacingLesson(null);
      setReplaceVideoFile(null);
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while uploading new video.");
    } finally {
      setIsReplacingVideo(false);
    }
  };

  // Handle Delete Lesson
  const handleDeleteLessonSubmit = async () => {
    if (!deletingLesson) return;

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const res = await fetch(`/api/lessons/${deletingLesson._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to delete lesson.");
        return;
      }

      setSuccessMessage(`Lesson "${deletingLesson.title}" deleted.`);
      setDeletingLesson(null);
      await fetchCourseAndLessons();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete lesson.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted">Loading course & lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Back Navigation & Course Header */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary-tint text-primary text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Curriculum Editor
              </span>
              {course?.isPublished ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-green-tint text-green border border-green/30">
                  Published
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gold-tint text-gold border border-gold/30">
                  Draft
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {course?.title || "Course Lessons"}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Upload videos, configure lesson order, and manage free preview access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface hover:bg-black/5 text-foreground border border-border transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Public View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-tint border border-red/30 text-red flex items-start gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-green-tint border border-green/30 text-green flex items-start gap-3 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green font-bold text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Add Lesson Form + Lesson List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Lesson Form */}
        <div className="lg:col-span-1">
          <div className="card-surface p-6 sm:p-7 sticky top-24 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                <Plus className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Add New Lesson</h2>
                <p className="text-[11px] text-muted">Upload video to Vercel Blob</p>
              </div>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="space-y-4">
              {/* Lesson Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lesson Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={newLessonData.title}
                  onChange={(e) =>
                    setNewLessonData({ ...newLessonData, title: e.target.value })
                  }
                  placeholder="e.g. 01 - Architecture Overview"
                  required
                  disabled={isUploading}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                />
              </div>

              {/* Order and Preview Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Lesson Order # <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLessonData.order}
                    onChange={(e) =>
                      setNewLessonData({ ...newLessonData, order: e.target.value })
                    }
                    required
                    disabled={isUploading}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Access Level
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newLessonData.isPreview}
                      onChange={(e) =>
                        setNewLessonData({
                          ...newLessonData,
                          isPreview: e.target.checked,
                        })
                      }
                      disabled={isUploading}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Free Preview
                    </span>
                  </label>
                </div>
              </div>

              {/* Video File Picker */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Video File (MP4, WebM, QuickTime, max 200MB) <span className="text-red">*</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-background/50">
                  <input
                    id="lesson-video-file-input"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    required
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setNewLessonData({ ...newLessonData, videoFile: file });
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="lesson-video-file-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-tint text-primary flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    {newLessonData.videoFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground truncate max-w-[220px]">
                          {newLessonData.videoFile.name}
                        </p>
                        <p className="text-[10px] text-muted">
                          {(newLessonData.videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Click to select video file
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">
                          MP4, WebM or MOV up to 200MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Upload Progress Feedback Banner */}
              {isUploading && (
                <div className="p-3.5 rounded-xl bg-primary-tint text-primary border border-primary/20 flex items-center gap-3 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <div className="leading-tight">
                    <p className="font-bold">Uploading video to Vercel Blob...</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Please keep this window open until complete.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || !newLessonData.videoFile}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-gold" />
                    <span>Create & Upload Lesson</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Lessons List & Preview Players */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Film className="w-4 h-4 text-primary" />
              Course Curriculum ({lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"})
            </h2>
            <button
              onClick={fetchCourseAndLessons}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 text-xs inline-flex items-center gap-1 transition-colors"
              title="Refresh lessons"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {lessons.length === 0 ? (
            <div className="card-surface p-12 text-center border-dashed">
              <div className="w-12 h-12 rounded-2xl bg-primary-tint text-primary mx-auto flex items-center justify-center mb-3">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                No lessons created yet
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Use the form on the left to upload your first lesson video and establish the course curriculum.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="card-surface p-5 sm:p-6 transition-all hover:border-primary/30 space-y-4"
                >
                  {/* Top Bar of Lesson Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary-tint text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        #{lesson.order}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {lesson.title}
                        </h3>
                        <p className="text-[11px] text-muted">
                          Added {new Date(lesson.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {lesson.isPreview ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-tint text-green border border-green/30">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          Free Preview
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          <Lock className="w-2.5 h-2.5" />
                          Enrolled Only
                        </span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
                        <Link
                          href={`/learn/${courseId}/${lesson._id}`}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="Open in Player"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openReplaceVideoModal(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary-tint transition-colors"
                          title="Replace Video File"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
                          title="Edit Lesson Metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingLesson(lesson)}
                          className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red-tint transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Video Player Preview */}
                  {lesson.videoUrl ? (
                    <div className="rounded-xl overflow-hidden bg-black border border-border shadow-inner">
                      <video
                        controls
                        preload="metadata"
                        className="w-full max-h-[300px] object-contain mx-auto"
                        src={lesson.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-primary-tint/20 text-center border border-border">
                      <p className="text-xs text-muted">No video attached.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Metadata Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                Edit Lesson
              </h3>
              <button
                onClick={() => setEditingLesson(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lesson Title <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Order Number <span className="text-red">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.order}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, order: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Preview Access
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editFormData.isPreview}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isPreview: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-border"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Free Preview
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  disabled={isUpdating}
                  className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replace Video Modal */}
      {replacingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Replace Video File
              </h3>
              <button
                onClick={() => setReplacingLesson(null)}
                className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted mb-4">
              Upload a new video for <strong className="text-foreground">{replacingLesson.title}</strong>. This replaces the existing streaming asset in Vercel Blob.
            </p>

            <form onSubmit={handleReplaceVideoSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-background/50">
                <input
                  id="replace-video-file-input"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  required
                  disabled={isReplacingVideo}
                  onChange={(e) => setReplaceVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="replace-video-file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-tint text-primary flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  {replaceVideoFile ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground truncate max-w-[240px]">
                        {replaceVideoFile.name}
                      </p>
                      <p className="text-[10px] text-muted">
                        {(replaceVideoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Select replacement video
                      </p>
                      <p className="text-[10px] text-muted">
                        MP4, WebM or MOV up to 200MB
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {isReplacingVideo && (
                <div className="p-3 rounded-xl bg-primary-tint text-primary border border-primary/20 flex items-center gap-2 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Uploading replacement video to Vercel Blob...</span>
                </div>
              )}

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplacingLesson(null)}
                  disabled={isReplacingVideo}
                  className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReplacingVideo || !replaceVideoFile}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isReplacingVideo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Upload & Replace</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lesson Confirmation Modal */}
      {deletingLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-red-tint text-red flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Delete Lesson?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-5">
              Are you sure you want to delete lesson #{deletingLesson.order}:{" "}
              <strong className="text-foreground">&quot;{deletingLesson.title}&quot;</strong>?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingLesson(null)}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLessonSubmit}
                disabled={isDeleting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl shadow-md shadow-red/20 transition-all flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


## LEVEL 5: DOCUMENTATION, SPECS & PROJECT SCRIPTS

--- FILE: README.md ---
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
| **Part 2** | **Course Catalog & Admin CRUD** | ✅ **Completed** | Public Catalog, Filter/Search, Course Detail, Categories & Course Admin Studio |
| **Part 3** | **Lessons & Video Streaming** | ✅ **Completed** | Vercel Blob Video Upload, Admin Curriculum Studio, Gated Player & HTTP Streaming |
| **Part 4** | **Payments & Enrollments** | ⏳ *Upcoming* | Stripe Webhooks, Checkout Sessions, Enrollment Guard & Invoices |
| **Part 5** | **Analytics & Administration** | ⏳ *Upcoming* | Revenue Charts, Enrollment Analytics, User Role Access Controls |
| **Part 6** | **Deployment & Polish** | ⏳ *Upcoming* | Production Deployment, Security Audits & Optimizations |

---

---

## 🏛️ Part 1: Foundation Overview

In **Part 1**, we built the core architecture and full-stack authentication system:

- **Database Model Layer (`src/models/`):** Initialized all 5 core Mongoose schemas with validation, compound indexing, and hot-reload safe exports (`User`, `Category`, `Course`, `Lesson`, `Enrollment`).
- **Stateless JWT Auth Engine (`src/lib/`):** Cached MongoDB connection handler (`src/lib/db.ts`), JWT signing & verification (`src/lib/jwt.ts`), HTTP-Only cookie auth (`lms_token`), and session extractors (`src/lib/auth.ts`).
- **RESTful Auth Endpoints (`src/app/api/auth/`):** Registration, login, logout, and `/api/auth/me`.
- **Client Session Context & Protection:** `AuthContext.tsx` with role-aware header navigation and `/dashboard` client/server redirection.

---

## 📚 Part 2: Course Catalog & Admin CRUD

In **Part 2**, we built the course taxonomy, public catalog, detail views, and dedicated admin management portal:

- **Shared Admin Auth Guard (`src/lib/adminGuard.ts`):** Centralized `requireAdmin(req: NextRequest)` checking authentication and `user.role === 'admin'`, returning 401/403 or typed `IUser`.
- **Category API (`/api/categories` & `/api/categories/[id]`):**
  - `GET /api/categories`: Public list of categories sorted by name.
  - `POST /api/categories`: Admin-only category creation with auto-generated unique slug and duplicate rejection (400).
  - `DELETE /api/categories/[id]`: Admin-only deletion with **Orphan Protection Guard** — blocks deletion if any courses reference the category and returns a clear descriptive message.
- **Course API (`/api/courses`, `/api/courses/[id]`, `/api/admin/courses`):**
  - `GET /api/courses`: Public course catalog with `?keyword=`, `?category=`, and `?level=` filtering. Automatically restricts results to `isPublished: true` for non-admins.
  - `POST /api/courses`: Admin-only course creation defaulting to draft mode (`isPublished: false`) with auto-incrementing unique slug generation.
  - `GET /api/courses/[id]`: Public detail endpoint. Returns 404 for unpublished courses when accessed by non-admins (preventing information disclosure).
  - `PUT /api/courses/[id]`: Admin-only partial updates with validation and one-click publish toggle.
  - `DELETE /api/courses/[id]`: Admin-only course deletion.
  - `GET /api/admin/courses`: Admin-only repository returning all courses (both published and drafts) with category population.
- **Public Frontend:**
  - **Live Course Catalog (`src/app/page.tsx`):** Real-time search by keyword, category filter chips, difficulty selector, responsive course card grid, price formatting, and empty states.
  - **Course Detail Page (`src/app/courses/[id]/page.tsx`):** Comprehensive course overview, curriculum placeholder ("Lessons coming in Part 3"), and visibly disabled enroll button ("Payments & enrollment coming in Part 4").
- **Admin Portal (`src/app/admin/`):**
  - `admin/layout.tsx`: Role guard redirecting non-admins/students away from `/admin` immediately, with dedicated sidebar navigation.
  - `admin/page.tsx`: Management dashboard with KPI metrics (Total Courses, Published, Drafts, Categories) and recent courses table.
  - `admin/categories/page.tsx`: Category management table, creation form, and deletion confirmation modal with backend error alerts.
  - `admin/courses/page.tsx`: Course studio with creation/edit modal, category dropdown, price/level configuration, and instant Publish/Unpublish toggle.

---

## 🎥 Part 3: Lessons & Video Streaming

In **Part 3**, we built complete lesson CRUD, Vercel Blob video integration, curriculum rendering, and gated video player access:

- **Vercel Blob Video Upload (`src/lib/videoUpload.ts`):**
  - Robust file validation rejecting unsupported formats (supports `video/mp4`, `video/webm`, `video/quicktime`) and oversized files (>200MB).
  - Clear error messaging with custom `VideoUploadError` and configuration validation (`BLOB_READ_WRITE_TOKEN`).
  - Seamless HTTP Range request streaming supported natively by Vercel Blob URLs for instant seeking and scrubbable playback.
- **RESTful Lesson API Routes:**
  - `GET /api/courses/[id]/lessons`: Public course curriculum list sorted by order. **Gated streaming security**: omits/strips `videoUrl` for non-preview lessons unless requested by an admin.
  - `POST /api/courses/[id]/lessons`: Admin-only multipart form handler uploading video to Vercel Blob and persisting the `Lesson` document.
  - `GET /api/lessons/[id]`: Retrieve single lesson details with preview gating.
  - `PUT /api/lessons/[id]`: Admin-only metadata updates (`title`, `order`, `isPreview`).
  - `PUT /api/lessons/[id]/video`: Admin-only dedicated video replacement endpoint.
  - `DELETE /api/lessons/[id]`: Admin-only lesson document deletion.
- **Admin Curriculum & Video Studio (`src/app/admin/courses/[id]/lessons/page.tsx`):**
  - Course header with total lesson counter and direct links.
  - Multi-part video uploader with upload in-flight indicators and file validation.
  - Interactive lesson list with order renumbering, inline `<video controls>` previews, metadata edit modal, video replacement modal, and deletion confirmation guard.
  - Added "Manage Lessons" navigation button to the course repository table in `/admin/courses`.
- **Public Curriculum & Gated Player:**
  - **Course Detail Page (`src/app/courses/[id]/page.tsx`):** Replaced placeholder with live curriculum view displaying lesson order, titles, preview badges, and direct player links for preview lessons.
  - **Interactive Learning Player (`src/app/learn/[courseId]/[lessonId]/page.tsx`):** Responsive classroom interface with HTML5 video player for free preview lessons / admins, and locked status placeholder ("This lesson unlocks after enrollment") for gated lessons. Includes course curriculum sidebar and prev/next lesson navigation.

---

## 📸 Verification Screenshots

### Part 1: Authentication & Foundation
| User Registration (`/register`) | User Login (`/login`) |
| :---: | :---: |
| ![User Registration](docs/screenshots/01_register_page.png) | ![User Login](docs/screenshots/02_login_page.png) |
| **Authenticated Dashboard (`/dashboard`)** | **Duplicate Account Guard** |
| ![Authenticated Dashboard](docs/screenshots/03_dashboard_authenticated.png) | ![Duplicate Registration Error](docs/screenshots/04_duplicate_registration_error.png) |

### Part 2: Course Catalog & Admin Management
| Public Course Catalog (`/`) | Course Detail Page (`/courses/[id]`) |
| :---: | :---: |
| ![Course Catalog](docs/screenshots/05_course_catalog.png) | ![Course Detail](docs/screenshots/06_course_detail.png) |
| **Admin Overview Dashboard (`/admin`)** | **Admin Categories Management (`/admin/categories`)** |
| ![Admin Overview](docs/screenshots/07_admin_overview.png) | ![Admin Categories](docs/screenshots/08_admin_categories.png) |
| **Admin Course Management (`/admin/courses`)** | **Category Deletion Guard (Error Banner)** |
| ![Admin Courses](docs/screenshots/09_admin_courses.png) | ![Category Deletion Blocked](docs/screenshots/10_category_deletion_blocked.png) |
| **Unpublished Course 404 Guard** | |
| ![Unpublished Course 404](docs/screenshots/11_unpublished_course_404.png) | |

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
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token_here
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


--- FILE: lms-part1-foundation-spec.md ---
# LMS Project — Part 1: Foundation

**Goal:** Set up the Next.js project, database models, authentication (register/login/logout), protected routes, and a basic layout with role-aware navigation. This is the base every later part builds on top of.

---

## 1. Project Setup

Scaffold with the official CLI, pinned to **Next.js 15** (not 16 — the LMS course and later parts assume Next 15's App Router conventions):

```bash
npx create-next-app@latest lms-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

After scaffolding, edit `package.json`:
- Change `"next"` to `"^15.5.23"` (or latest 15.x)
- Add dependencies: `mongoose@^8.5.2`, `bcryptjs@^2.4.3`, `jsonwebtoken@^9.0.2`
- Add dev dependencies: `@types/bcryptjs@^2.4.6`, `@types/jsonwebtoken@^9.0.6`

Then delete `node_modules` and `package-lock.json`, and run `npm install` again so the lockfile matches.

Remove unused CLI boilerplate: `AGENTS.md`, `CLAUDE.md`, `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg`.

**Do not use `next/font/google`** (or any Google Fonts import) — use Tailwind's default system font stack instead. This avoids a network dependency at build time.

---

## 2. Environment Variables

Create `.env.example`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
```

(Later parts will add `BLOB_READ_WRITE_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` — don't add them yet.)

---

## 3. Design Tokens

In `src/app/globals.css`, replace the default `:root` and `@theme inline` blocks with these tokens (Tailwind v4 CSS-first theming — academic/education visual identity: deep plum primary + gold accent):

```css
@import "tailwindcss";

:root {
  --background: #faf8f6;
  --foreground: #221b20;
  --muted: #7a7078;
  --border: #e8e1e4;
  --surface: #ffffff;
  --primary: #6b2d5c;
  --primary-dark: #4f2144;
  --primary-tint: #f3e8f0;
  --gold: #c9972a;
  --gold-tint: #faf1dd;
  --green: #2e8b57;
  --green-tint: #e6f4ec;
  --red: #c0392b;
  --red-tint: #fbe9e7;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --color-primary-dark: var(--primary-dark);
  --color-primary-tint: var(--primary-tint);
  --color-gold: var(--gold);
  --color-gold-tint: var(--gold-tint);
  --color-green: var(--green);
  --color-green-tint: var(--green-tint);
  --color-red: var(--red);
  --color-red-tint: var(--red-tint);
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-serif: ui-serif, Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SFMono-Regular", "IBM Plex Mono", Menlo, monospace;
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

---

## 4. Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Home page
│   ├── register/page.tsx
│   ├── login/page.tsx
│   ├── dashboard/page.tsx    # Protected placeholder page
│   └── api/
│       └── auth/
│           ├── register/route.ts
│           ├── login/route.ts
│           ├── logout/route.ts
│           └── me/route.ts
├── components/
│   └── Navbar.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── db.ts                 # MongoDB connection
│   ├── jwt.ts                # JWT sign/verify
│   ├── auth.ts                # Cookie-based auth helpers
│   └── response.ts             # Shared API response shape
└── models/
    ├── User.ts
    ├── Category.ts            # Empty schema now, used in Part 2
    ├── Course.ts               # Empty schema now, used in Part 2
    ├── Lesson.ts                # Empty schema now, used in Part 3
    └── Enrollment.ts             # Empty schema now, used in Part 4
```

Build all 5 models now even though only `User` is used in Part 1 — this avoids rework when Part 2 onward references them.

---

## 5. Database Models

### `src/lib/db.ts` — MongoDB connection

Use a cached-connection pattern (via `global`) so Next.js's dev-mode hot reload and serverless warm invocations don't create a new Mongoose connection every time. Throw a clear error if `MONGO_URI` is missing.

### `src/models/User.ts`

Fields: `name` (String, required), `email` (String, required, unique, lowercase), `password` (String, required, min 6 chars, `select: false`), `role` (enum `'student' | 'admin'`, default `'student'`), timestamps.

- `pre('save')` hook: hash `password` with bcrypt (10 rounds) if modified.
- Instance method `comparePassword(entered: string): Promise<boolean>` using `bcrypt.compare`.
- Export pattern: `mongoose.models.User || mongoose.model('User', userSchema)` (guards against Next.js hot-reload redefining the model).

### `src/models/Category.ts`

Fields: `name` (String, required, unique), `slug` (String, required, unique, lowercase), timestamps. Same `mongoose.models.X ||` export guard.

### `src/models/Course.ts`

Fields: `title`, `slug` (unique), `description`, `category` (ObjectId ref `'Category'`), `instructor` (String), `level` (enum `'Beginner' | 'Intermediate' | 'Advanced'`), `price` (Number, min 0), `thumbnailUrl` (String), `isPublished` (Boolean, default false), timestamps.

### `src/models/Lesson.ts`

Fields: `course` (ObjectId ref `'Course'`), `title`, `order` (Number), `videoUrl` (String), `durationSeconds` (Number), `isPreview` (Boolean, default false — watchable without purchasing), timestamps. Index on `{ course: 1, order: 1 }`.

### `src/models/Enrollment.ts`

Fields: `user` (ObjectId ref `'User'`), `course` (ObjectId ref `'Course'`), `amount` (Number), `paymentStatus` (enum `'Pending' | 'Paid'`), `stripeSessionId`, `stripePaymentIntentId`, `completedLessons` (array of ObjectId ref `'Lesson'`). Timestamps mapped as `{ createdAt: 'enrolledAt', updatedAt: true }`. **Unique compound index** on `{ user: 1, course: 1 }` — a user can only have one enrollment per course.

---

## 6. Auth Utilities

### `src/lib/jwt.ts`

`signToken({ id, role })` and `verifyToken(token)` using `jsonwebtoken`, reading `JWT_SECRET` and `JWT_EXPIRE` from env.

### `src/lib/response.ts`

Two helpers used by every API route for a consistent shape:
- `apiError(message, status)` → `NextResponse.json({ success: false, message }, { status })`
- `apiSuccess(data, status = 200)` → `NextResponse.json({ success: true, ...data }, { status })`

### `src/lib/auth.ts`

Cookie name constant: `AUTH_COOKIE = 'lms_token'`.

Two helper functions, both reading the JWT from the cookie, verifying it, and loading the user from MongoDB:
- `getAuthUserFromRequest(req: NextRequest)` — for use inside Route Handlers, reads `req.cookies.get(AUTH_COOKIE)`.
- `getServerUser()` — for use inside Server Components, reads via `await cookies()` (Next.js 15's `cookies()` is async).

Both return `null` (not a thrown error) if there's no valid session — callers decide whether that's an error.

---

## 7. Auth API Routes

All four routes go through `connectDB()` first, validate input, and return the shared `apiSuccess`/`apiError` shape.

- **`POST /api/auth/register`** — body `{ name, email, password }`. Validate all three present, password ≥ 6 chars. Check email not already taken (400 if so). Create user, sign JWT with `{ id, role }`, set it as an **httpOnly cookie** (`secure` in production, `sameSite: 'lax'`, 7-day maxAge), return `201` with the user object (never the password).
- **`POST /api/auth/login`** — body `{ email, password }`. Look up user with `.select('+password')` (since password has `select: false` on the schema), compare password, same cookie-setting pattern as register, return `200`.
- **`POST /api/auth/logout`** — clears the cookie (`maxAge: 0`), returns success.
- **`GET /api/auth/me`** — uses `getAuthUserFromRequest`, returns `401` if not authenticated, otherwise the user object.

---

## 8. Frontend

### `src/context/AuthContext.tsx`

Client-side React context (`'use client'`). On mount, calls `GET /api/auth/me` to restore session state (sets `loading` false once resolved). Exposes `user`, `loading`, `isAuthenticated`, `isAdmin`, and `register`/`login`/`logout`/`refresh` functions that call the corresponding API routes and update local state. Throw if `useAuth()` is called outside the provider.

### `src/components/Navbar.tsx`

Client component. Shows: brand logo/link to `/`, a "Courses" nav link, and then conditionally:
- While `loading`: nothing extra.
- If logged in: "Admin" link (only if `isAdmin`), "My Learning" link, the user's name, and a "Sign out" button that calls `logout()` then redirects to `/`.
- If logged out: a "Sign in" button linking to `/login`.

Use `usePathname()` to highlight the active link.

### `src/app/layout.tsx`

Root layout. Wrap `children` in `<AuthProvider>`, render `<Navbar />` above `{children}`. Set metadata title/description for the LMS.

### `src/app/page.tsx`

Simple home page explaining what's built so far in Part 1 (auth working, protected routes, role-aware nav) — this is a placeholder; the real course catalog replaces it in Part 2.

### `src/app/register/page.tsx` and `src/app/login/page.tsx`

Client components with controlled form inputs, calling `useAuth().register(...)` / `.login(...)`, showing a validation/error banner on failure, redirecting to `/dashboard` on success.

### `src/app/dashboard/page.tsx`

Client component demonstrating the **protected route pattern**: on mount, if `!loading && !isAuthenticated`, redirect to `/login` via `router.replace('/login')`. While loading or unauthenticated, show a loading state instead of flashing protected content. Once authenticated, show the user's name/email/role as proof the session works.

---

## 9. Verification Checklist (do this before pushing)

1. `npm install` completes cleanly.
2. `npm run build` succeeds with **zero errors**.
3. `npm run lint` passes with **zero errors**.
4. Manually test against a real MongoDB Atlas database (use `.env.example` as a template for a real `.env`):
   - Register a new account → should land on `/dashboard` showing your name/email/role.
   - Refresh the page → should stay logged in (session persists via cookie).
   - Click "Sign out" → should return to logged-out state.
   - Try to open `/dashboard` directly while logged out → should redirect to `/login`.
   - Log back in with the same credentials → should succeed and land on `/dashboard`.
   - Try registering with the same email again → should show a clear error, not crash.
5. Take screenshots of: the register page, login page, dashboard (logged in), and the terminal output of a successful `npm run build`.

## 10. GitHub

- Repo name suggestion: `lms-nextjs-foundation` (or just `lms-nextjs` if you want one repo for the whole project across all 6 parts — recommended, since later parts extend this same codebase rather than starting fresh).
- Public repo, empty (no auto-generated README/gitignore).
- Commit files individually with descriptive messages.
- Push to `origin main`.
- Add the verification screenshots to `docs/screenshots/` and reference them in the README under a "Part 1: Foundation" heading.

**Do not deploy to Vercel yet** — later parts add more environment variables (Blob storage, Stripe), so we'll deploy once more of the app exists. Local verification against a real MongoDB Atlas database is enough for this part.


--- FILE: lms-part1-cleanup-prompt.md ---
# Part 1 Cleanup — Remove Out-of-Scope Files, Finish Verification

The Part 1 build succeeded, but it included files well beyond Part 1's scope — likely merged in from the old `full_project_dump.md` reference project. Before we move to Part 2, clean this up so the codebase only contains what Part 1 actually specified.

## 1. Delete these out-of-scope files/folders entirely

These belong to later parts (2–5) and should not exist yet — they'll be built fresh against the real backend when we get there, not left over as fake-data mockups:

- `src/app/admin/` (entire folder — analytics, courses, users, layout, page)
- `src/app/courses/` (entire folder)
- `src/app/learn/` (entire folder)
- `src/app/my-courses/`
- `src/components/admin/` (entire folder)
- `src/components/checkout/` (entire folder)
- `src/components/courses/` (entire folder)
- `src/components/layout/` (entire folder — this duplicates `src/components/Navbar.tsx`)
- `src/components/auth/AuthModal.tsx` (we're using dedicated `/login` and `/register` pages, not a modal)
- `src/context/LMSContext.tsx`
- `src/data/` (entire folder, including `mockCourses.ts`)
- `src/types/index.ts` **only if** nothing from Part 1's actual files imports it — check first
- `src/lib/utils.ts` **only if** nothing from Part 1's actual files imports it — check first
- `tailwind.config.ts` — this project uses Tailwind v4's CSS-first `@theme inline` config in `globals.css`, not a JS config file. Having both can cause conflicts or confusion. Remove it unless something in `globals.css` explicitly requires it.

## 2. After deleting, verify nothing is broken

Run `npm run build` again. If it fails because some file you kept still imports one of the deleted files, either delete that importing file too (if it's also out-of-scope) or remove the broken import.

Confirm the final route list from `npm run build` output matches **only**:
```
/
/_not-found
/api/auth/login
/api/auth/logout
/api/auth/me
/api/auth/register
/dashboard
/login
/register
```

If any other route still appears, something out-of-scope wasn't fully removed.

## 3. Complete the manual verification (this was skipped)

Using a real MongoDB Atlas connection string in `.env.local`:

1. Run `npm run dev`.
2. Register a new account → confirm it lands on `/dashboard` showing your name, email, and role.
3. Refresh the page → confirm you're still logged in (session persists via the cookie).
4. Click "Sign out" → confirm you return to a logged-out state.
5. Try opening `/dashboard` directly in a new tab while logged out → confirm it redirects to `/login`.
6. Log back in with the same credentials → confirm it succeeds and lands on `/dashboard`.
7. Try registering again with the same email → confirm you get a clear error, not a crash.

Take screenshots of: the register page, login page, dashboard while logged in, and the terminal output of a successful `npm run build`. Save them to `docs/screenshots/`.

## 4. Push to GitHub (this was not done)

- Create a new **public**, empty GitHub repo (no auto-generated README/gitignore).
- Repo name: `lms-nextjs` (this will be the single repo for all 6 parts).
- Description: "Full-stack Learning Management System built with Next.js 15, MongoDB, JWT auth, Vercel Blob video, and Stripe payments. Built incrementally in parts — see README for progress."
- Initialize git, commit every file individually with descriptive messages, push to `origin main`.
- Add the screenshots from step 3 to `docs/screenshots/`, reference them in a `README.md` under a "Part 1: Foundation" heading, commit, push again.

## 5. Report back

Once done, share:
- The GitHub repo link
- Confirmation the route list matches the expected 9 routes above
- The screenshots (or a description of what they show)

I'll verify the repo directly before we move to Part 2.


--- FILE: lms-part2-catalog-admin-spec.md ---
# LMS Project — Part 2: Course Catalog & Admin CRUD

**Builds on Part 1.** Do not modify anything in `src/models/`, `src/lib/`, `src/context/AuthContext.tsx`, or the `/api/auth/*` routes — they're done and verified. This part adds categories, courses, public browsing, and admin management on top of that foundation.

---

## 1. Scope for this part

- Admin-only CRUD for **Categories**
- Admin-only CRUD for **Courses** (not lessons yet — that's Part 3)
- Public course catalog: browse, search, filter by category
- Public course detail page
- An `isAdmin`-gated `/admin` section with a sidebar/nav distinct from the public site

**Do not build yet** (later parts): lesson management, video upload, enrollment/payment, admin analytics, user management. If you're tempted to stub these out "for later," don't — an empty stub page that isn't wired to anything real just becomes clutter, same problem as last time.

---

## 2. Shared Auth Guard for Admin API Routes

Create `src/lib/adminGuard.ts`:

```typescript
export async function requireAdmin(req: NextRequest): Promise<IUser | NextResponse>
```

- Calls `getAuthUserFromRequest(req)`.
- If no user → return `apiError('Not authenticated', 401)`.
- If user role isn't `'admin'` → return `apiError('Admin access required', 403)`.
- Otherwise → return the user.

Callers do:
```typescript
const authResult = await requireAdmin(req);
if (authResult instanceof NextResponse) return authResult;
const admin = authResult; // typed as IUser from here
```

This avoids repeating the same auth-check boilerplate in every admin route.

---

## 3. Category API Routes

`src/app/api/categories/route.ts`:
- `GET` — public, returns all categories, sorted by name.
- `POST` — admin only (`requireAdmin`). Body `{ name }`. Auto-generate `slug` from `name` (lowercase, spaces→hyphens, strip non-alphanumeric). Return 400 if name empty or slug already exists.

`src/app/api/categories/[id]/route.ts`:
- `DELETE` — admin only. Return 400 if any Course still references this category (don't allow orphaning courses — require the admin to reassign or delete those courses first, and say so in the error message).

---

## 4. Course API Routes

**Important — route ordering.** In Part 1's sibling projects, static routes placed after dynamic `:id`/`[id]` routes got silently swallowed (Express matched `:id` against literal words like "new" or "mine"). Next.js route handlers use folder-based routing so this specific bug can't happen the same way, but keep the equivalent discipline: `/api/courses/mine` (if you add anything like it later) must be its own folder, not something that could collide with `/api/courses/[id]`.

`src/app/api/courses/route.ts`:
- `GET` — public. Query params: `?keyword=` (case-insensitive match on `title`), `?category=` (category ObjectId), `?level=`. **Only return courses where `isPublished: true`** for non-admin requests — an unpublished course should not appear in the public catalog. (Check the requester: if `getAuthUserFromRequest` resolves to an admin, include unpublished courses too; otherwise filter to `isPublished: true` only.)
- `POST` — admin only. Body `{ title, description, category, instructor, level, price, thumbnailUrl }`. Auto-generate `slug` from `title`, ensure uniqueness (append `-2`, `-3` etc. if the slug already exists rather than erroring). Validate `category` references a real Category document (404 if not). New courses default `isPublished: false` — admin publishes explicitly.

`src/app/api/courses/[id]/route.ts`:
- `GET` — public detail. **If the course is unpublished and the requester isn't an admin, return 404** (not 403 — don't reveal that an unpublished course exists at all to non-admins).
- `PUT` — admin only. Partial update, `runValidators` equivalent (Mongoose does this by default on `save()`; if using `findByIdAndUpdate`, pass `{ new: true, runValidators: true }`).
- `DELETE` — admin only. For now (Lesson model isn't wired to lessons yet in the UI), just delete the course document. Part 3 will add "also delete this course's lessons" when lessons actually exist.

`src/app/api/admin/courses/route.ts`:
- `GET` — admin only. Returns ALL courses (published and unpublished), for the admin course-management table.

---

## 5. Frontend — Public Pages

### `src/app/page.tsx` (replace the Part 1 placeholder)

Now a real course catalog homepage:
- Search bar (`?keyword=`) and category filter dropdown, both updating the query via `useSearchParams`/`router.push`.
- Grid of course cards: thumbnail, title, category name, level badge, price, instructor.
- Empty state if no courses match.
- Loading state while fetching.

### `src/app/courses/[id]/page.tsx`

Course detail page:
- Full title, description, instructor, level, price, category.
- A "Curriculum" section — for now, since lessons don't exist yet, show "Lessons coming in Part 3" as a placeholder text, not a fake lesson list.
- An "Enroll" button that's **visibly disabled** with a tooltip/caption "Payments coming in Part 4" — don't fake a working enroll flow.

Keep the Part 1 home page's "What's built so far" framing but move it to this catalog page or drop it — your call, just don't leave two competing homepages.

---

## 6. Frontend — Admin Section

### `src/app/admin/layout.tsx`

- On mount, check `useAuth()` — if `!loading && !isAdmin`, redirect to `/` (non-admins should never see admin UI, not even a flash of it).
- Simple sidebar: links to `/admin` (overview — can just list courses for now), `/admin/categories`, `/admin/courses`.

### `src/app/admin/categories/page.tsx`

- Table of existing categories with a delete button per row (with confirm dialog).
- A form to add a new category (name only, slug auto-generated server-side).
- Show the backend's error message plainly if delete fails because courses reference it.

### `src/app/admin/courses/page.tsx`

- Table of ALL courses (published + unpublished), with a visible "Published"/"Draft" badge per row.
- A form (inline or modal — your choice, but if a modal, don't reintroduce the old `AuthModal.tsx` pattern, this is a new, separate component) to create a course: title, description, category (dropdown from `GET /api/categories`), instructor, level, price, thumbnail URL.
- Edit and delete actions per row.
- A "Publish"/"Unpublish" toggle button per row (calls `PUT /api/courses/:id` with `{ isPublished: true/false }`).

---

## 7. Verification Checklist

1. `npm run build` — zero errors. Confirm the route list now includes `/courses/[id]`, `/admin`, `/admin/categories`, `/admin/courses`, and the new API routes, with nothing extra.
2. `npm run lint` — zero errors.
3. Manual test against real MongoDB (screenshot each step):
   - Log in as the admin test account (promote a user to `role: 'admin'` directly in MongoDB Atlas if you haven't already).
   - Create 2–3 categories.
   - Create 3+ courses across different categories, leave one unpublished.
   - Confirm the **public catalog only shows published courses** — log out (or use an incognito window) and verify the unpublished one is genuinely absent, and that visiting its detail page URL directly returns a 404-style "not found" rather than showing the content.
   - Search and category-filter on the public catalog, confirm results update correctly.
   - Toggle a course to published, confirm it now appears publicly.
   - Try deleting a category that still has courses attached — confirm you get a clear error, not a silent failure or a crash.
   - As a non-admin (regular student) logged-in user, try visiting `/admin` directly — confirm you're redirected away, not shown any admin content.
4. Screenshot: catalog page, course detail page, admin categories page, admin courses page (with both published/draft badges visible), and the blocked-category-delete error.

## 8. Git & Push

- Same repo (`edupulse-lms-nextjs`), same pattern: commit logically grouped changes with descriptive messages (e.g. `feat(models/api): category CRUD routes`, `feat(admin): course management UI`, `feat(catalog): public course browsing and detail page`), push to `origin main`.
- Update `README.md` with a "Part 2: Course Catalog & Admin CRUD" section and the new screenshots in `docs/screenshots/`.

Report back with the repo state once done and I'll verify directly before writing Part 3.


--- FILE: lms-part3-lessons-video-spec.md ---
# LMS Project — Part 3: Lessons & Video

**Builds on Parts 1 and 2.** Do not modify anything in `src/models/`, `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/jwt.ts`, `src/lib/response.ts`, `src/lib/adminGuard.ts`, `AuthContext.tsx`, or any `/api/auth/*` or `/api/categories/*` route — they're done and verified. This part adds lesson CRUD (nested under courses) and real video upload/streaming via Vercel Blob.

---

## 1. Scope for this part

- Admin-only CRUD for **Lessons**, scoped to a specific course
- Real video file upload (not a URL paste field) via Vercel Blob, from the admin lesson form
- A course "curriculum" view on the public course detail page, replacing the Part 2 "Lessons coming in Part 3" placeholder
- A basic lesson video player page — **but gated**: only the first lesson marked `isPreview: true` should actually be watchable by non-enrolled visitors; everything else should show a locked state with "Enroll to unlock" (since enrollment/payment isn't built until Part 4, this locked state is honest UI, not a broken promise)

**Do not build yet:** enrollment, payment, progress tracking (`completedLessons` on the Enrollment model exists in the schema but isn't wired to anything until Part 4), admin analytics, user management.

---

## 2. Vercel Blob Setup (do this first, before writing code)

1. In the Vercel dashboard, open this project → **Storage** tab → **Create Database** → **Blob**. Free tier is enough.
2. Vercel auto-generates `BLOB_READ_WRITE_TOKEN` and offers to add it to your project's environment variables — accept that.
3. For **local development**, pull that same env var down: `vercel env pull .env.local` (requires the Vercel CLI logged into this project — `npx vercel login` then `npx vercel link` if not already linked). Alternatively, copy the token value from the Vercel dashboard's Environment Variables page directly into `.env.local` by hand.
4. Add `BLOB_READ_WRITE_TOKEN=` to `.env.example` (no real value, just the key name) so the pattern is documented.

If this token isn't available, video upload cannot be tested locally — flag that clearly rather than silently skipping the verification step.

---

## 3. Video Upload Utility

`src/lib/videoUpload.ts`:

```typescript
export class VideoUploadError extends Error {
  statusCode: number;
}

export async function uploadVideo(file: File): Promise<{ url: string; size: number }>
```

- Validate `file.type` is one of `video/mp4`, `video/webm`, `video/quicktime` — reject anything else with a clear message.
- Validate `file.size` ≤ 200MB — reject oversized files with a message stating the actual size.
- If `BLOB_READ_WRITE_TOKEN` isn't set, throw a clear `VideoUploadError` with statusCode 500 explaining Blob storage isn't configured (don't let this fail with a cryptic "undefined" error).
- Use `put()` from `@vercel/blob` with `access: 'public'` and `addRandomSuffix: true`, filename prefixed `lessons/${Date.now()}-${sanitized original name}`.
- Return the resulting public URL.

**Why this matters for "streaming"**: Vercel Blob URLs support HTTP range requests, which is what lets a plain `<video>` tag seek/scrub without downloading the whole file first — that's the actual streaming behavior, not something we need to build ourselves.

---

## 4. Lesson API Routes

`src/app/api/courses/[id]/lessons/route.ts`:
- `GET` — public, returns all lessons for this course, sorted by `order`. **Do not include `videoUrl` in the response for lessons where `isPreview: false`** unless the requester is an admin — non-enrolled visitors should see the lesson title/order/duration in the curriculum list, but not get a working video URL for locked lessons. (Enrollment-based unlocking comes in Part 4; for now, "preview lessons only" is the unlock rule.)
- `POST` — admin only. Expects `multipart/form-data` with fields: `title`, `order`, `isPreview`, and a `video` file field. Calls `uploadVideo()`, then creates the Lesson document with the resulting `videoUrl`. Validate the `course` param references a real, existing course (404 if not).

`src/app/api/lessons/[id]/route.ts`:
- `PUT` — admin only. Supports updating `title`, `order`, `isPreview` via JSON body (no video re-upload in this route — see below).
- `DELETE` — admin only. Deletes the lesson document. (Leave the actual video file in Blob storage — deleting blobs is an optional nice-to-have, not required; don't spend time on it unless the rest of this part is done early.)

`src/app/api/lessons/[id]/video/route.ts`:
- `PUT` — admin only, separate endpoint specifically for replacing a lesson's video (multipart form with just a `video` field). Keeps the "replace video" action distinct from "edit metadata" so the admin UI can offer them as separate, clear actions.

**Route ordering reminder**: `src/app/api/courses/[id]/lessons/route.ts` and `src/app/api/lessons/[id]/route.ts` are different path shapes (`courses/[id]/lessons` vs `lessons/[id]`), so there's no collision risk here — just keep this pattern in mind for anything added later.

---

## 5. Frontend — Admin Lesson Management

### `src/app/admin/courses/[id]/lessons/page.tsx`

A dedicated page (linked from the admin courses table — add a "Manage Lessons" button/link per course row in `src/app/admin/courses/page.tsx`) for one course's curriculum:

- List of existing lessons in order, showing title, order, duration (if known), preview badge, and a working `<video controls>` preview player for each (using the real `videoUrl`).
- A form to add a new lesson: title, order (number), preview checkbox, and a native `<input type="file" accept="video/mp4,video/webm,video/quicktime">`.
- Show real upload progress feedback (at minimum a "Uploading…" state while the request is in flight — full percentage progress is a nice-to-have, not required, since the underlying `fetch`/`put()` call doesn't expose granular progress without extra plumbing).
- Edit (title/order/preview toggle) and delete actions per lesson.
- A "Replace video" action per lesson, separate from metadata edit.

---

## 6. Frontend — Public Curriculum & Player

### `src/app/courses/[id]/page.tsx` (update from Part 2)

Replace the "Lessons coming in Part 3" placeholder with a real curriculum list: lesson titles in order, with a lock icon on non-preview lessons and a play icon on preview lessons. Clicking a preview lesson navigates to the player; clicking a locked lesson does nothing (or shows a small "Enroll to unlock" tooltip — still don't build a working enroll flow yet).

### `src/app/learn/[courseId]/[lessonId]/page.tsx`

A basic lesson player page:
- If the lesson is a preview lesson (or the requester is an admin), show a real `<video controls className="w-full">` with the lesson's `videoUrl`, playable and scrubbable.
- If the lesson is NOT a preview lesson and the requester isn't an admin, show a locked state: no video element at all (don't render a `<video>` tag with an empty/placeholder src — that's confusing UI), just a clear message "This lesson unlocks after enrollment (Part 4)" with a disabled-looking placeholder box.
- Simple prev/next lesson navigation within the same course's lesson list, respecting the same lock rule on next/prev targets.

---

## 7. Verification Checklist

1. `npm run build` — zero errors. Confirm new routes appear: `/courses/[id]/lessons`, `/admin/courses/[id]/lessons`, `/learn/[courseId]/[lessonId]`, and the new lesson API routes.
2. `npm run lint` — zero errors.
3. Manual test against real MongoDB + real Vercel Blob (screenshot each step):
   - As admin, open a published course's "Manage Lessons" page.
   - Upload a real short video file (a few seconds, doesn't need to be long) as Lesson 1, mark it `isPreview: true`.
   - Upload a second video as Lesson 2, leave `isPreview: false`.
   - Confirm both appear in the admin lesson list with working inline preview players.
   - Log out (or incognito), visit the course's public detail page — confirm the curriculum shows both lesson titles, with Lesson 1 unlocked/playable and Lesson 2 showing a lock state.
   - Click into Lesson 1's player page — confirm the video actually plays and you can scrub/seek within it (proving streaming, not just playback of a fully-loaded blob).
   - Try navigating directly to Lesson 2's player URL while logged out — confirm you see the locked state, not the video.
   - As admin, confirm you CAN view Lesson 2's video (admins bypass the lock).
   - Try uploading a non-video file (e.g. a `.txt` renamed to `.mp4`, or just try a `.pdf`) — confirm you get a clear validation error, not a crash or a silently broken lesson.
4. Screenshot: admin lesson upload form, admin lesson list with preview players, public curriculum showing locked/unlocked states, the playing video with visible scrub bar, and the locked-lesson message.

## 8. Git & Push

Same repo, same pattern. Suggested commits: `feat(video): Vercel Blob upload utility`, `feat(api): lesson CRUD and video upload routes`, `feat(admin): lesson management UI with video upload`, `feat(learn): public curriculum and gated video player`. Update `README.md` with a "Part 3: Lessons & Video" section and new screenshots.

Report back with the repo state once done and I'll verify directly before writing Part 4 (Payments & Enrollment).


--- FILE: LMS_Step_By_Step_Notes.md ---
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

