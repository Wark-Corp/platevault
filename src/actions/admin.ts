"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getAuditLogs() {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    return await prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        include: { user: { select: { email: true, name: true } } },
        take: 50,
    });
}

export async function getStats() {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const userCount = await prisma.user.count();
    const lookupCount = await prisma.plateLookup.count();
    const recentLogs = await prisma.auditLog.count({
        where: {
            timestamp: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }
    });

    return {
        userCount,
        lookupCount,
        recentLogs,
    };
}

export async function getUsers(query?: string, page: number = 1, limit: number = 50) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    const skip = (page - 1) * limit;

    const whereClause: any = query
        ? {
            OR: [
                { name: { contains: query } },
                { email: { contains: query } },
            ],
        }
        : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.user.count({ where: whereClause })
    ]);

    return { users, total, totalPages: Math.ceil(total / limit) };
}

export async function createUser(data: any) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado" };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) return { error: "El email ya está registrado" };

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newU = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "USER",
            }
        });

        await logAudit(session!.user!.id!, "CREATE_USER", { targetEmail: data.email, role: data.role });
        revalidatePath("/admin/users");
        return { success: "Usuario creado exitosamente" };
    } catch (e) {
        return { error: "Error al crear usuario" };
    }
}

export async function updateUser(id: string, data: any) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado" };
    }

    try {
        const updateData: any = {
            name: data.name,
            email: data.email,
            role: data.role
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        await logAudit(session!.user!.id!, "UPDATE_USER", { targetId: id, newRole: data.role });
        revalidatePath("/admin/users");
        return { success: "Usuario actualizado" };
    } catch (e) {
        return { error: "Error al actualizar usuario" };
    }
}

export async function deleteUser(id: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado" };
    }

    // Prevenir auto-eliminación
    if (session?.user?.id === id) {
        return { error: "No puedes eliminar tu propio usuario" };
    }

    try {
        await prisma.user.delete({ where: { id } });
        await logAudit(session!.user!.id!, "DELETE_USER", { targetId: id });
        revalidatePath("/admin/users");
        return { success: "Usuario eliminado" };
    } catch (e) {
        return { error: "Error al eliminar usuario" };
    }
}
