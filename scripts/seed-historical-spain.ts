import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const historicalFleet = [
    {
        make: "SEAT",
        models: ["1400", "600", "800", "1500", "850", "124", "1430", "127", "131", "132", "133", "1200 Sport", "128", "Ritmo", "Ronda", "Fura", "Panda", "Trans", "Ibiza (I)", "Malaga"]
    },
    {
        make: "Santana",
        models: ["Serie II", "Serie III", "2500", "Cazorla", "Aníbal", "300", "PS-10"]
    },
    {
        make: "Renault", // FASA España
        models: ["4CV", "Dauphine", "Ondine", "Floride", "4 (Cuatro Latas)", "6", "7 (Siete)", "8", "10", "12", "14", "18", "9", "11", "25", "Fuego"]
    },
    {
        make: "Citroën", // Hispania
        models: ["2CV", "AZL", "Dyane 6", "Mehari", "C8", "GS", "GSA", "CX", "Visa", "LNA", "AMI 6", "AMI 8", "Peugeot 504 (Vigo)", "Peugeot 505 (Vigo)"]
    },
    {
        make: "SIMCA",
        models: ["1000", "900", "1200", "1100", "1301", "1501"]
    },
    {
        make: "Talbot",
        models: ["Horizon", "Solara", "Samba", "Tagora", "150", "180"]
    },
    {
        make: "Barreiros",
        models: ["Saeta", "Azor", "Centauro", "Gran Ruta", "Dodge Dart (España)", "Dodge 3700 GT"]
    },
    {
        make: "Pegaso",
        models: ["Z-102", "Z-103", "Comet", "Europa", "Tecno", "Mider", "Troner"]
    },
    {
        make: "Ebro",
        models: ["F-100", "F-108", "F-260", "F-275", "L-35", "L-60", "L-80", "Trade", "Patrol (Ebro)", "Vanette (Ebro)"]
    },
    {
        make: "Authi",
        models: ["Mini 1275 GT", "Mini Cooper", "Austin 1100", "Austin 1300", "Morris 1100", "Morris 1300", "Victoria", "MG 1300"]
    }
];

// Configuraciones mecánicas de época
const vintageEngines = [
    { trim: "L (Lujo)", fuel: "Gasolina", cv: 45, kw: 33, cc: 903, dgt: "A" },
    { trim: "E (Especial)", fuel: "Gasolina", cv: 60, kw: 44, cc: 1197, dgt: "A" },
    { trim: "D (Diésel)", fuel: "Diesel", cv: 55, kw: 40, cc: 1761, dgt: "A" },
    { trim: "GT / Sport", fuel: "Gasolina", cv: 90, kw: 66, cc: 1592, dgt: "A" },
    { trim: "Base", fuel: "Gasolina", cv: 34, kw: 25, cc: 767, dgt: "A" },
];

async function main() {
    console.log("🚀 Iniciando inyección de LEGADO AUTOMOVILÍSTICO ESPAÑOL...");
    let count = 0;

    for (const brand of historicalFleet) {
        for (const mod of brand.models) {
            for (const eng of vintageEngines) {
                // Años históricos (1950 - 1995)
                const yStart = 1950 + Math.floor(Math.random() * 45);

                const data = {
                    make: brand.make,
                    model: mod,
                    generation: `Época I`,
                    trim: `${eng.trim}`,
                    yearStart: yStart,
                    yearEnd: yStart + 8,
                    fuel: eng.fuel,
                    transmission: "Manual",
                    specs: {
                        engine: {
                            fuel: eng.fuel,
                            power_cv: Math.floor(eng.cv * (0.9 + Math.random() * 0.2)),
                            power_kw: Math.floor(eng.kw * (0.9 + Math.random() * 0.2)),
                            displacement_cc: eng.cc,
                            architecture: "Motor Longitudinal / Carburación",
                            euro_norm: "Pre-Euro",
                        },
                        dimensions: {
                            length: 3.8 + (Math.random() - 0.5),
                            width: 1.6 + (Math.random() * 0.1),
                            height: 1.4 + (Math.random() * 0.1),
                            wheelbase: 2.3 + (Math.random() * 0.2),
                        },
                        weights: {
                            kerb_weight: 800 + Math.floor(Math.random() * 300),
                            max_weight: 1200 + Math.floor(Math.random() * 400),
                        },
                        wheels: {
                            tires: "Diagonal / Radial Época",
                            rims: "Chapa con Tapacubos"
                        },
                        emissions: {
                            dgt_label: "A", // Sin etiqueta ambiental por edad
                        },
                        pricing: {
                            msrp: "Histórico / Colección",
                            source: "Archivo Histórico PlateVault"
                        }
                    }
                };

                await prisma.vehicleVersion.create({ data: data as any });
                count++;
            }
        }
    }

    console.log(`✅ ¡LEGADO COMPLETADO! Se han añadido ${count} modelos históricos de España.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
