"use server";

import { auth } from "@/auth";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any, // Cast a any para evitar errores de tipado en el build
});

export async function createCheckoutSession() {
    const session = await auth();
    if (!session || !session.user?.id) {
        return { error: "Debes iniciar sesión para contratar un plan." };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return { error: "El sistema de pagos no está configurado (Falta STRIPE_SECRET_KEY)." };
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/premium?status=cancel`,
            metadata: {
                userId: session.user.id,
            },
            customer_email: session.user.email!,
        });

        return { url: checkoutSession.url };
    } catch (error: any) {
        console.error("Error en Stripe Checkout:", error);
        return { error: error.message || "Error al crear la sesión de pago." };
    }
}

export async function cancelSubscription() {
    const session = await auth();
    if (!session || !session.user?.id) {
        return { error: "No autorizado" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { role: "USER" },
        });

        revalidatePath("/dashboard/account");
        revalidatePath("/dashboard/premium");

        return { success: "Suscripción cancelada. Tu cuenta volverá al plan básico." };
    } catch (error: any) {
        console.error("Error al cancelar suscripción:", error);
        return { error: "Error al procesar la cancelación." };
    }
}
