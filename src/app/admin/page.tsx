import { getStats, getAuditLogs } from "@/actions/admin";
import styles from "./admin.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const session = await auth();
    if (session?.user?.role === "SUPPORT") {
        redirect("/admin/tickets");
    }

    const stats = await getStats();
    const logs = await getAuditLogs();

    return (
        <>
            <header className={styles.header}>
                <h1>Panel de Administración</h1>
            </header>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} glass`}>
                    <h3>Usuarios</h3>
                    <p>{stats.userCount}</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <h3>Consultas Totales</h3>
                    <p>{stats.lookupCount}</p>
                </div>
                <div className={`${styles.statCard} glass`}>
                    <h3>Eventos (24h)</h3>
                    <p>{stats.recentLogs}</p>
                </div>
            </div>

            <section className={styles.logsSection}>
                <h2>Última Actividad (Auditoría)</h2>
                <div className={`${styles.tableWrapper} glass`}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.user?.email || "Invitado"}</td>
                                    <td>{log.action}</td>
                                    <td><code>{log.ip}</code></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
