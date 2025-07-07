import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Explicitly use the test keys from .env.local for development
let stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Override with test key if we're in development and the key doesn't start with sk_test_
if (process.env.NODE_ENV === 'development' && !stripeSecretKey.startsWith('sk_test_')) {
  console.log("Warning: Not using a test key in development. Forcing to use test key.");
  stripeSecretKey = process.env.TEST_STRIPE_SECRET_KEY || stripeSecretKey;
}

console.log("Using Stripe secret key:", 
  stripeSecretKey ? (stripeSecretKey.substring(0, 8) + "..." + stripeSecretKey.substring(stripeSecretKey.length - 4)) : "<no key>");

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

// Constants for fee calculations
const PLATFORM_FEE_PERCENTAGE = 0.02; // 2%
const STRIPE_FEE_PERCENTAGE = 0.029; // 2.9%
const STRIPE_FIXED_FEE = 0.30; // $0.30

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, serviceId, workerId, businessId, date, time, clientName, clientEmail } = body;
    const session = await getServerSession(authOptions);
    const clientId = session?.user?.id;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    // Calculate fees
    const amountInCents = Math.round(amount * 100); // Convert to cents for Stripe
    const platformFeeAmount = amount * PLATFORM_FEE_PERCENTAGE;
    const stripeFeeAmount = (amount * STRIPE_FEE_PERCENTAGE) + STRIPE_FIXED_FEE;
    const businessAmount = amount - platformFeeAmount - stripeFeeAmount;

    try {
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          serviceId,
          workerId,
          businessId,
          date,
          time,
          clientName,
          clientEmail,
          platformFeeAmount: platformFeeAmount.toFixed(2),
          stripeFeeAmount: stripeFeeAmount.toFixed(2),
          businessAmount: businessAmount.toFixed(2),
        },
      });

      console.log("Payment intent created with ID:", paymentIntent.id);

      // Create a pending payment record in the database
      try {
        await prisma.payment.create({
          data: {
            amount,
            platformFeeAmount,
            stripeFeeAmount,
            businessAmount,
            status: "pending",
            stripePaymentId: paymentIntent.id,
            business: {
              connect: { id: businessId }
            },
            ...(serviceId ? { service: { connect: { id: serviceId } } } : {}),
            ...(clientId ? { client: { connect: { id: clientId } } } : {}),
          },
        });
      } catch (dbError) {
        console.error("Database error when creating payment record:", dbError);
        // Even if the database save fails, return the client secret if we have a payment intent
        // The webhook can handle updating the database later
      }

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
      
    } catch (stripeError) {
      console.error("Stripe error when creating payment intent:", stripeError);
      return NextResponse.json(
        { error: "Error from payment provider" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

// Webhook to handle payment status updates
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { paymentIntentId, status } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // Update payment status in the database
    const payment = await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntentId,
      },
      data: {
        status: status || "completed",
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
