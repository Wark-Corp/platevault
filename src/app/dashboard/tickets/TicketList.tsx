"use client";

import Link from "next/link";
import { ChevronRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

function getStatusStyle(status: string) {
    switch (status) {
        case "OPEN": return { color: 'var(--accent)', background: 'rgba(230, 57, 70, 0.1)' };
        case "IN_PROGRESS": return { color: '#ffb703', background: 'rgba(255, 183, 3, 0.1)' };
        case "RESOLVED": return { color: '#2a9d8f', background: 'rgba(42, 157, 143, 0.1)' };
        default: return { color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)' };
    }
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        OPEN: "Abierto",
        IN_PROGRESS: "En Progreso",
        RESOLVED: "Resuelto",
        CLOSED: "Cerrado",
    };
    return labels[status] ?? status;
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case "HIGH": return 'var(--accent)';
        case "MEDIUM": return '#ffb703';
        default: return '#2a9d8f';
    }
}

function getDepartmentLabel(dept: string) {
    const depts: Record<string, string> = {
        GENERAL: "Soporte General",
        TECHNICAL: "Técnico",
        SALES: "Ventas",
        MARKETING: "Marketing",
        LEGAL: "Legal",
        SECURITY: "Seguridad",
    };
    return depts[dept] ?? dept;
}

export default function TicketList({ tickets }: { tickets: any[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tickets.map((ticket) => (
                <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="ticket-card-link"
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--surface-border)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'border-color 0.18s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            ...getStatusStyle(ticket.status)
                        }}>
                            {ticket.status === "RESOLVED" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{ticket.subject}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 900,
                                    textTransform: 'uppercase', letterSpacing: '1px',
                                    color: getPriorityColor(ticket.priority),
                                    padding: '2px 8px', borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid currentColor'
                                }}>
                                    {ticket.priority}
                                </span>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 900,
                                    textTransform: 'uppercase', letterSpacing: '1px',
                                    padding: '2px 8px', borderRadius: '4px',
                                    ...getStatusStyle(ticket.status),
                                    border: '1px solid currentColor'
                                }}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 800,
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                    padding: '2px 8px', borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {getDepartmentLabel(ticket.department)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Ticket ID</p>
                            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace' }}>#{ticket.id.slice(-6).toUpperCase()}</p>
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                    </div>
                </Link>
            ))}
        </div>
    );
}
