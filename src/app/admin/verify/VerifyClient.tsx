"use client";

import { useState, useTransition } from "react";
import styles from "../admin.module.css";
import { verifyPlate, revokeVerification, getPlateVerificationStatus } from "@/actions/verify";
import { Search, ShieldCheck, ShieldX, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface PlateStatus {
    plate: string;
    verified: boolean;
    verifiedAt: Date | null;
    version: {
        make: string;
        model: string;
        generation: string | null;
        yearStart: number | null;
        yearEnd: number | null;
    };
}

export default function VerifyClient() {
    const [query, setQuery] = useState("");
    const [plateStatus, setPlateStatus] = useState<PlateStatus | null | "not_found">(null);
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSearch = () => {
        if (!query.trim()) return;
        startTransition(async () => {
            const result = await getPlateVerificationStatus(query.trim());
            setPlateStatus(result === null ? "not_found" : result as any);
            setFeedback(null);
        });
    };

    const handleVerify = () => {
        startTransition(async () => {
            const res = await verifyPlate(query.trim());
            if (res.success) {
                setFeedback({ type: "success", message: "✅ Matrícula verificada correctamente." });
                const updated = await getPlateVerificationStatus(query.trim());
                setPlateStatus(updated as any);
            } else {
                setFeedback({ type: "error", message: res.error || "Error desconocido" });
            }
        });
    };

    const handleRevoke = () => {
        startTransition(async () => {
            const res = await revokeVerification(query.trim());
            if (res.success) {
                setFeedback({ type: "success", message: "Verificación revocada." });
                const updated = await getPlateVerificationStatus(query.trim());
                setPlateStatus(updated as any);
            } else {
                setFeedback({ type: "error", message: res.error || "Error desconocido" });
            }
        });
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Verificación de Matrículas</h1>
                <p>Busca una matrícula vinculada y aplícale el sello oficial de PlateVault.</p>
            </div>

            {/* Search bar */}
            <div className={styles.card} style={{ padding: "1.5rem", marginBottom: "2rem", maxWidth: "600px" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        placeholder="Ej. 1234ABC"
                        style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "10px",
                            padding: "0.8rem 1.2rem",
                            color: "white",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            outline: "none"
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isPending || !query.trim()}
                        className={styles.primaryBtn}
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
                    >
                        {isPending ? <Loader2 size={18} className={styles.spin} /> : <Search size={18} />}
                        Buscar
                    </button>
                </div>
            </div>

            {/* Feedback */}
            {feedback && (
                <div style={{
                    padding: "1rem 1.5rem",
                    borderRadius: "10px",
                    marginBottom: "1.5rem",
                    maxWidth: "600px",
                    background: feedback.type === "success" ? "rgba(42, 157, 143, 0.1)" : "rgba(230, 57, 70, 0.1)",
                    border: `1px solid ${feedback.type === "success" ? "rgba(42, 157, 143, 0.3)" : "rgba(230, 57, 70, 0.3)"}`,
                    color: feedback.type === "success" ? "#2a9d8f" : "#e63946",
                    fontWeight: 600
                }}>
                    {feedback.message}
                </div>
            )}

            {/* Result */}
            {plateStatus && plateStatus !== "not_found" && (
                <div className={styles.card} style={{ padding: "2rem", maxWidth: "600px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                        <div>
                            <div style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "3px", marginBottom: "0.3rem" }}>
                                {plateStatus.plate}
                            </div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                                {plateStatus.version.make} {plateStatus.version.model}
                                {plateStatus.version.generation ? ` · ${plateStatus.version.generation}` : ""}
                                {plateStatus.version.yearStart ? ` · ${plateStatus.version.yearStart}` : ""}
                                {plateStatus.version.yearEnd && plateStatus.version.yearEnd !== plateStatus.version.yearStart ? `–${plateStatus.version.yearEnd}` : ""}
                            </div>
                        </div>
                        {plateStatus.verified ? (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "rgba(42, 157, 143, 0.1)",
                                border: "1px solid rgba(42, 157, 143, 0.3)",
                                borderRadius: "10px",
                                padding: "0.5rem 1rem",
                                color: "#2a9d8f",
                                fontWeight: 700,
                                fontSize: "0.85rem"
                            }}>
                                <ShieldCheck size={18} />
                                VERIFICADA
                            </div>
                        ) : (
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "10px",
                                padding: "0.5rem 1rem",
                                color: "var(--text-muted)",
                                fontWeight: 700,
                                fontSize: "0.85rem"
                            }}>
                                <ShieldX size={18} />
                                SIN VERIFICAR
                            </div>
                        )}
                    </div>

                    {plateStatus.verifiedAt && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                            Verificada el {new Date(plateStatus.verifiedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "1rem" }}>
                        {!plateStatus.verified ? (
                            <button
                                onClick={handleVerify}
                                disabled={isPending}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.6rem",
                                    padding: "0.9rem",
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #2a9d8f, #264653)",
                                    color: "white",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.7 : 1,
                                    fontSize: "0.95rem",
                                    transition: "all 0.2s"
                                }}
                            >
                                {isPending ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle2 size={18} />}
                                Verificar Matrícula
                            </button>
                        ) : (
                            <button
                                onClick={handleRevoke}
                                disabled={isPending}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.6rem",
                                    padding: "0.9rem",
                                    borderRadius: "10px",
                                    background: "rgba(230, 57, 70, 0.1)",
                                    color: "#e63946",
                                    border: "1px solid rgba(230, 57, 70, 0.3)",
                                    fontWeight: 700,
                                    cursor: isPending ? "not-allowed" : "pointer",
                                    opacity: isPending ? 0.7 : 1,
                                    fontSize: "0.95rem",
                                    transition: "all 0.2s"
                                }}
                            >
                                {isPending ? <Loader2 size={18} className={styles.spin} /> : <XCircle size={18} />}
                                Revocar Verificación
                            </button>
                        )}
                    </div>
                </div>
            )}

            {plateStatus === "not_found" && (
                <div className={styles.card} style={{ padding: "2rem", maxWidth: "600px", textAlign: "center" }}>
                    <ShieldX size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                    <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                        Esta matrícula no está vinculada al catálogo.
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                        Primero vincúlala desde <strong>Vínculos de Matrículas</strong> para poder verificarla.
                    </p>
                </div>
            )}
        </div>
    );
}
