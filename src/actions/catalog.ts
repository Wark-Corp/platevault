"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createVehicleVersion(data: any) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    try {
        const version = await prisma.vehicleVersion.create({
            data: {
                make: data.make,
                model: data.model,
                generation: data.generation,
                trim: data.trim,
                yearStart: parseInt(data.yearStart) || null,
                yearEnd: parseInt(data.yearEnd) || null,
                fuel: data.fuel,
                transmission: data.transmission,
                specs: data.specs, // JSON field
            },
        });

        await logAudit(
            session!.user!.id!,
            "CREATE_VEHICLE_VERSION",
            { versionId: version.id, make: version.make, model: version.model }
        );

        revalidatePath("/admin/catalog");
        return { success: "Versión de vehículo creada.", id: version.id };
    } catch (error) {
        console.error("Error creating vehicle version:", error);
        return { error: "Error al crear la versión del vehículo." };
    }
}

export async function mapPlateToVersion(plate: string, versionId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    const normalizedPlate = plate.toUpperCase().replace(/\s/g, "");

    try {
        const mapping = await prisma.plateMapping.upsert({
            where: { plate: normalizedPlate },
            update: { versionId },
            create: {
                plate: normalizedPlate,
                versionId,
            },
        });

        await logAudit(
            session!.user!.id!,
            "MAP_PLATE",
            { plate: normalizedPlate, versionId }
        );

        revalidatePath("/admin/catalog");
        return { success: `Matrícula ${normalizedPlate} mapeada con éxito.` };
    } catch (error) {
        console.error("Error mapping plate:", error);
        return { error: "Error al mapear la matrícula." };
    }
}

export async function getVehicleVersions(query?: string, page: number = 1, limit: number = 100) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        throw new Error("No autorizado.");
    }

    const skip = (page - 1) * limit;

    const whereClause: any = query
        ? {
            OR: [
                { make: { contains: query } },
                { model: { contains: query } },
            ],
        }
        : {};

    const [versions, total] = await Promise.all([
        prisma.vehicleVersion.findMany({
            where: whereClause,
            orderBy: { updatedAt: "desc" },
            skip,
            take: limit,
            include: {
                _count: {
                    select: { mappings: true },
                },
            },
        }),
        prisma.vehicleVersion.count({ where: whereClause })
    ]);

    return { versions, total, totalPages: Math.ceil(total / limit) };
}

export async function deleteVehicleVersion(versionId: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    try {
        // Eliminar también mappings vinculados
        await prisma.plateMapping.deleteMany({
            where: { versionId }
        });

        await prisma.vehicleVersion.delete({
            where: { id: versionId }
        });

        await logAudit(
            session!.user!.id!,
            "DELETE_VEHICLE_VERSION",
            { versionId }
        );

        revalidatePath("/admin/catalog");
        return { success: "Vehículo y matrículas vinculadas eliminados." };
    } catch (error) {
        console.error("Error deleting vehicle version:", error);
        return { error: "Error al eliminar el vehículo." };
    }
}

export async function updateVehicleVersion(versionId: string, data: any) {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "No autorizado." };
    }

    try {
        await prisma.vehicleVersion.update({
            where: { id: versionId },
            data: {
                make: data.make,
                model: data.model,
                generation: data.generation,
                trim: data.trim,
                yearStart: data.yearStart ? parseInt(data.yearStart) : null,
                yearEnd: data.yearEnd ? parseInt(data.yearEnd) : null,
                fuel: data.fuel,
                transmission: data.transmission,
                specs: data.specs, // JSON field
            },
        });

        await logAudit(
            session!.user!.id!,
            "UPDATE_VEHICLE_VERSION",
            { versionId, make: data.make, model: data.model }
        );

        revalidatePath("/admin/catalog");
        return { success: "Versión de vehículo actualizada." };
    } catch (error) {
        console.error("Error updating vehicle version:", error);
        return { error: "Error al actualizar la versión del vehículo." };
    }
}
