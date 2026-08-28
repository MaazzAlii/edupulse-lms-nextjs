import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * PUT /api/notifications/[id]
 * Mark a single notification as read.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError("Invalid notification ID", 400);
    }

    await connectDB();

    const notification = await Notification.findOne({
      _id: id,
      recipient: user._id,
    });

    if (!notification) {
      return apiError("Notification not found", 404);
    }

    notification.isRead = true;
    await notification.save();

    return apiSuccess({
      message: "Notification marked as read",
      notification,
    });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return apiError(error.message || "Failed to update notification", 500);
  }
}
