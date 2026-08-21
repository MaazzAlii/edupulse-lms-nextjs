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
