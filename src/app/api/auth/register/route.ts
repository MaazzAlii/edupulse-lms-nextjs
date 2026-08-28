import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { welcomeEmailTemplate } from "@/lib/emailTemplates";

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

    // Send Welcome Email (non-blocking)
    sendEmail({
      to: user.email,
      subject: "Welcome to EduPulse Academy! 🚀",
      html: welcomeEmailTemplate(user.name),
    }).catch((err) => console.error("Welcome email send error:", err));

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
