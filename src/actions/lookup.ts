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
    // Campos extendidos de la API española
    vin?: string;
    carroceria?: string;
    traccion?: string;
    motor_code?: string;
    injeccion?: string;
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
    const apiKey = process.env.RAPIDAPI_KEY || "9e28f50160mshdaa8b02b264b10dp162c36jsn5122fb232597";
    const url = `https://api-matriculas-espana.p.rapidapi.com/es?plate=${plate}&rapidapi-key=${apiKey}`;

    try {
        const response = await fetch(url, {
            headers: {
                'x-rapidapi-host': 'api-matriculas-espana.p.rapidapi.com'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error("Error en API externa (RapidAPI):", response.statusText);
            return null;
        }

        const responseData = await response.json();

        // La API puede devolver { MARCA: ... } directo o array [{ MARCA: ... }]
        let data = responseData;
        if (Array.isArray(responseData)) {
            if (responseData.length === 0) {
                console.log("RapidAPI retornó un array vacío para", plate);
                return null;
            }
            data = responseData[0];
        }

        if (!data || Object.keys(data).length === 0 || !data.MARCA) {
            console.log("RapidAPI retornó objeto inválido o vacío para", plate, ":", data);
            return null;
        }

        const kw = parseInt(data.KWs) || 0;

        // Mapeo de la nueva API a VehicleSpecs
        // Nota: La API devuelve "INYECCION" con Y, pero nosotros mapeamos a "injeccion" (por tipado previo)
        return {
            make: data.MARCA || "Desconocido",
            model: data.MODELO || "Desconocido",
            generation: "N/A", // La API no parece proveer el año/generación directamente
            trim: data.TPMOTOR || "Estándar",
            year: data.FECHA_MATRICULACION ? data.FECHA_MATRICULACION.split('/')[2] : "N/A",
            vin: data.VIN || undefined,
            carroceria: data.CARROCERIA || undefined,
            traccion: data.TRACCION || undefined,
            motor_code: data.MOTOR || undefined,
            injeccion: data.INYECCION || undefined,
            engine: {
                fuel: data.TYMOTOR || "Desconocido",
                power_kw: kw,
                power_cv: Math.round(kw * 1.36),
                displacement_cc: 0, // No provee cilindrada
                architecture: data.MOTOR || "N/A",
                turbo: (data.INYECCION || "").toLowerCase().includes("turbo") || (data.INYECCION || "").toLowerCase().includes("inyección directa"),
                euro_norm: "N/A"
            },
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
                wheelbase: 0
            },
            weights: {
                kerb_weight: 0,
                max_weight: 0
            },
            wheels: {
                tires: "Consultar ficha física",
                rims: "Aleación"
            },
            emissions: {
                dgt_label: "Consultar"
            },
            pricing: {
                msrp: "N/A",
                source: "API Matrículas España (RapidAPI)"
            }
        };
    } catch (error) {
        console.error("Error consultando API Matrículas España:", error);
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
