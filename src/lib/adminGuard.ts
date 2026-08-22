import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { apiError } from "@/lib/response";
import { IUser } from "@/models/User";

export async function requireAdmin(
  req: NextRequest
): Promise<IUser | NextResponse> {
  const user = await getAuthUserFromRequest(req);

  if (!user) {
    return apiError("Not authenticated", 401);
  }

  if (user.role !== "admin") {
    return apiError("Admin access required", 403);
  }

  return user;
}
