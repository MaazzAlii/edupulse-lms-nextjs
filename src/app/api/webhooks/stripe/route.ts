import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Stripe from "stripe";

// Force Node.js runtime for raw request body parsing & crypto verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Stripe Webhook Error: Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe Webhook Error: STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret is not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Read raw body string (do NOT call req.json())
    const rawBody = await req.text();
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Stripe Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle specific webhook event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      console.error(
        "Stripe Webhook Error: Missing metadata (userId or courseId) in checkout session",
        session.id
      );
      return NextResponse.json(
        { error: "Missing session metadata" },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || "";

      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      // Update or create enrollment to Paid status
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

      console.log(
        `✅ Successfully processed payment for user ${userId} on course ${courseId}. Enrollment ID: ${updatedEnrollment._id}`
      );
    } catch (dbError: any) {
      console.error("Error updating enrollment status in database:", dbError);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  // Return 200 fast to acknowledge receipt to Stripe
  return NextResponse.json({ received: true }, { status: 200 });
}
