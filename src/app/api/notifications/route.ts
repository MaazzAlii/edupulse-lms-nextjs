import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/notifications
 * Fetch user notifications and unread count.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("Authentication required.", 401);
    }

    await connectDB();

    const notifications = await Notification.find({ recipient: user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: user._id,
      isRead: false,
    });

    return apiSuccess({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return apiError(error.message || "Failed to fetch notifications", 500);
  }
}
