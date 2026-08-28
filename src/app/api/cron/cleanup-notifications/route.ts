import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { apiError, apiSuccess } from "@/lib/response";

/**
 * GET /api/cron/cleanup-notifications
 * Cron job to clean up read notifications older than 30 days.
 * Protected via Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev_cron_secret_key_123";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return apiError("Unauthorized cron invocation", 401);
    }

    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      isRead: true,
      createdAt: { $lt: thirtyDaysAgo },
    });

    return apiSuccess({
      message: "Notification cleanup completed successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error running notification cleanup cron:", error);
    return apiError(error.message || "Cron execution failed", 500);
  }
}
