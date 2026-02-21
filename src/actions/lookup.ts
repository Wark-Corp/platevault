"use server";

import { auth } from "@/auth";
import { logPlateLookup } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export type VehicleSpecs = {
    make: string;
    model: string;
    generation?: string;
    trim?: string;
    year?: string;
    engine: {
        fuel: string;
        power_kw: number;
        power_cv: number;
        displacement_cc: number;
        architecture: string;
        turbo: boolean;
        euro_norm: string;
        par_nm?: number;
    };
    dimensions: {
        length: number;
        width: number;
        height: number;
        wheelbase: number;
    };
    weights: {
        kerb_weight: number;
        max_weight: number;
    };
    wheels: {
        tires: string;
        rims: string;
    };
    emissions: {
        dgt_label: string;
    };
    pricing?: {
        msrp: string;
        source: string;
    };
};

async function lookupExternalPlate(plate: string): Promise<VehicleSpecs | null> {
    const username = process.env.EXT_API_USERNAME || "demo"; // Fallback a demo si no está configurada
    const url = `https://www.regcheck.org.uk/api/reg.asmx/CheckSpain?RegistrationNumber=${plate}&username=${username}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("Error en API externa:", response.statusText);
            return null;
        }

        const xmlString = await response.text();

        // RegCheck devuelve un XML que contiene un JSON en una etiqueta <vehicleJson>
        // O directamente el JSON si la cabecera Accept funciona.
        // Como precaución, intentamos parsear ambos casos.
        let data: any;
        try {
            data = JSON.parse(xmlString);
        } catch (e) {
            // Intento de extracción simple si viene envuelto en XML
            const jsonMatch = xmlString.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/);
            if (jsonMatch && jsonMatch[1]) {
                data = JSON.parse(jsonMatch[1]);
            } else {
                console.error("No se pudo extraer JSON de la respuesta de RegCheck");
                return null;
            }
        }

        if (!data || !data.Description) return null;

        // Mapeo de RegCheck a VehicleSpecs
        return {
            make: data.CarMake?.CurrentTextValue || "Desconocido",
            model: data.CarModel?.CurrentTextValue || data.Description,
            generation: data.RegistrationYear || "N/A",
            trim: data.Series || data.ModelDescription || "Estándar",
            year: data.RegistrationYear,
            engine: {
                fuel: data.FuelType?.CurrentTextValue || "Desconocido",
                power_kw: parseInt(data.EnginePower?.CurrentTextValue) || 0,
                power_cv: Math.round((parseInt(data.EnginePower?.CurrentTextValue) || 0) * 1.36),
                displacement_cc: parseInt(data.EngineSize?.CurrentTextValue) || 0,
                architecture: data.EngineCode?.CurrentTextValue || "L4",
                turbo: (data.Description || "").toLowerCase().includes("turbo"),
                euro_norm: "N/A"
            },
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
                wheelbase: 0
            },
            weights: {
                kerb_weight: parseInt(data.WeightByFuelType?.CurrentTextValue) || 0,
                max_weight: 0
            },
            wheels: {
                tires: "Consultar ficha física",
                rims: "Aleación"
            },
            emissions: {
                dgt_label: "Consultar" // La API internacional no suele dar la etiqueta DGT
            },
            pricing: {
                msrp: "N/A",
                source: "RegCheck Real-Time API"
            }
        };
    } catch (error) {
        console.error("Error consultando RegCheck:", error);
        return null;
    }
}

export async function lookupPlate(plate: string, source: "internal" | "external" = "internal") {
    const session = await auth();
    if (!session) throw new Error("Acceso denegado.");

    // Check Rate Limit
    const role = (session.user as any)?.role;
    const limit = await checkRateLimit("search", "SEARCH", session.user?.id, role);

    if (!limit.allowed) {
        return { error: "Límite de consultas diarias superado.", reset: limit.reset };
    }

    const requestId = uuidv4();
    const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (normalizedPlate.length < 5) {
        return { error: "Formato de matrícula inválido." };
    }

    let result: any = null;

    if (source === "internal") {
        const mapping = await prisma.plateMapping.findUnique({
            where: { plate: normalizedPlate },
            include: { version: { include: { sources: true } } },
        });

        if (mapping) {
            const isVerified = (mapping as any).verified ?? false;
            result = {
                ...mapping.version,
                verified: isVerified,
                specs: {
                    ...(mapping.version.specs as any),
                    make: mapping.version.make,
                    model: mapping.version.model,
                    generation: mapping.version.generation,
                    trim: mapping.version.trim,
                    yearStart: mapping.version.yearStart,
                    yearEnd: mapping.version.yearEnd,
                    verified: isVerified,
                } as unknown as VehicleSpecs,
                sources: mapping.version.sources
            };
        }
    } else {
        // Búsqueda en API Externa
        const externalData = await lookupExternalPlate(normalizedPlate);
        if (externalData) {
            result = {
                id: `ext_${normalizedPlate}`,
                make: externalData.make,
                model: externalData.model,
                generation: externalData.generation,
                trim: externalData.trim,
                fuel: externalData.engine.fuel,
                specs: externalData,
                isExternal: true
            };
        }
    }

    // Registrar la consulta
    await logPlateLookup(
        session.user?.id || null,
        normalizedPlate,
        requestId,
        result ? (source === "internal" ? "MATCH_FOUND" : "EXTERNAL_MATCH") : "NOT_FOUND"
    );

    return { success: !!result, data: result };
}

export async function getLookupHistory() {
    const session = await auth();
    if (!session || !session.user?.id) throw new Error("No autorizado.");

    return await prisma.plateLookup.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: "desc" },
        take: 50, // Límite razonable
    });
}

export async function getSearchStats() {
    const session = await auth();
    if (!session || !session.user?.id) return { allowed: true, remaining: 0, premium: false };

    const role = (session.user as any)?.role;
    const stats = await checkRateLimit("search", "SEARCH", session.user.id, role);

    return {
        allowed: stats.allowed,
        remaining: stats.remaining,
        reset: stats.reset,
        premium: role === "PREMIUM" || role === "ADMIN" || role === "SUPPORT"
    };
}
