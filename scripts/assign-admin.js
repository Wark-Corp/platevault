const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = "admin@platevault.es";
    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: "ADMIN" }
        });
        console.log(`✅ EXITO: El usuario ${email} ahora tiene el rol ADMIN.`);
        console.log("Detalles del usuario:", { id: user.id, email: user.email, role: user.role });
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`❌ ERROR: No se encontró ningún usuario con el email ${email}.`);
            console.log("Asegúrate de que el usuario ya se haya registrado en la web.");
        } else {
            console.error("❌ ERROR inesperado:", error);
        }
    }
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
