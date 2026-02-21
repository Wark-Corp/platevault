import { headers } from "next/headers";

/**
 * Obtiene la dirección IP del cliente de forma limpia y normalizada.
 * Maneja proxies (x-forwarded-for) y normaliza loopbacks locales (::1).
 */
export async function getClientIp(): Promise<string> {
    const headersList = await headers();

    // x-forwarded-for puede contener una lista de IPs si hay varios proxies
    const forwardedFor = headersList.get("x-forwarded-for");
    let ip = "";

    if (forwardedFor) {
        ip = forwardedFor.split(",")[0].trim();
    } else {
        ip = headersList.get("x-real-ip") || "unknown";
    }

    // Normalizar localhost IPv6 a IPv4 para mejor lectura
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
        return "127.0.0.1";
    }

    return ip;
}
