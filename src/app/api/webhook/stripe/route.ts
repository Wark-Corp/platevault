import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-11-preview" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) {
            console.error("Falta STRIPE_WEBHOOK_SECRET");
            return new NextResponse("Webhook Secret missing", { status: 500 });
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Error en Webhook: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Cuando el pago se completa con éxito
    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId;

        if (userId) {
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: { role: Role.PREMIUM },
                });
                console.log(`Usuario ${userId} actualizado a PREMIUM.`);
            } catch (error) {
                console.error(`Error actualizando rol de usuario ${userId}:`, error);
                return new NextResponse("Error updating user role", { status: 500 });
            }
        }
    }

    return new NextResponse("Success", { status: 200 });
}
