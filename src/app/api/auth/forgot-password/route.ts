import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { passwordResetEmailTemplate } from "@/lib/emailTemplates";
import { apiSuccess } from "@/lib/response";

/**
 * POST /api/auth/forgot-password
 * Generates SHA-256 hashed password reset token (15-min expiry) and emails link.
 * Always returns generic response to prevent account enumeration leaks.
 */
export async function POST(req: NextRequest) {
  const genericResponse = apiSuccess({
    message: "If an account exists for that email address, a password reset link has been sent.",
  });

  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return genericResponse;
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (user && user.isActive) {
      // Generate 32-byte random hex token
      const rawToken = crypto.randomBytes(32).toString("hex");

      // Hash token for database storage
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await user.save();

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "https://edupulse.vercel.app";
      const resetUrl = `${baseUrl}/reset-password/${rawToken}`;

      // Dispatch password reset email (non-blocking)
      sendEmail({
        to: user.email,
        subject: "Password Reset Request — EduPulse Academy",
        html: passwordResetEmailTemplate({
          name: user.name,
          resetUrl,
        }),
      }).catch((err) => console.error("Forgot password email send error:", err));
    }

    return genericResponse;
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return genericResponse;
  }
}
