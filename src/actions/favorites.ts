"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Alterna el estado de favorito para una versión de vehículo (y opcionalmente matrícula).
 */
export async function toggleFavorite(vehicleVersionId: string, plate?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado." };

    try {
        const userId = session.user.id;
        const normalizedPlate = plate ? plate.toUpperCase().replace(/[^A-Z0-9]/g, "") : null;

        // Comprobar si ya existe
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_vehicleVersionId_plate: {
                    userId,
                    vehicleVersionId,
                    plate: normalizedPlate || "", // Prisma handle unique with optional as part of key
                }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            revalidatePath("/dashboard");
            return { success: "Eliminado de favoritos.", action: "removed" };
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    vehicleVersionId,
                    plate: normalizedPlate || "",
                }
            });
            revalidatePath("/dashboard");
            return { success: "Añadido a favoritos.", action: "added" };
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { error: "Error al gestionar el favorito." };
    }
}

/**
 * Obtiene los favoritos del usuario actual.
 */
export async function getFavorites() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.favorite.findMany({
        where: { userId: session.user.id },
        include: {
            version: true
        },
        orderBy: { createdAt: "desc" }
    });
}

/**
 * Comprueba si una versión/matrícula es favorita.
 */
export async function isFavorite(vehicleVersionId: string, plate?: string) {
    const session = await auth();
    if (!session?.user?.id) return false;

    const normalizedPlate = plate ? plate.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";

    const fav = await prisma.favorite.findUnique({
        where: {
            userId_vehicleVersionId_plate: {
                userId: session.user.id,
                vehicleVersionId,
                plate: normalizedPlate,
            }
        }
    });

    return !!fav;
}

/**
 * Obtiene múltiples versiones de vehículos por sus IDs.
 */
export async function getVersionsByIds(ids: string[]) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.vehicleVersion.findMany({
        where: { id: { in: ids } }
    });
}

