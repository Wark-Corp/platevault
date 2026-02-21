"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Marcar una matrícula como verificada por PlateVault
export async function verifyPlate(plate: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }

    const normalizedPlate = plate.trim().toUpperCase();

    const mapping = await prisma.plateMapping.findUnique({
        where: { plate: normalizedPlate }
    });

    if (!mapping) {
        return { success: false, error: "Matrícula no encontrada en el catálogo. Vincúlala primero desde 'Vínculos de Matrículas'." };
    }

    await prisma.plateMapping.update({
        where: { plate: normalizedPlate },
        data: {
            verified: true,
            verifiedAt: new Date()
        }
    });

    revalidatePath("/admin/verify");
    return { success: true };
}

// Revocar la verificación de una matrícula
export async function revokeVerification(plate: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { success: false, error: "No autorizado" };
    }

    await prisma.plateMapping.update({
        where: { plate: plate.trim().toUpperCase() },
        data: {
            verified: false,
            verifiedAt: null
        }
    });

    revalidatePath("/admin/verify");
    return { success: true };
}

// Obtener todas las matrículas verificadas
export async function getVerifiedPlates(query?: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return [];
    }

    return prisma.plateMapping.findMany({
        where: {
            verified: true,
            ...(query ? { plate: { contains: query.toUpperCase() } } : {})
        },
        include: {
            version: {
                select: { make: true, model: true, generation: true, yearStart: true }
            }
        },
        orderBy: { verifiedAt: "desc" }
    });
}

// Verificar el estado de una matrícula concreta (para la UI de búsqueda en admin)
export async function getPlateVerificationStatus(plate: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return null;
    }

    return prisma.plateMapping.findUnique({
        where: { plate: plate.trim().toUpperCase() },
        include: {
            version: {
                select: { make: true, model: true, generation: true, yearStart: true, yearEnd: true }
            }
        }
    });
}
