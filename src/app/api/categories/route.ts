import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/adminGuard";
import { apiError, apiSuccess } from "@/lib/response";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// GET /api/categories - Public: Returns all categories sorted by name
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return apiSuccess({ categories });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch categories", 500);
  }
}

// POST /api/categories - Admin only: Creates a new category
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return apiError("Category name is required", 400);
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);

    if (!slug) {
      return apiError("Invalid category name resulting in empty slug", 400);
    }

    await connectDB();

    // Check if category name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: trimmedName }, { slug }],
    });

    if (existingCategory) {
      return apiError("A category with this name or slug already exists", 400);
    }

    const newCategory = await Category.create({
      name: trimmedName,
      slug,
    });

    return apiSuccess({ category: newCategory }, 201);
  } catch (error: any) {
    if (error.code === 11000) {
      return apiError("Category name or slug already exists", 400);
    }
    return apiError(error.message || "Failed to create category", 500);
  }
}
