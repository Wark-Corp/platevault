const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const nextGenFleet = [
    {
        make: "Tesla",
        models: [
            { name: "Model 3 'Highland'", fuel: "Eléctrico", cv: 283, kw: 208, bat: 60 },
            { name: "Model 3 Performance", fuel: "Eléctrico", cv: 460, kw: 338, bat: 75 },
            { name: "Model Y 'Juniper'", fuel: "Eléctrico", cv: 299, kw: 220, bat: 75 },
            { name: "Model Y Performance", fuel: "Eléctrico", cv: 534, kw: 393, bat: 79 }
        ]
    },
    {
        make: "Renault",
        models: [
            { name: "5 E-Tech Electric", fuel: "Eléctrico", cv: 150, kw: 110, bat: 52 },
            { name: "5 E-Tech Urban", fuel: "Eléctrico", cv: 95, kw: 70, bat: 40 },
            { name: "Austral E-Tech", fuel: "Híbrido", cv: 200, kw: 147, bat: 2 },
            { name: "Rafale", fuel: "Híbrido Enchufable", cv: 300, kw: 221, bat: 22 }
        ]
    },
    {
        make: "BYD",
        models: [
            { name: "Dolphin Update 2025", fuel: "Eléctrico", cv: 204, kw: 150, bat: 60 },
            { name: "Seal U DM-i", fuel: "Híbrido Enchufable", cv: 218, kw: 160, bat: 18 },
            { name: "Atto 3 EVO", fuel: "Eléctrico", cv: 215, kw: 158, bat: 65 },
            { name: "Seal 06 GT", fuel: "Eléctrico", cv: 420, kw: 310, bat: 80 }
        ]
    },
    {
        make: "OMODA",
        models: [
            { name: "5 Turbo", fuel: "Gasolina", cv: 186, kw: 137, bat: 0 },
            { name: "5 Update 2025", fuel: "Gasolina", cv: 145, kw: 107, bat: 0 },
            { name: "5 EV", fuel: "Eléctrico", cv: 204, kw: 150, bat: 61 },
            { name: "7 SHS", fuel: "Híbrido Enchufable", cv: 250, kw: 184, bat: 20 }
        ]
    },
    {
        make: "Dacia",
        models: [
            { name: "Spring 2024", fuel: "Eléctrico", cv: 65, kw: 48, bat: 27 },
            { name: "Bigster", fuel: "Híbrido", cv: 140, kw: 103, bat: 1 },
            { name: "Duster III Hybrid", fuel: "Híbrido", cv: 140, kw: 103, bat: 1 }
        ]
    }
];

async function main() {
    console.log("⚡ Iniciando inyección de la PRÓXIMA GENERACIÓN (2024-2026)...");
    let count = 0;

    for (const brand of nextGenFleet) {
        for (const mod of brand.models) {
            // Años 2024 a 2026
            const years = [2024, 2025, 2026];
            for (const year of years) {
                const data = {
                    make: brand.make,
                    model: mod.name,
                    generation: year === 2026 ? "Facelift / Next-Gen" : "Current Gen",
                    trim: mod.fuel === "Eléctrico" ? `${mod.bat}kWh` : "Standard",
                    yearStart: year,
                    yearEnd: year + 5,
                    fuel: mod.fuel,
                    transmission: mod.fuel === "Gasolina" ? "Manual" : "Automático",
                    specs: {
                        engine: {
                            fuel: mod.fuel,
                            power_cv: mod.cv,
                            power_kw: mod.kw,
                            displacement_cc: mod.fuel === "Gasolina" ? 1598 : 0,
                            architecture: mod.fuel === "Eléctrico" ? "Motor Eléctrico Síncrono" : "L4 Turbo Hybrid",
                            euro_norm: "Euro 6e / Euro 7 Ready",
                        },
                        dimensions: {
                            length: 4.4 + (Math.random() * 0.4),
                            width: 1.8 + (Math.random() * 0.1),
                            height: 1.5 + (Math.random() * 0.1),
                            wheelbase: 2.7 + (Math.random() * 0.1),
                        },
                        weights: {
                            kerb_weight: mod.fuel === "Eléctrico" ? 1800 : 1400,
                            max_weight: 2300,
                        },
                        wheels: {
                            tires: "Neumático Baja Resistencia",
                            rims: "Aleación Aerodinámica"
                        },
                        emissions: {
                            dgt_label: mod.fuel === "Eléctrico" || mod.fuel === "Híbrido Enchufable" ? "0" : "ECO",
                        },
                        pricing: {
                            msrp: "Consultar Tarifas 2024-2026",
                            source: "Lanzamientos Oficiales"
                        }
                    }
                };

                await prisma.vehicleVersion.create({ data: data });
                count++;
            }
        }
    }

    console.log(`✅ ¡FUTURO ASEGURADO! Se han añadido ${count} modelos de nueva generación.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
