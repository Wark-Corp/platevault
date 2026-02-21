"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { lookupPlate, getSearchStats } from "@/actions/lookup";
import styles from "../app/dashboard/dashboard.module.css";
import TechnicalSheet from "@/components/TechnicalSheet";
import { Search, Loader2, Zap, Clock, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SearchExperience() {
    const searchParams = useSearchParams();
    const [plate, setPlate] = useState(searchParams.get("plate") || "");
    const [source, setSource] = useState<"internal" | "external">("internal");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null);

    // Búsqueda Stats
    const [stats, setStats] = useState<{
        allowed: boolean;
        remaining: number;
        premium: boolean;
        reset: Date | null;
    } | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");

    const fetchStats = useCallback(async () => {
        const res = await getSearchStats();
        setStats({
            ...res,
            reset: res.reset ? new Date(res.reset) : null
        });
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Lógica de cuenta atrás
    useEffect(() => {
        if (!stats?.reset || stats.allowed) {
            setTimeLeft("");
            return;
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = stats.reset!.getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("");
                fetchStats();
                clearInterval(interval);
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [stats, fetchStats]);

    const handleSearch = useCallback(async (forcedPlate?: string) => {
        if (stats && !stats.allowed && !stats.premium) return;

        const queryPlate = forcedPlate || plate;
        if (!queryPlate || queryPlate.length < 5) {
            setError("Introduce una matrícula válida.");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const res = await lookupPlate(queryPlate, source);
            if (res.error) {
                setError(res.error);
                fetchStats(); // Actualizar stats si falló por límite
            } else if (res.success && res.data) {
                setResults(res.data);
                fetchStats(); // Actualizar tras éxito
            } else {
                setError(source === "internal"
                    ? "No se han encontrado datos técnicos en nuestra base de datos. Prueba con la API Externa."
                    : "La API externa no retornó datos para esta matrícula.");
                fetchStats();
            }
        } catch (e) {
            setError("Ocurrió un error en la consulta.");
        } finally {
            setLoading(false);
        }
    }, [plate, source, stats, fetchStats]);

    // Control para evitar bucles con la búsqueda por URL
    const initialSearchDone = useRef(false);

    useEffect(() => {
        const urlPlate = searchParams.get("plate");
        if (urlPlate && !initialSearchDone.current) {
            initialSearchDone.current = true;
            handleSearch(urlPlate);
        }
    }, [searchParams, handleSearch]);

    return (
        <div className={styles.searchSection}>
            {/* Search Counter / Stats */}
            <div className={styles.searchStats}>
                {stats && (
                    <div className={`${styles.counterBadge} ${stats.premium ? styles.premiumBadge : (!stats.allowed ? styles.limitReached : "")}`}>
                        {stats.premium ? (
                            <>
                                <Zap size={14} fill="currentColor" />
                                <span>Consultas ilimitadas</span>
                            </>
                        ) : !stats.allowed ? (
                            <div className={styles.countdown}>
                                <Clock size={14} />
                                <span>Reseteo en: {timeLeft || "Cargando..."}</span>
                            </div>
                        ) : (
                            <>
                                <Info size={14} />
                                <span>Consultas hoy: <span>{stats.remaining}/15</span></span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Selector de Fuente */}
            <div className={styles.sourceToggle}>
                <button
                    className={source === "internal" ? styles.activeSource : ""}
                    onClick={() => setSource("internal")}
                >
                    PlateVault
                </button>
                <button
                    className={source === "external" ? styles.activeSource : ""}
                    onClick={() => setSource("external")}
                >
                    API Externa
                </button>
            </div>

            <div className={`${styles.searchBar} glass`}>
                <input
                    type="text"
                    placeholder="1234ABC"
                    maxLength={7}
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={!!(stats && !stats.allowed && !stats.premium)}
                />
                <button
                    onClick={() => handleSearch()}
                    disabled={loading || !!(stats && !stats.allowed && !stats.premium)}
                >
                    {loading ? <Loader2 className={styles.spin} /> : <Search size={20} />}
                    <span>{loading ? "Consultando..." : (!stats?.allowed && !stats?.premium ? "Límite" : "Consultar")}</span>
                </button>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <p>{error}</p>
                </div>
            )}

            <div className={styles.infoBox}>
                <p>Solo se mostrarán datos técnicos no sensibles cumpliendo con la normativa vigente.</p>
            </div>

            {results && <TechnicalSheet specs={results.specs} plate={plate} versionId={results.id} />}
        </div>
    );
}
