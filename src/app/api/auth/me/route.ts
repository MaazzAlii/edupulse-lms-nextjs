import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return apiError("Not authenticated", 401);
    }

    return apiSuccess({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Auth check error:", error);
    return apiError(error.message || "Authentication check failed", 500);
  }
}
