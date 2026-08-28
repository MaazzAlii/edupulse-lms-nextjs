import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import Notification from "@/models/Notification";
import { getStripe } from "@/lib/stripe";
import { apiError, apiSuccess } from "@/lib/response";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmailTemplate } from "@/lib/emailTemplates";

/**
 * GET /api/checkout/verify?session_id=...
 * Directly verifies Stripe checkout session status with Stripe API.
 * If payment is paid, activates enrollment in DB immediately (failsafe for webhooks).
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return apiError("You must be logged in to verify checkout.", 401);
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return apiError("Missing session_id parameter.", 400);
    }

    await connectDB();

    // Retrieve checkout session directly from Stripe API
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return apiError("Checkout session not found on Stripe.", 404);
    }

    const userId = session.metadata?.userId || user._id.toString();
    const courseId = session.metadata?.courseId;

    if (!courseId) {
      return apiError("Course metadata missing from checkout session.", 400);
    }

    // If Stripe confirms payment status is 'paid'
    if (session.payment_status === "paid") {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || "";

      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      // Check if already marked Paid in DB to prevent duplicate emails/notifications
      const existing = await Enrollment.findOne({ user: userId, course: courseId });
      const isAlreadyPaid = existing?.paymentStatus === "Paid";

      const updatedEnrollment = await Enrollment.findOneAndUpdate(
        { user: userId, course: courseId },
        {
          paymentStatus: "Paid",
          stripePaymentIntentId: paymentIntentId,
          stripeSessionId: session.id,
          amount: amountTotal,
        },
        { upsert: true, new: true }
      );

      // If enrollment wasn't previously marked Paid, send notification & confirmation email
      if (!isAlreadyPaid) {
        const [buyerUser, courseDoc, adminUsers] = await Promise.all([
          User.findById(userId),
          Course.findById(courseId),
          User.find({ role: "admin" }),
        ]);

        if (adminUsers.length > 0) {
          const buyerName = buyerUser ? buyerUser.name : "A student";
          const courseTitle = courseDoc ? courseDoc.title : "a course";

          await Notification.insertMany(
            adminUsers.map((adm) => ({
              recipient: adm._id,
              type: "new_enrollment",
              message: `${buyerName} enrolled in "${courseTitle}" ($${amountTotal.toFixed(2)})`,
              link: "/admin",
            }))
          ).catch((e) => console.error("Notification insert error:", e));
        }

        if (buyerUser && courseDoc) {
          sendEmail({
            to: buyerUser.email,
            subject: `Order Confirmation — ${courseDoc.title}`,
            html: orderConfirmationEmailTemplate({
              name: buyerUser.name,
              courseTitle: courseDoc.title,
              amount: amountTotal,
              date: new Date().toLocaleDateString(),
              courseId: courseDoc._id.toString(),
            }),
          }).catch((err) => console.error("Order confirmation email error:", err));
        }
      }

      return apiSuccess({
        verified: true,
        paymentStatus: "Paid",
        courseId,
        enrollment: updatedEnrollment,
      });
    }

    return apiSuccess({
      verified: false,
      paymentStatus: session.payment_status,
      courseId,
    });
  } catch (error: any) {
    console.error("Error verifying checkout session:", error);
    return apiError(error.message || "Failed to verify checkout session", 500);
  }
}
