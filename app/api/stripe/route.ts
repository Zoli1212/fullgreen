import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import {  headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers()

  console.log('here')

  const signature = headersList.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response(`Webhook Error ${error}`, { status: 400 });
  }

  console.log(process.env.STRIPE_SECRET_WEBHOOK)

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log('session')

      await prisma.order.create({
        data: {
          amount: session.amount_total as number,
          status: session.status as string,
          userId: session.metadata?.userId,
        },
      });

      await redis.del(`cart-${session.metadata?.userId}`);
      break;
    }
    default: {
      console.log("unhandled event");
    }
  }

  return new Response(null, { status: 200 });
}
