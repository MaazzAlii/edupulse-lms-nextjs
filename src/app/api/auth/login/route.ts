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

    // Check if account is suspended
    if (user.isActive === false) {
      return apiError("Your account has been suspended — contact support", 403);
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
      isActive: user.isActive,
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
