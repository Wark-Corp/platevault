import { auth } from "@/auth";
import { getAllTickets } from "@/actions/tickets";
import Link from "next/link";
import { LifeBuoy, ChevronRight, AlertTriangle } from "lucide-react";
import styles from "../admin.module.css";

export default async function AdminTicketsPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "SUPPORT" && role !== "SUPERADMIN") {
        return <div>No autorizado</div>;
    }

    const tickets = await getAllTickets();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "OPEN": return { color: 'var(--accent)', background: 'rgba(230, 57, 70, 0.1)' };
            case "IN_PROGRESS": return { color: '#ffb703', background: 'rgba(255, 183, 3, 0.1)' };
            case "RESOLVED": return { color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.1)' };
            default: return { color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH": return 'var(--accent)';
            case "MEDIUM": return '#ffb703';
            default: return '#2a9d8f';
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header}>
                <div>
                    <h1>Gestión de Tickets</h1>
                    <p>Moderación y soporte técnico global de PlateVault</p>
                </div>
                <div className={styles.statCard} style={{ padding: '1rem 2rem', minWidth: 'auto' }}>
                    <h3>Total Abiertos</h3>
                    <p style={{ fontSize: '1.8rem' }}>{tickets.filter((t: any) => t.status !== 'CLOSED').length}</p>
                </div>
            </header>

            <div className={styles.tableWrapper} style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Asunto</th>
                            <th>Prioridad</th>
                            <th>Departamento</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket: any) => (
                            <tr key={ticket.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {ticket.user?.name?.charAt(0) || ticket.user?.email?.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700 }}>{ticket.user?.name || 'Usuario'}</p>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ticket.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{ticket.subject}</p>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        color: getPriorityColor(ticket.priority),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <AlertTriangle size={12} /> {ticket.priority}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        color: 'var(--text-muted)',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {ticket.department?.replace(/_/g, ' ') || 'GENERAL'}
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '0.3rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        ...getStatusStyle(ticket.status)
                                    }}>
                                        {ticket.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <Link
                                        href={`/admin/tickets/${ticket.id}`}
                                        style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center' }}
                                    >
                                        <ChevronRight size={20} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontStyle: 'italic' }}>No hay tickets registrados en el sistema</p>
                    </div>
                )}
            </div>
        </div>
    );
}
