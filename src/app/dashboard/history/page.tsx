import styles from "../dashboard.module.css";
import { getLookupHistory } from "@/actions/lookup";
import { Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
    const history = await getLookupHistory();

    return (
        <>
            <header className={styles.header}>
                <h1>Mi Historial</h1>
                <p>Consulta tus búsquedas recientes y vuelve a acceder a su ficha técnica.</p>
            </header>

            <div className={`${styles.tableWrapper} glass`} style={{ marginTop: '2rem' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Matrícula</th>
                            <th>Resultado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry) => (
                            <tr key={entry.id}>
                                <td data-label="Fecha" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={14} className={styles.iconMuted} />
                                    {new Date(entry.timestamp).toLocaleString()}
                                </td>
                                <td data-label="Matrícula">
                                    <strong style={{ letterSpacing: '1px' }}>{entry.plate}</strong>
                                </td>
                                <td data-label="Resultado">
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: entry.responseHash === "MATCH_FOUND" ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                                        color: entry.responseHash === "MATCH_FOUND" ? '#2a9d8f' : '#e63946'
                                    }}>
                                        {entry.responseHash === "MATCH_FOUND" ? "Encontrado" : "No encontrado"}
                                    </span>
                                </td>
                                <td data-label="Acción">
                                    <Link
                                        href={`/dashboard?plate=${entry.plate}`}
                                        className={styles.actionLink}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                    >
                                        Ver Ficha <ExternalLink size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                    Aún no has realizado ninguna consulta.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
