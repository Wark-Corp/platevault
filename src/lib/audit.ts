import prisma from "@/lib/db";
import { headers } from "next/headers";
import { getClientIp } from "./network";

export async function logAudit(userId: string | null, action: string, details: any = {}) {
    const ip = await getClientIp();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                ip,
                userAgent,
                details,
            },
        });
    } catch (error) {
        console.error("Error logging audit:", error);
    }
}

export async function logPlateLookup(userId: string | null, plate: string, requestId: string, responseHash?: string) {
    const ip = await getClientIp();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    try {
        await prisma.plateLookup.create({
            data: {
                userId,
                plate,
                ip,
                userAgent,
                requestId,
                responseHash,
            },
        });
    } catch (error) {
        console.error("Error logging lookup:", error);
    }
}
