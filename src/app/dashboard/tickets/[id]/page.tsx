import { auth } from "@/auth";
import { getTicketDetails } from "@/actions/tickets";
import TicketConversation from "@/components/TicketConversation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../dashboard.module.css";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();
    if (!session) return null;

    try {
        const ticket = await getTicketDetails(id);

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Link
                        href="/dashboard/tickets"
                        className={styles.logoutBtn}
                        style={{
                            marginBottom: '2rem',
                            display: 'inline-flex',
                            width: 'auto',
                            background: 'rgba(255,255,255,0.05) !important',
                            color: 'var(--text-muted) !important',
                            padding: '0.6rem 1.2rem !important'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Volver a Mis Tickets
                    </Link>

                    <header className={styles.header} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ fontSize: '2.2rem' }}>{ticket.subject}</h1>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                CASE #{ticket.id.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <span style={{
                                padding: '0.5rem 1.2rem',
                                borderRadius: '30px',
                                fontSize: '0.7rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                background: ticket.status === 'RESOLVED' ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                                color: ticket.status === 'RESOLVED' ? '#2a9d8f' : 'var(--accent)',
                                border: '1px solid currentColor'
                            }}>
                                {ticket.status}
                            </span>
                        </div>
                    </header>

                    <TicketConversation
                        ticket={ticket}
                        currentUserId={session.user.id!}
                        isAdminView={false}
                    />
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        return notFound();
    }
}
