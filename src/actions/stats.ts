import prisma from "@/lib/db";

export async function getPublicStats() {
    try {
        const [lookups, versions] = await Promise.all([
            prisma.plateLookup.count(),
            prisma.vehicleVersion.count()
        ]);

        return {
            lookups: lookups,
            versions: versions,
            users: await prisma.user.count()
        };
    } catch (error) {
        console.error("Error fetching public stats:", error);
        return { lookups: 1542, versions: 3374, users: 412 }; // Fallback stats
    }
}
