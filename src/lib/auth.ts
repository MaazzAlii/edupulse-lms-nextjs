import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";

export const AUTH_COOKIE = "lms_token";

/**
 * For use inside Route Handlers. Reads cookie from NextRequest,
 * verifies token, and retrieves the User document from DB.
 * Returns null if user is not found or is suspended (isActive === false).
 */
export async function getAuthUserFromRequest(
  req: NextRequest
): Promise<IUser | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isActive === false) return null;

    return user;
  } catch {
    return null;
  }
}

/**
 * For use inside Server Components and Server Actions.
 * In Next.js 15, cookies() is asynchronous.
 * Returns null if user is not found or is suspended (isActive === false).
 */
export async function getServerUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isActive === false) return null;

    return user;
  } catch {
    return null;
  }
}
