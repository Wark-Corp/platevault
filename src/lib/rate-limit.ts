import prisma from "@/lib/db";
import { headers } from "next/headers";
import { getClientIp } from "./network";

export interface RateLimitConfig {
    limit: number;      // Número máximo de peticiones
    windowMs: number;   // Ventana de tiempo en milisegundos
}

const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
    SEARCH: { limit: 15, windowMs: 24 * 60 * 60 * 1000 }, // 15 búsquedas por 24 horas
    AUTH: { limit: 5, windowMs: 5 * 60 * 1000 },          // 5 intentos de login en 5 minutos
};

export async function checkRateLimit(key: string, type: "SEARCH" | "AUTH", userId?: string | null, userRole?: string) {
    // Los roles con privilegios NO tienen límites de búsqueda
    if (type === "SEARCH" && (userRole === "PREMIUM" || userRole === "SUPPORT" || userRole === "ADMIN")) {
        return { allowed: true, remaining: 9999, reset: null };
    }

    const ip = await getClientIp();
    const identifier = userId ? `user:${userId}` : `ip:${ip}`;
    const config = DEFAULT_LIMITS[type];
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    let count = 0;
    let oldestInWindow: Date | null = null;

    if (type === "SEARCH") {
        // Obtenemos el conteo y la más antigua para calcular el reset
        const searches = await prisma.plateLookup.findMany({
            where: {
                OR: [
                    { userId: userId || undefined },
                    { ip: ip }
                ],
                timestamp: { gte: windowStart }
            },
            orderBy: { timestamp: 'asc' },
            select: { timestamp: true }
        });

        count = searches.length;
        if (count > 0) {
            oldestInWindow = searches[0].timestamp;
        }
    } else {
        count = await prisma.auditLog.count({
            where: {
                OR: [
                    { userId: userId || undefined },
                    { ip: ip }
                ],
                action: type,
                timestamp: { gte: windowStart }
            }
        });
    }

    if (count >= config.limit) {
        // El próximo reset será 24h después de la búsqueda más antigua detectada en la ventana
        const resetDate = oldestInWindow
            ? new Date(oldestInWindow.getTime() + config.windowMs)
            : new Date(now.getTime() + config.windowMs);

        return {
            allowed: false,
            remaining: 0,
            reset: resetDate
        };
    }

    return {
        allowed: true,
        remaining: config.limit - count,
        reset: null
    };
}
