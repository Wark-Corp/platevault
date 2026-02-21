import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const baseVehicles = [
    { make: "SEAT", model: "Ibiza", gen: "V", l: 4.06, w: 1.78, h: 1.44, wb: 2.56, baseKg: 1100, msrpBase: 17000 },
    { make: "SEAT", model: "Arona", gen: "1", l: 4.14, w: 1.78, h: 1.55, wb: 2.56, baseKg: 1190, msrpBase: 19500 },
    { make: "SEAT", model: "Ateca", gen: "1", l: 4.38, w: 1.84, h: 1.61, wb: 2.63, baseKg: 1350, msrpBase: 25000 },
    { make: "SEAT", model: "Tarraco", gen: "1", l: 4.73, w: 1.83, h: 1.67, wb: 2.79, baseKg: 1600, msrpBase: 34000 },
    { make: "Volkswagen", model: "Polo", gen: "VI", l: 4.07, w: 1.75, h: 1.45, wb: 2.55, baseKg: 1150, msrpBase: 19000 },
    { make: "Volkswagen", model: "T-Roc", gen: "1", l: 4.23, w: 1.81, h: 1.58, wb: 2.59, baseKg: 1300, msrpBase: 24000 },
    { make: "Volkswagen", model: "Tiguan", gen: "III", l: 4.54, w: 1.84, h: 1.66, wb: 2.68, baseKg: 1550, msrpBase: 33000 },
    { make: "Volkswagen", model: "Taigo", gen: "1", l: 4.26, w: 1.75, h: 1.51, wb: 2.56, baseKg: 1220, msrpBase: 22000 },
    { make: "Peugeot", model: "308", gen: "III", l: 4.36, w: 1.85, h: 1.44, wb: 2.67, baseKg: 1330, msrpBase: 25000 },
    { make: "Peugeot", model: "2008", gen: "II", l: 4.30, w: 1.77, h: 1.55, wb: 2.60, baseKg: 1250, msrpBase: 23000 },
    { make: "Peugeot", model: "3008", gen: "III", l: 4.54, w: 1.89, h: 1.64, wb: 2.73, baseKg: 1500, msrpBase: 35000 },
    { make: "Renault", model: "Captur", gen: "II", l: 4.22, w: 1.79, h: 1.57, wb: 2.63, baseKg: 1260, msrpBase: 21000 },
    { make: "Renault", model: "Megane", gen: "IV", l: 4.35, w: 1.81, h: 1.44, wb: 2.66, baseKg: 1300, msrpBase: 24000 },
    { make: "Renault", model: "Austral", gen: "1", l: 4.51, w: 1.83, h: 1.62, wb: 2.66, baseKg: 1450, msrpBase: 31000 },
    { make: "Renault", model: "Arkana", gen: "1", l: 4.56, w: 1.82, h: 1.57, wb: 2.72, baseKg: 1400, msrpBase: 29000 },
    { make: "Dacia", model: "Duster", gen: "III", l: 4.34, w: 1.81, h: 1.66, wb: 2.65, baseKg: 1300, msrpBase: 19000 },
    { make: "Dacia", model: "Jogger", gen: "1", l: 4.54, w: 1.78, h: 1.63, wb: 2.89, baseKg: 1250, msrpBase: 18000 },
    { make: "Toyota", model: "Yaris", gen: "XP210", l: 3.94, w: 1.74, h: 1.50, wb: 2.56, baseKg: 1080, msrpBase: 20000 },
    { make: "Toyota", model: "Yaris Cross", gen: "1", l: 4.18, w: 1.76, h: 1.59, wb: 2.56, baseKg: 1200, msrpBase: 24000 },
    { make: "Toyota", model: "C-HR", gen: "2", l: 4.36, w: 1.83, h: 1.56, wb: 2.64, baseKg: 1400, msrpBase: 30000 },
    { make: "Toyota", model: "RAV4", gen: "XA50", l: 4.60, w: 1.85, h: 1.68, wb: 2.69, baseKg: 1650, msrpBase: 38000 },
    { make: "Kia", model: "Ceed", gen: "CD", l: 4.31, w: 1.80, h: 1.44, wb: 2.65, baseKg: 1300, msrpBase: 21000 },
    { make: "Kia", model: "Stonic", gen: "1", l: 4.14, w: 1.76, h: 1.52, wb: 2.58, baseKg: 1150, msrpBase: 19000 },
    { make: "Kia", model: "Niro", gen: "SG2", l: 4.42, w: 1.82, h: 1.54, wb: 2.72, baseKg: 1490, msrpBase: 28000 },
    { make: "Hyundai", model: "i20", gen: "BC3", l: 4.04, w: 1.77, h: 1.45, wb: 2.58, baseKg: 1100, msrpBase: 18000 },
    { make: "Hyundai", model: "Kona", gen: "SX2", l: 4.35, w: 1.82, h: 1.58, wb: 2.66, baseKg: 1350, msrpBase: 26000 },
    { make: "Nissan", model: "Qashqai", gen: "J12", l: 4.42, w: 1.83, h: 1.62, wb: 2.66, baseKg: 1450, msrpBase: 29000 },
    { make: "Nissan", model: "Juke", gen: "F16", l: 4.21, w: 1.80, h: 1.59, wb: 2.63, baseKg: 1250, msrpBase: 23000 },
    { make: "Ford", model: "Puma", gen: "1", l: 4.20, w: 1.80, h: 1.53, wb: 2.58, baseKg: 1280, msrpBase: 24000 },
    { make: "Ford", model: "Kuga", gen: "III", l: 4.61, w: 1.88, h: 1.67, wb: 2.71, baseKg: 1550, msrpBase: 32000 },
    { make: "Ford", model: "Focus", gen: "IV", l: 4.37, w: 1.82, h: 1.45, wb: 2.70, baseKg: 1350, msrpBase: 26000 },
    { make: "Opel", model: "Corsa", gen: "F", l: 4.06, w: 1.76, h: 1.43, wb: 2.53, baseKg: 1100, msrpBase: 18000 },
    { make: "Opel", model: "Astra", gen: "L", l: 4.37, w: 1.86, h: 1.44, wb: 2.67, baseKg: 1350, msrpBase: 25000 },
    { make: "Opel", model: "Mokka", gen: "B", l: 4.15, w: 1.79, h: 1.53, wb: 2.55, baseKg: 1200, msrpBase: 23000 },
    { make: "Skoda", model: "Fabia", gen: "IV", l: 4.10, w: 1.78, h: 1.45, wb: 2.56, baseKg: 1150, msrpBase: 18000 },
    { make: "Skoda", model: "Kamiq", gen: "1", l: 4.24, w: 1.79, h: 1.55, wb: 2.65, baseKg: 1250, msrpBase: 22000 },
    { make: "Skoda", model: "Octavia", gen: "IV", l: 4.68, w: 1.82, h: 1.47, wb: 2.68, baseKg: 1400, msrpBase: 28000 },
    { make: "Audi", model: "A3", gen: "8Y", l: 4.34, w: 1.81, h: 1.44, wb: 2.63, baseKg: 1350, msrpBase: 32000 },
    { make: "Audi", model: "Q3", gen: "F3", l: 4.48, w: 1.85, h: 1.61, wb: 2.68, baseKg: 1600, msrpBase: 42000 },
    { make: "BMW", model: "Serie 1", gen: "F40", l: 4.31, w: 1.79, h: 1.43, wb: 2.67, baseKg: 1380, msrpBase: 33000 },
    { make: "BMW", model: "X1", gen: "U11", l: 4.50, w: 1.84, h: 1.64, wb: 2.69, baseKg: 1600, msrpBase: 44000 },
    { make: "Mercedes-Benz", model: "Clase A", gen: "W177", l: 4.41, w: 1.79, h: 1.44, wb: 2.72, baseKg: 1400, msrpBase: 35000 },
    { make: "Mercedes-Benz", model: "GLA", gen: "H247", l: 4.41, w: 1.83, h: 1.61, wb: 2.72, baseKg: 1550, msrpBase: 43000 }
];

const variants = [
    { name: "Base", suffix: "1.0 TSI / PureTech Reference", fuel: "Gasolina", cv: 95, dgt: "C", kw: 70, cc: 999, arch: "L3 Turbo", plusKg: 0, plusEur: 0 },
    { name: "Mid", suffix: "1.2 / 1.5 MHEV Style", fuel: "Mild-Hybrid", cv: 130, dgt: "ECO", kw: 96, cc: 1498, arch: "L4 MHEV", plusKg: 80, plusEur: 3500 },
    { name: "Diesel", suffix: "2.0 TDI / BlueHDi Active", fuel: "Diesel", cv: 115, dgt: "C", kw: 85, cc: 1968, arch: "L4 Turbo", plusKg: 110, plusEur: 2800 },
    { name: "PHEV", suffix: "e-Hybrid / PHEV Excellence", fuel: "Híbrido Enchufable", cv: 204, dgt: "0", kw: 150, cc: 1395, arch: "L4 + Motor Eléctrico", plusKg: 300, plusEur: 9000 },
    { name: "Sport", suffix: "2.0 TSI / R-Line GT", fuel: "Gasolina", cv: 190, dgt: "C", kw: 140, cc: 1984, arch: "L4 Turbo", plusKg: 140, plusEur: 7000 },
];

async function main() {
    let count = 0;
    console.log("Iniciando generación de más de 200 vehículos...");

    for (const base of baseVehicles) {
        for (const variant of variants) {

            // Adjust to Toyota specific hybrids
            let finalTrim = variant.suffix;
            let finalFuel = variant.fuel;
            let finalDgt = variant.dgt;
            if (base.make === "Toyota" && variant.name === "Base") {
                finalTrim = "1.5 VVT-i Active";
                finalFuel = "Gasolina";
            }
            if (base.make === "Toyota" && variant.name === "Mid") {
                finalTrim = "1.8 Hybrid Advance";
                finalFuel = "Híbrido";
                finalDgt = "ECO";
            }

            const data = {
                make: base.make,
                model: base.model,
                generation: base.gen,
                trim: finalTrim,
                yearStart: 2020 + Math.floor(Math.random() * 4),
                yearEnd: null,
                fuel: finalFuel,
                transmission: variant.name === "Base" ? "Manual 6 vel." : "Automática DSG/EAT",
                specs: {
                    engine: {
                        fuel: finalFuel,
                        power_cv: variant.cv,
                        power_kw: variant.kw,
                        displacement_cc: variant.cc,
                        architecture: variant.arch,
                        euro_norm: "Euro 6d",
                    },
                    dimensions: {
                        length: base.l,
                        width: base.w,
                        height: base.h,
                        wheelbase: base.wb,
                    },
                    weights: {
                        kerb_weight: base.baseKg + variant.plusKg,
                        max_weight: base.baseKg + variant.plusKg + 500,
                    },
                    wheels: {
                        tires: variant.name === "Sport" ? "235/40 R18" : (variant.name === "Base" ? "195/65 R15" : "215/55 R17"),
                        rims: variant.name === "Sport" ? "Aleación 18''" : "Aleación 16/17''",
                    },
                    emissions: {
                        dgt_label: finalDgt,
                    },
                    pricing: {
                        msrp: `${(base.msrpBase + variant.plusEur).toLocaleString("es-ES")} €`,
                        source: "Base de Datos Automática"
                    }
                }
            };

            await prisma.vehicleVersion.create({ data: data as any });
            count++;
        }
    }

    console.log(`¡Proceso completado! Se han insertado ${count} vehículos en la Base de Datos.`);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
