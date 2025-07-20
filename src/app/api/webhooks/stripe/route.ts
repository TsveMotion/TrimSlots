import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature") || "";

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Extract booking details from metadata
      const { serviceId, workerId, businessId, date, time, clientName, clientEmail } = paymentIntent.metadata;
      
      // Create booking in database
      await prisma.booking.create({
        data: {
          service: { connect: { id: serviceId } },
          workerId: workerId, // Using workerId field directly as per schema
          business: { connect: { id: businessId } },
          startTime: new Date(date + ' ' + time),
          endTime: new Date(date + ' ' + time), // This should be calculated based on service duration
          clientId: clientEmail, // Assuming clientEmail is used as clientId
          status: "confirmed",
          isPaid: true,
          notes: `Payment ID: ${paymentIntent.id}, Amount: $${paymentIntent.amount / 100}`
        },
      });
      
      console.log(`Payment succeeded and booking created for: ${clientName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
