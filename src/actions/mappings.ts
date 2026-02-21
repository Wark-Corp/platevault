"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function getPlateMappings(query?: string, page: number = 1, limit: number = 50) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("No autorizado.");
    }

    const skip = (page - 1) * limit;

    // Búsqueda inteligente: matrícula o marca/modelo
    const whereClause: any = query
        ? {
            OR: [
                { plate: { contains: query.toUpperCase().replace(/\s/g, "") } },
                { version: { make: { contains: query } } },
                { version: { model: { contains: query } } },
            ],
        }
        : {};

    const [mappings, total] = await Promise.all([
        prisma.plateMapping.findMany({
            where: whereClause,
            include: {
                version: true,
            },
            orderBy: { lastUpdated: "desc" },
            skip,
            take: limit,
        }),
        prisma.plateMapping.count({ where: whereClause }),
    ]);

    return { mappings, total, totalPages: Math.ceil(total / limit) };
}

export async function unmapPlate(mappingId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    try {
        const mapping = await prisma.plateMapping.delete({
            where: { id: mappingId },
        });

        await logAudit(
            session!.user!.id!,
            "UNMAP_PLATE",
            { mappingId, plate: mapping.plate }
        );

        revalidatePath("/admin/mappings");
        revalidatePath("/admin/catalog");
        return { success: `Matrícula ${mapping.plate} desvinculada.` };
    } catch (error) {
        console.error("Error unmapping plate:", error);
        return { error: "Error al desvincular la matrícula." };
    }
}

export async function updatePlateMapping(mappingId: string, versionId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    try {
        const mapping = await prisma.plateMapping.update({
            where: { id: mappingId },
            data: { versionId, lastUpdated: new Date() },
            include: { version: true }
        });

        await logAudit(
            session!.user!.id!,
            "UPDATE_PLATE_MAPPING",
            { mappingId, plate: mapping.plate, newVersionId: versionId }
        );

        revalidatePath("/admin/mappings");
        revalidatePath("/admin/catalog");
        return { success: `Matrícula ${mapping.plate} reasignada a ${mapping.version.make} ${mapping.version.model}.` };
    } catch (error) {
        console.error("Error updating plate mapping:", error);
        return { error: "Error al actualizar la vinculación." };
    }
}
