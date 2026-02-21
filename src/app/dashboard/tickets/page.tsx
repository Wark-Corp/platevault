import { auth } from "@/auth";
import { getUserTickets } from "@/actions/tickets";
import { AlertCircle } from "lucide-react";
import styles from "../dashboard.module.css";
import Link from "next/link";
import TicketList from "./TicketList";

export default async function TicketsPage() {
    const session = await auth();
    if (!session) return null;

    const tickets = await getUserTickets();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header} style={{ marginBottom: '3rem' }}>
                <h1>Mis Tickets</h1>
                <p>Centro de soporte y asistencia técnica PlateVault</p>
            </header>

            {tickets.length === 0 ? (
                <div style={{
                    padding: '5rem 2rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '24px',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', opacity: 0.4 }}>
                        <AlertCircle size={64} strokeWidth={1} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Sin tickets activos</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                        No tienes ninguna consulta abierta. Si necesitas ayuda técnica, utiliza el botón <strong>Nuevo Ticket</strong> en la barra lateral.
                    </p>
                    <Link
                        href="/dashboard"
                        className={styles.logoutBtn}
                        style={{ display: 'inline-flex', width: 'auto', padding: '0.8rem 2rem' }}
                    >
                        Volver al Dashboard
                    </Link>
                </div>
            ) : (
                <TicketList tickets={tickets} />
            )}
        </div>
    );
}
