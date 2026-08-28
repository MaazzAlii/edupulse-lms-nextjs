import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Lesson from "@/models/Lesson";
import { getStripe } from "@/lib/stripe";
import { apiError, apiSuccess } from "@/lib/response";
import { checkoutSchema } from "@/lib/validation";

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for purchasing a course, or enrolls user directly if course is free.
 * Requires authentication (User or Admin).
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from HTTP-only JWT cookie
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to enroll in a course.", 401);
    }

    // 2. Parse & Zod validate request body
    const body = await req.json().catch(() => ({}));
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { courseId } = parsed.data;

    // 3. Connect DB and fetch course
    await connectDB();
    const course = await Course.findById(courseId);

    if (!course || !course.isPublished) {
      return apiError("Course not found or is not available for purchase.", 404);
    }

    // 4. Check if user already owns this course with 'Paid' status
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: course._id,
      paymentStatus: "Paid",
    });

    if (existingEnrollment) {
      return apiError("You already own this course.", 400);
    }

    // Determine absolute application base URL for redirects (supports dynamic Vercel host & NEXT_PUBLIC_APP_URL)
    const reqHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const reqProto = req.headers.get("x-forwarded-proto") || "https";
    const requestOrigin = reqHost ? `${reqProto}://${reqHost}` : req.nextUrl.origin;

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL
        : requestOrigin || "http://localhost:3000";

    // 5. Handle Free Course (price === 0): Skip Stripe
    if (course.price === 0) {
      await Enrollment.findOneAndUpdate(
        { user: user._id, course: course._id },
        {
          amount: 0,
          paymentStatus: "Paid",
          stripeSessionId: "free_course_bypass",
        },
        { upsert: true, new: true }
      );

      // Find first lesson for direct learning redirect if available
      const firstLesson = await Lesson.findOne({ course: course._id }).sort({ order: 1 });
      const redirectUrl = firstLesson
        ? `${baseUrl}/learn/${course._id}/${firstLesson._id}`
        : `${baseUrl}/courses/${course._id}?enrolled=true`;

      return apiSuccess({
        redirectUrl,
        message: "Enrolled in free course successfully.",
      });
    }

    // 6. Handle Paid Course: Create Stripe Checkout Session
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description
                ? course.description.slice(0, 500)
                : undefined,
              images: course.thumbnailUrl ? [course.thumbnailUrl] : undefined,
            },
            unit_amount: Math.round(course.price * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}`,
      cancel_url: `${baseUrl}/courses/${course._id}?checkout=cancelled`,
    });

    // 7. Upsert Pending Enrollment row in DB
    await Enrollment.findOneAndUpdate(
      { user: user._id, course: course._id },
      {
        amount: course.price,
        paymentStatus: "Pending",
        stripeSessionId: session.id,
      },
      { upsert: true, new: true }
    );

    return apiSuccess({
      redirectUrl: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return apiError(
      error.message || "Failed to create checkout session",
      error.statusCode || 500
    );
  }
}
