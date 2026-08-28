import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { apiError, apiSuccess } from "@/lib/response";
import { AUTH_COOKIE } from "@/lib/auth";

/**
 * POST /api/auth/reset-password/[token]
 * Verifies SHA-256 token expiry, updates password, and logs user in directly.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: rawToken } = await params;

    if (!rawToken || typeof rawToken !== "string") {
      return apiError("Invalid reset token", 400);
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== "string" || password.length < 6) {
      return apiError("Password must be at least 6 characters long.", 400);
    }

    await connectDB();

    // Hash the raw token to match database record
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return apiError("This reset link is invalid or has expired.", 400);
    }

    // Set new password (pre-save hook hashes it automatically)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Sign fresh JWT and log in user
    const token = signToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = apiSuccess({
      message: "Password reset successful! Logging you in...",
      user: userResponse,
    });

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Reset password error:", error);
    return apiError(error.message || "Failed to reset password", 500);
  }
}
