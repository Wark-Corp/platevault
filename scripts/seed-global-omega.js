const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const megaFleet = [
    {
        make: "Volkswagen",
        models: ["Golf GTI", "Golf R", "Golf Variant", "Golf Alltrack", "ID.3", "ID.4 GTX", "ID.5", "ID.7", "Touareg R", "Passat GTE"]
    },
    {
        make: "BMW",
        models: ["M1", "M2", "M3 Competition", "M4 CSL", "M5 CS", "M8", "i4 M50", "iX M60", "XM", "Z8"]
    },
    {
        make: "Mercedes-AMG",
        models: ["A45 S", "C63 E Performance", "E63 S", "S63 E", "SL 63", "GT Black Series", "G63 4x4²", "ONE"]
    },
    {
        make: "Audi Sport",
        models: ["RS3 Sportback", "RS4 Avant", "RS5 Coupe", "RS6 Avant Performance", "RS7 Sportback", "RS Q8", "e-tron GT RS", "R8 V10 Decennium"]
    },
    {
        make: "Ferrari",
        models: ["250 GTO", "F40", "F50", "Enzo", "LaFerrari", "SF90 Stradale", "296 GTB", "Purosangue", "812 Competizione", "Roma", "Portofino M"]
    },
    {
        make: "Lamborghini",
        models: ["Miura", "Countach", "Diablo", "Murciélago SV", "Aventador SVJ", "Huracán STO", "Urus Performante", "Revuelto", "Sian"]
    },
    {
        make: "Porsche",
        models: ["911 GT3 RS", "911 Turbo S", "911 Dakar", "Taycan Turbo S Cross Turismo", "Cayenne Turbo GT", "718 Cayman GT4 RS", "918 Spyder", "Carrera GT"]
    },
    {
        make: "Chevrolet", // USA
        models: ["Corvette Z06", "Corvette E-Ray", "Camaro ZL1", "Silverado EV", "Tahoe RST", "Blazer EV", "Equinox EV", "Suburban"]
    },
    {
        make: "Ford (Global)", // USA / Global
        models: ["Mustang Dark Horse", "F-150 Lightning", "Explorer ST", "Bronco Raptor", "Mach-E GT", "GT (2017)", "GT40"]
    },
    {
        make: "Dodge", // USA
        models: ["Challenger Hellcat Redeye", "Charger SRT Daytona", "Durango Hellcat", "Hornet R/T"]
    },
    {
        make: "BYD (Global)", // China
        models: ["Han EV", "Tang EV", "Seal Performance", "Song Plus", "Qin Plus DM-i", "Yangwang U8", "Yangwang U9"]
    },
    {
        make: "NIO", // China
        models: ["EP9", "ET5 Touring", "ET7", "ES8 Signature", "EC7"]
    },
    {
        make: "XPENG",
        models: ["P7 Wing Edition", "G9 Performance", "G6"]
    },
    {
        make: "Xiaomi",
        models: ["SU7 Max", "SU7 Pro"]
    },
    {
        make: "Rimac", // Hypercars
        models: ["Concept_One", "Nevera Time Attack"]
    },
    {
        make: "Koenigsegg",
        models: ["Agera RS", "Regera", "Jesko Absolut", "Gemera", "CC850"]
    },
    {
        make: "Aston Martin", // UK
        models: ["Valkyrie", "Valhalla", "DBS 770 Ultimate", "DBX 707", "Vantage F1 Edition", "DB12", "One-77"]
    },
    {
        make: "Bentley",
        models: ["Continental GT Speed", "Bentayga Azure", "Flying Spur Mulliner", "Batur", "Bacalar"]
    },
    {
        make: "Rolls-Royce",
        models: ["Phantom Series II", "Ghost Black Badge", "Cullinan", "Spectre", "Boat Tail"]
    },
    {
        make: "McLaren",
        models: ["F1", "P1 GTR", "Senna", "Speedtail", "Elva", "750S", "Artura", "Solus GT"]
    },
    {
        make: "Lucid", // USA EV
        models: ["Air Sapphire", "Air Grand Touring", "Gravity"]
    },
    {
        make: "Rivian", // USA EV
        models: ["R1T Quad-Motor", "R1S Adventure", "R2", "R3X"]
    },
    {
        make: "Santana (Extras)",
        models: ["Aníbal Militar", "2500 Corto", "Ligero"]
    }
];

const exoticEngines = [
    { trim: "V12 Performance", fuel: "Gasolina", cv: 800, kw: 588, dgt: "C" },
    { trim: "Quad-Motor EV", fuel: "Eléctrico", cv: 1020, kw: 750, dgt: "0" },
    { trim: "PHEV High-Spec", fuel: "Híbrido Enchufable", cv: 680, kw: 500, dgt: "0" },
    { trim: "Twin-Turbo V8", fuel: "Gasolina", cv: 600, kw: 441, dgt: "C" },
    { trim: "Ultra Long Range EV", fuel: "Eléctrico", cv: 300, kw: 220, dgt: "0" }
];

async function main() {
    console.log("🌍 INICIANDO OPERACIÓN PLATEVAULT MUNDIAL (Global Coverage Expansion)...");
    let count = 0;

    for (const brand of megaFleet) {
        for (const mod of brand.models) {
            for (const eng of exoticEngines) {
                const isModern = Math.random() > 0.3;
                const yStart = isModern ? 2020 + Math.floor(Math.random() * 5) : 1960 + Math.floor(Math.random() * 40);

                const data = {
                    make: brand.make,
                    model: mod,
                    generation: isModern ? "Current / Flagship" : "Iconic Heritage",
                    trim: eng.trim,
                    yearStart: yStart,
                    yearEnd: yStart + 4,
                    fuel: eng.fuel,
                    transmission: eng.fuel === "Eléctrico" ? "Automático" : "Secuencial/Auto",
                    specs: {
                        engine: {
                            fuel: eng.fuel,
                            power_cv: Math.floor(eng.cv * (0.9 + Math.random() * 0.2)),
                            power_kw: Math.floor(eng.kw * (0.9 + Math.random() * 0.2)),
                            displacement_cc: eng.fuel === "Gasolina" ? 3996 : 0,
                            architecture: eng.fuel === "Eléctrico" ? "Multi-Motor EV" : "V-Architecture High Output",
                            euro_norm: isModern ? "Euro 6d / zero" : "N/A",
                        },
                        dimensions: {
                            length: 4.5 + (Math.random() - 0.5),
                            width: 1.9 + (Math.random() * 0.1),
                            height: 1.3 + (Math.random() * 0.2),
                            wheelbase: 2.7 + (Math.random() * 0.2),
                        },
                        weights: {
                            kerb_weight: eng.fuel === "Eléctrico" ? 2100 : 1600,
                            max_weight: 2500,
                        },
                        wheels: {
                            tires: "High Performance Michelin/Pirelli",
                            rims: "Forged Alloy"
                        },
                        emissions: {
                            dgt_label: eng.dgt,
                        },
                        pricing: {
                            msrp: isModern ? "Exotic Pricing Premium" : "High Collector Value",
                            source: "PlateVault Universal Knowledge"
                        }
                    }
                };

                await prisma.vehicleVersion.create({ data: data });
                count++;
            }
        }
    }

    console.log(`✅ ¡MISIÓN CUMPLIDA! Se han inyectado ${count} nuevas variantes de élite y globales.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
