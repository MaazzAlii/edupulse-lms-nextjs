import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Category from "@/models/Category";
import { getAuthUserFromRequest } from "@/lib/auth";
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

async function generateUniqueCourseSlug(title: string): Promise<string> {
  const baseSlug = slugify(title) || "course";
  let slug = baseSlug;
  let counter = 1;

  while (await Course.exists({ slug })) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// GET /api/courses - Public Catalog: Filter by keyword, category, level.
// Admin users can see draft courses; non-admins/anonymous only see isPublished: true
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword")?.trim();
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();

    // Check if requester is admin
    const authUser = await getAuthUserFromRequest(req);
    const isAdmin = authUser?.role === "admin";

    const filter: Record<string, any> = {};

    // Non-admins only see published courses
    if (!isAdmin) {
      filter.isPublished = true;
    }

    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    if (level && ["Beginner", "Intermediate", "Advanced"].includes(level)) {
      filter.level = level;
    }

    const courses = await Course.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess({ courses });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch courses", 500);
  }
}

// POST /api/courses - Admin only: Creates a new course (default isPublished: false)
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const {
      title,
      description,
      category,
      instructor,
      level = "Beginner",
      price = 0,
      thumbnailUrl = "",
    } = body;

    if (!title || !description || !category || !instructor) {
      return apiError(
        "Title, description, category, and instructor are required fields",
        400
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return apiError("Invalid category ID format", 400);
    }

    await connectDB();

    // Validate category exists in DB
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return apiError("Category not found", 404);
    }

    if (price < 0) {
      return apiError("Price cannot be negative", 400);
    }

    const slug = await generateUniqueCourseSlug(title);

    const course = await Course.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      category: categoryDoc._id,
      instructor: instructor.trim(),
      level,
      price: Number(price),
      thumbnailUrl: thumbnailUrl?.trim() || "",
      isPublished: false,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      "category",
      "name slug"
    );

    return apiSuccess({ course: populatedCourse }, 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create course", 500);
  }
}
