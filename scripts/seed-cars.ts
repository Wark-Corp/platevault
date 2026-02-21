import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cars = [
    // SEAT León
    {
        make: 'SEAT',
        model: 'León',
        generation: 'MK4',
        trim: '1.5 eTSI FR',
        yearStart: 2020,
        yearEnd: null,
        fuel: 'Gasolina',
        transmission: 'Automática DSG 7',
        specs: {
            engine: {
                fuel: "Gasolina",
                power_kw: 110,
                power_cv: 150,
                displacement_cc: 1498,
                architecture: "L4 Mild-Hybrid",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.36,
                width: 1.80,
                height: 1.45,
                wheelbase: 2.68
            },
            weights: {
                kerb_weight: 1330,
                max_weight: 1890
            },
            wheels: {
                tires: "225/45 R17",
                rims: "Aleación 17''"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "29.500 €",
                source: "Configurador Oficial"
            }
        }
    },
    // Toyota Corolla
    {
        make: 'Toyota',
        model: 'Corolla',
        generation: 'E210',
        trim: '1.8H Active Plus',
        yearStart: 2019,
        yearEnd: null,
        fuel: 'Híbrido',
        transmission: 'e-CVT',
        specs: {
            engine: {
                fuel: "Híbrido no enchufable",
                power_kw: 90,
                power_cv: 122,
                displacement_cc: 1798,
                architecture: "L4",
                euro_norm: "Euro 6d-TEMP",
            },
            dimensions: {
                length: 4.37,
                width: 1.79,
                height: 1.43,
                wheelbase: 2.64
            },
            weights: {
                kerb_weight: 1360,
                max_weight: 1820
            },
            wheels: {
                tires: "205/55 R16",
                rims: "Aleación 16''"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "26.000 €",
                source: "km77"
            }
        }
    },
    // Dacia Sandero Stepway
    {
        make: 'Dacia',
        model: 'Sandero',
        generation: 'III',
        trim: '1.0 TCe ECO-G Essential',
        yearStart: 2021,
        yearEnd: null,
        fuel: 'GLP',
        transmission: 'Manual 6 vel',
        specs: {
            engine: {
                fuel: "Gasolina/GLP",
                power_kw: 74,
                power_cv: 100,
                displacement_cc: 999,
                architecture: "L3",
                euro_norm: "Euro 6d-Full",
            },
            dimensions: {
                length: 4.09,
                width: 1.84,
                height: 1.58,
                wheelbase: 2.60
            },
            weights: {
                kerb_weight: 1154,
                max_weight: 1562
            },
            wheels: {
                tires: "205/60 R16",
                rims: "Acero 16'' (Tapacubos)"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "14.720 €",
                source: "Web Dacia"
            }
        }
    },
    // Tesla Model 3
    {
        make: 'Tesla',
        model: 'Model 3',
        generation: 'Highland',
        trim: 'Long Range Dual Motor',
        yearStart: 2023,
        yearEnd: null,
        fuel: 'Eléctrico',
        transmission: 'Automática 1 vel',
        specs: {
            engine: {
                fuel: "Eléctrico",
                power_kw: 366,
                power_cv: 498,
                displacement_cc: 0,
                architecture: "2 Motores Eléctricos",
                euro_norm: "N/A",
            },
            dimensions: {
                length: 4.72,
                width: 1.85,
                height: 1.44,
                wheelbase: 2.87
            },
            weights: {
                kerb_weight: 1828,
                max_weight: 2263
            },
            wheels: {
                tires: "235/45 R18",
                rims: "Aleación 18'' Photon"
            },
            emissions: {
                dgt_label: "0"
            },
            pricing: {
                msrp: "49.990 €",
                source: "Tesla España"
            }
        }
    },
    // Volkswagen Golf 8
    {
        make: 'Volkswagen',
        model: 'Golf',
        generation: 'VIII',
        trim: '2.0 TDI Life',
        yearStart: 2020,
        yearEnd: null,
        fuel: 'Diesel',
        transmission: 'Manual 6 vel',
        specs: {
            engine: {
                fuel: "Diesel",
                power_kw: 85,
                power_cv: 115,
                displacement_cc: 1968,
                architecture: "L4",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.28,
                width: 1.78,
                height: 1.49,
                wheelbase: 2.61
            },
            weights: {
                kerb_weight: 1380,
                max_weight: 1880
            },
            wheels: {
                tires: "205/55 R16",
                rims: "Aleación 16'' Norfolk"
            },
            emissions: {
                dgt_label: "C"
            },
            pricing: {
                msrp: "32.000 €",
                source: "Autopista.es"
            }
        }
    },
    // Hyundai Tucson
    {
        make: 'Hyundai',
        model: 'Tucson',
        generation: 'NX4',
        trim: '1.6 TGDI HEV Maxx',
        yearStart: 2021,
        yearEnd: null,
        fuel: 'Híbrido',
        transmission: 'Automática 6 vel',
        specs: {
            engine: {
                fuel: "Gasolina/Eléctrico",
                power_kw: 169,
                power_cv: 230,
                displacement_cc: 1598,
                architecture: "L4 Turbo",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.50,
                width: 1.86,
                height: 1.65,
                wheelbase: 2.68
            },
            weights: {
                kerb_weight: 1639,
                max_weight: 2175
            },
            wheels: {
                tires: "215/65 R17",
                rims: "Aleación 17''"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "36.500 €",
                source: "Hyundai Oficial"
            }
        }
    },
    // Peugeot 208
    {
        make: 'Peugeot',
        model: '208',
        generation: 'P21',
        trim: '1.2 PureTech Allure',
        yearStart: 2019,
        yearEnd: null,
        fuel: 'Gasolina',
        transmission: 'Manual 6 vel',
        specs: {
            engine: {
                fuel: "Gasolina",
                power_kw: 74,
                power_cv: 100,
                displacement_cc: 1199,
                architecture: "L3 Turbo",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.05,
                width: 1.74,
                height: 1.43,
                wheelbase: 2.54
            },
            weights: {
                kerb_weight: 1165,
                max_weight: 1595
            },
            wheels: {
                tires: "195/55 R16",
                rims: "Aleación 16'' Soho"
            },
            emissions: {
                dgt_label: "C"
            },
            pricing: {
                msrp: "21.000 €",
                source: "km77"
            }
        }
    },
    // Citroen C4
    {
        make: 'Citroën',
        model: 'C4',
        generation: 'III',
        trim: '1.2 PureTech Plus',
        yearStart: 2020,
        yearEnd: null,
        fuel: 'Gasolina',
        transmission: 'Manual 6 vel',
        specs: {
            engine: {
                fuel: "Gasolina",
                power_kw: 96,
                power_cv: 130,
                displacement_cc: 1199,
                architecture: "L3 Turbo",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.36,
                width: 1.80,
                height: 1.52,
                wheelbase: 2.67
            },
            weights: {
                kerb_weight: 1322,
                max_weight: 1755
            },
            wheels: {
                tires: "195/60 R18",
                rims: "Aleación 18'' Aeroblade"
            },
            emissions: {
                dgt_label: "C"
            },
            pricing: {
                msrp: "22.500 €",
                source: "Citroën España"
            }
        }
    },
    // Kia Sportage
    {
        make: 'Kia',
        model: 'Sportage',
        generation: 'NQ5',
        trim: '1.6 T-GDi MHEV Drive',
        yearStart: 2022,
        yearEnd: null,
        fuel: 'Gasolina/Mild-Hybrid',
        transmission: 'Automática DCT 7 vel',
        specs: {
            engine: {
                fuel: "Gasolina MHEV",
                power_kw: 110,
                power_cv: 150,
                displacement_cc: 1598,
                architecture: "L4 Mild-Hybrid 48V",
                euro_norm: "Euro 6d",
            },
            dimensions: {
                length: 4.51,
                width: 1.86,
                height: 1.64,
                wheelbase: 2.68
            },
            weights: {
                kerb_weight: 1580,
                max_weight: 2145
            },
            wheels: {
                tires: "215/65 R17",
                rims: "Aleación 17''"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "33.000 €",
                source: "Kia"
            }
        }
    },
    // Renault Clio E-Tech
    {
        make: 'Renault',
        model: 'Clio',
        generation: 'V Phase 2',
        trim: 'E-Tech Full Hybrid 145 Techno',
        yearStart: 2023,
        yearEnd: null,
        fuel: 'Híbrido',
        transmission: 'Automática Multimodo',
        specs: {
            engine: {
                fuel: "Gasolina/Eléctrico",
                power_kw: 105,
                power_cv: 145,
                displacement_cc: 1598,
                architecture: "L4 HEV",
                euro_norm: "Euro 6E",
            },
            dimensions: {
                length: 4.05,
                width: 1.79,
                height: 1.43,
                wheelbase: 2.58
            },
            weights: {
                kerb_weight: 1323,
                max_weight: 1750
            },
            wheels: {
                tires: "195/55 R16",
                rims: "Aleación 16'' Boavista"
            },
            emissions: {
                dgt_label: "ECO"
            },
            pricing: {
                msrp: "23.500 €",
                source: "Renault España"
            }
        }
    }
]

async function main() {
    console.log('Iniciando carga masiva de vehículos de España...')

    for (const car of cars) {
        const created = await prisma.vehicleVersion.create({
            data: car as any
        })
        console.log(`Guardado: ${created.make} ${created.model} - ${created.trim}`)
    }

    console.log('¡Base de datos populada exitosamente!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
