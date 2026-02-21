"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";

export async function register(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        return { error: "Email y contraseña son obligatorios." };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "El email ya está registrado." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "USER",
            },
        });

        return { success: "Usuario creado correctamente. Ya puedes iniciar sesión." };
    } catch (error) {
        return { error: "Ocurrió un error al crear la cuenta." };
    }
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check Rate Limit
    const limit = await checkRateLimit(email, "AUTH");
    if (!limit.allowed) {
        return { error: "Demasiados intentos de acceso. Espera unos minutos." };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Credenciales inválidas." };
                default:
                    return { error: "Algo salió mal." };
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: "/auth/login" });
}
