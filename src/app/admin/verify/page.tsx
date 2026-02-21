import VerifyClient from "./VerifyClient";
import styles from "../admin.module.css";
import { ShieldCheck } from "lucide-react";
import { getVerifiedPlates } from "@/actions/verify";

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
    const verifiedPlates = await getVerifiedPlates();

    return (
        <div>
            <VerifyClient />

            {verifiedPlates.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <ShieldCheck size={18} />
                        Matrículas Verificadas ({verifiedPlates.length})
                    </h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Matrícula</th>
                                    <th>Vehículo</th>
                                    <th>Fecha de Verificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verifiedPlates.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 800, letterSpacing: "2px", fontSize: "1rem" }}>{p.plate}</td>
                                        <td style={{ color: "var(--text-muted)" }}>
                                            {p.version.make} {p.version.model}
                                            {p.version.yearStart ? ` (${p.version.yearStart})` : ""}
                                        </td>
                                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                                            {p.verifiedAt ? new Date(p.verifiedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
