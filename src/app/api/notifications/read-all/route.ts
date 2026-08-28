import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * PUT /api/notifications/read-all
 * Mark all notifications for the current user as read.
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    await Notification.updateMany(
      { recipient: user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return apiSuccess({
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return apiError(error.message || "Failed to mark notifications read", 500);
  }
}
