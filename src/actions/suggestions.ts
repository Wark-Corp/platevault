"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

/**
 * Crea una nueva sugerencia de vínculo de matrícula.
 */
export async function createSuggestion(data: {
    plate: string;
    versionId?: string | null;
    modelNotFound: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Debes iniciar sesión para enviar una sugerencia." };
    }

    try {
        const suggestion = await prisma.plateSuggestion.create({
            data: {
                plate: data.plate.toUpperCase().replace(/\s/g, ""),
                userId: session.user.id,
                versionId: data.versionId || null,
                modelNotFound: data.modelNotFound,
                status: "PENDING",
            }
        });

        await logAudit(session.user.id, "PLATE_SUGGESTION_CREATED", {
            plate: suggestion.plate,
            suggestionId: suggestion.id
        });

        revalidatePath("/dashboard/suggestions");
        return { success: "Sugerencia enviada correctamente para revisión administrativa.", id: suggestion.id };
    } catch (error) {
        console.error("Error creating suggestion:", error);
        return { error: "Ocurrió un error al enviar la sugerencia." };
    }
}

/**
 * Obtiene las sugerencias pendientes (para admin).
 */
export async function getPendingSuggestions() {
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
        throw new Error("No autorizado");
    }

    return await prisma.plateSuggestion.findMany({
        where: { status: "PENDING" },
        include: {
            user: { select: { name: true, email: true } },
            version: true
        },
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Prueba de concepto para buscar modelos en el catálogo (usado por el buscador de sugerencias).
 */
export async function searchCatalogModels(query: string) {
    if (!query || query.length < 2) return [];

    return await prisma.vehicleVersion.findMany({
        where: {
            OR: [
                { make: { contains: query, mode: 'insensitive' } },
                { model: { contains: query, mode: 'insensitive' } },
            ]
        },
        take: 10,
        select: {
            id: true,
            make: true,
            model: true,
            generation: true,
            trim: true,
            yearStart: true
        }
    });
}

/**
 * Aprueba una sugerencia, creando el vínculo real en PlateMapping.
 */
export async function approveSuggestion(suggestionId: string, finalVersionId: string, adminNote?: string) {
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
        return { error: "No autorizado" };
    }

    try {
        const suggestion = await prisma.plateSuggestion.findUnique({
            where: { id: suggestionId }
        });

        if (!suggestion) return { error: "Sugerencia no encontrada." };

        // 1. Crear o actualizar el mapping real
        await prisma.plateMapping.upsert({
            where: { plate: suggestion.plate },
            update: {
                versionId: finalVersionId,
                lastUpdated: new Date(),
                verified: true,
                verifiedAt: new Date()
            },
            create: {
                plate: suggestion.plate,
                versionId: finalVersionId,
                verified: true,
                verifiedAt: new Date()
            }
        });

        // 2. Marcar sugerencia como aprobada
        await prisma.plateSuggestion.update({
            where: { id: suggestionId },
            data: {
                status: "APPROVED",
                versionId: finalVersionId,
                adminNote
            }
        });

        await logAudit(user.id, "PLATE_SUGGESTION_APPROVED", {
            plate: suggestion.plate,
            suggestionId: suggestion.id,
            versionId: finalVersionId
        });

        revalidatePath("/admin/suggestions");
        revalidatePath("/admin/mappings");
        return { success: "Sugerencia aprobada y vínculo de matrícula creado/actualizado." };
    } catch (error) {
        console.error("Error approving suggestion:", error);
        return { error: "Ocurrió un error al aprobar la sugerencia." };
    }
}

/**
 * Rechaza una sugerencia.
 */
export async function rejectSuggestion(suggestionId: string, adminNote?: string) {
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== "ADMIN") {
        return { error: "No autorizado" };
    }

    try {
        const suggestion = await prisma.plateSuggestion.update({
            where: { id: suggestionId },
            data: {
                status: "REJECTED",
                adminNote
            }
        });

        await logAudit(user.id, "PLATE_SUGGESTION_REJECTED", {
            plate: suggestion.plate,
            suggestionId: suggestion.id
        });

        revalidatePath("/admin/suggestions");
        return { success: "Sugerencia rechazada." };
    } catch (error) {
        console.error("Error rejecting suggestion:", error);
        return { error: "Ocurrió un error al rechazar la sugerencia." };
    }
}
