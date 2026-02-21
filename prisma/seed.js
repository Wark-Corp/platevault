require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seed: Creando catálogo técnico de prueba...');

    const version1 = await prisma.vehicleVersion.create({
        data: {
            make: 'SEAT',
            model: 'León',
            generation: 'IV (KL)',
            trim: 'FR 1.5 eTSI',
            yearStart: 2020,
            fuel: 'Gasolina / MHEV',
            transmission: 'Automática DSG',
            specs: {
                make: "SEAT",
                model: "León",
                generation: "IV (KL)",
                trim: "FR 1.5 eTSI",
                year: "2020",
                engine: {
                    fuel: "Gasolina / Híbrido ligero",
                    power_kw: 110,
                    power_cv: 150,
                    displacement_cc: 1498,
                    architecture: "4 cilindros en línea",
                    turbo: true,
                    euro_norm: "6d",
                    par_nm: 250
                },
                dimensions: {
                    length: 4.368,
                    width: 1.800,
                    height: 1.456,
                    wheelbase: 2.686
                },
                weights: {
                    kerb_weight: 1361,
                    max_weight: 1880
                },
                wheels: {
                    tires: "225/40 R18",
                    rims: "Aleación 18\" Performance"
                },
                emissions: {
                    dgt_label: "ECO"
                },
                pricing: {
                    msrp: "28.500 €",
                    source: "MSRP Oficial España 2020"
                }
            }
        }
    });

    await prisma.plateMapping.upsert({
        where: { plate: '1234XYZ' },
        update: { versionId: version1.id },
        create: {
            plate: '1234XYZ',
            versionId: version1.id,
            confidence: 1.0
        }
    });

    console.log('✅ Seed completado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
