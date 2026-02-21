const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.vehicleVersion.count();
    console.log("TOTAL_VERSIONS:", count);
}
main().finally(() => prisma.$disconnect());
