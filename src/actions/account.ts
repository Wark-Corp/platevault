"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string, image?: string }) {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: data.name,
                image: data.image || null
            },
        });
        revalidatePath("/dashboard/account");
        return { success: "Perfil actualizado correctamente." };
    } catch (e) {
        return { error: "Error al actualizar el perfil." };
    }
}

export async function updatePassword(data: { current: string, newPass: string }) {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "Usuario no encontrado" };

    const isValid = await bcrypt.compare(data.current, user.password);
    if (!isValid) return { error: "La contraseña actual es incorrecta." };

    if (data.newPass.length < 6) return { error: "La nueva contraseña debe tener al menos 6 caracteres." };

    const hashed = await bcrypt.hash(data.newPass, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
    });

    return { success: "Contraseña actualizada de forma segura." };
}

export async function setup2FA() {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "Usuario no encontrado" };

    // Generar un nuevo secreto con Speakeasy
    const secret = speakeasy.generateSecret({
        name: `PlateVault (${user.email})`
    });

    // Generar Data URL del QR usando la URL otpauth proporcionada por speakeasy
    const qrCode = await qrcode.toDataURL(secret.otpauth_url as string);

    // Guardar temporalmente en DB pero SIN activarlo aún (usamos Base32)
    await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret.base32, twoFactorEnabled: false }
    });

    return { secret: secret.base32, qrCode };
}

export async function verifyAndEnable2FA(token: string) {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.twoFactorSecret) return { error: "2FA no inicializado." };

    const isValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token
    });
    if (!isValid) return { error: "Código inválido. Inténtalo de nuevo." };

    await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorEnabled: true }
    });

    revalidatePath("/dashboard/account");
    return { success: "Autenticación en dos factores activada con éxito." };
}

export async function disable2FA() {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { twoFactorEnabled: false, twoFactorSecret: null }
    });

    revalidatePath("/dashboard/account");
    return { success: "2FA deshabilitado." };
}

export async function exportUserData() {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            lookups: {
                orderBy: { timestamp: 'desc' }
            }
        }
    });

    if (!user) return { error: "Usuario no encontrado" };

    // Limpiar contraseñas y secretos
    const safeData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        twoFactorEnabled: user.twoFactorEnabled,
        history: user.lookups.map(l => ({
            plate: l.plate,
            timestamp: l.timestamp,
            ip: l.ip,
            status: l.responseHash === "MATCH_FOUND" ? "HIT" : "MISS"
        }))
    };

    return { data: safeData };
}

export async function deleteAccount() {
    const session = await auth();
    if (!session || !session.user?.id) return { error: "No autorizado" };

    // Eliminar todo el historial y luego el usuario (Hard Delete)
    await prisma.plateLookup.deleteMany({
        where: { userId: session.user.id }
    });

    await prisma.user.delete({
        where: { id: session.user.id }
    });

    return { success: "Cuenta eliminada irreversiblemente." };
}
