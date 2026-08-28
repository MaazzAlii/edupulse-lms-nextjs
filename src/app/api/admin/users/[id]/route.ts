import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/admin/users/[id]
 * Retrieves detailed user profile with their complete enrollment history.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid user ID", 400);
    }

    await connectDB();

    const user = await User.findById(id).select("-password");
    if (!user) {
      return apiError("User not found", 404);
    }

    const enrollments = await Enrollment.find({ user: user._id })
      .populate("course", "title slug thumbnailUrl price category")
      .sort({ enrolledAt: -1 });

    return apiSuccess({
      user,
      enrollments,
      enrollmentCount: enrollments.length,
    });
  } catch (error: any) {
    console.error("Error fetching user detail:", error);
    return apiError(error.message || "Failed to fetch user details", 500);
  }
}

/**
 * PUT /api/admin/users/[id]
 * Updates user role or active/suspended status with self-lockout and last-admin guards.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;
    const currentAdmin = authResult; //Typed IUser from requireAdmin

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid user ID", 400);
    }

    const body = await req.json();
    const { role, isActive } = body;

    await connectDB();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return apiError("User not found", 404);
    }

    const isSelf = currentAdmin._id.toString() === id;
    const isDemotingOrDeactivating =
      (role !== undefined && role === "student" && targetUser.role === "admin") ||
      (isActive !== undefined && isActive === false && targetUser.isActive === true);

    // 1. Guard against self-lockout
    if (isSelf && isDemotingOrDeactivating) {
      return apiError("You cannot change your own admin access or suspend your own account.", 400);
    }

    // 2. Guard against removing the last remaining active admin
    if (targetUser.role === "admin" && isDemotingOrDeactivating) {
      const remainingAdminsCount = await User.countDocuments({
        role: "admin",
        isActive: true,
        _id: { $ne: targetUser._id },
      });

      if (remainingAdminsCount === 0) {
        return apiError(
          "Cannot demote or deactivate the last remaining admin account.",
          400
        );
      }
    }

    const updateData: Record<string, any> = {};
    if (role !== undefined && (role === "student" || role === "admin")) {
      updateData.role = role;
    }
    if (isActive !== undefined && typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return apiSuccess({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return apiError(error.message || "Failed to update user", 500);
  }
}
