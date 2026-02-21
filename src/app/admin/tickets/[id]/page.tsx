import { auth } from "@/auth";
import { getTicketDetails } from "@/actions/tickets";
import TicketConversation from "@/components/TicketConversation";
import AdminTicketControls from "./AdminTicketControls";
import { ArrowLeft, Mail, Shield, Calendar, ExternalLink, UserCog, Clock } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import styles from "../../admin.module.css";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN" && role !== "SUPPORT" && role !== "SUPERADMIN") {
        return redirect("/dashboard");
    }

    try {
        const ticket = await getTicketDetails(id);
        const user = ticket.user as any;

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ── Top Bar ── */}
                <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <Link href="/admin/tickets" className={styles.returnBtn} style={{ display: "inline-flex", width: "auto" }}>
                        <ArrowLeft size={15} /> Volver a Gestión
                    </Link>
                    <span style={{
                        fontSize: "0.65rem", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "1.5px",
                        color: "var(--text-muted)",
                        border: "1px solid var(--surface-border)",
                        background: "var(--surface)",
                        padding: "0.35rem 0.9rem", borderRadius: "30px"
                    }}>
                        ID: {ticket.id}
                    </span>
                </div>

                {/* ── Status & Priority Selector (top) ── */}
                <div style={{ marginBottom: "2rem" }}>
                    <AdminTicketControls
                        ticketId={ticket.id}
                        currentStatus={ticket.status}
                        currentPriority={ticket.priority}
                        currentDepartment={ticket.department}
                        isAdmin={role === "ADMIN"}
                    />
                </div>

                {/* ── Title + Meta ── */}
                <header className={styles.header} style={{ marginBottom: "2.5rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.9rem", margin: 0 }}>{ticket.subject}</h1>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", margin: "0.4rem 0 0" }}>
                            Modo Moderación Administrativa
                        </p>
                    </div>
                </header>

                {/* ── Main Layout ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>

                    {/* ── Chat ── */}
                    <div>
                        <TicketConversation
                            ticket={ticket}
                            currentUserId={session?.user?.id || ""}
                            isAdminView={true}
                        />
                    </div>

                    {/* ── Right Panel ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                        {/* User Card */}
                        <div style={{
                            background: "var(--surface)", border: "1px solid var(--surface-border)",
                            borderRadius: "18px", padding: "1.5rem",
                        }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-muted)", margin: "0 0 1.2rem" }}>
                                Solicitante
                            </p>

                            {/* Avatar + Name */}
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--surface-border)", flexShrink: 0 }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "56px", height: "56px", borderRadius: "50%", flexShrink: 0,
                                        background: "linear-gradient(135deg, var(--accent), #c62828)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "1.3rem", fontWeight: 800, color: "white"
                                    }}>
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>{user.name || "Usuario"}</p>
                                    <span style={{
                                        display: "inline-block", marginTop: "0.3rem",
                                        fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
                                        letterSpacing: "1px", padding: "2px 8px", borderRadius: "4px",
                                        background: user.role === "ADMIN" || user.role === "SUPERADMIN" ? "rgba(230,57,70,0.1)" : "rgba(255,255,255,0.05)",
                                        color: user.role === "ADMIN" || user.role === "SUPERADMIN" ? "var(--accent)" : "var(--text-muted)",
                                        border: "1px solid currentColor"
                                    }}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", fontSize: "0.8rem" }}>
                                    <Mail size={14} style={{ color: "var(--text-muted)", marginTop: "2px", flexShrink: 0 }} />
                                    <span style={{ wordBreak: "break-all", color: "rgba(255,255,255,0.7)" }}>{user.email}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", fontSize: "0.8rem" }}>
                                    <Calendar size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                                    <span style={{ color: "rgba(255,255,255,0.7)" }}>
                                        Registrado: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "—"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", fontSize: "0.8rem" }}>
                                    <Shield size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace", fontSize: "0.72rem" }}>
                                        {user.id}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--surface-border)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                <Link
                                    href={`/admin/users/${user.id}`}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.6rem",
                                        padding: "0.6rem 1rem", borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        background: "rgba(255,255,255,0.04)",
                                        color: "white", fontSize: "0.82rem", fontWeight: 600,
                                        textDecoration: "none", transition: "all 0.18s"
                                    }}
                                >
                                    <UserCog size={15} /> Ver perfil del usuario
                                    <ExternalLink size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />
                                </Link>
                                <Link
                                    href={`/admin/users/${user.id}?tab=role`}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.6rem",
                                        padding: "0.6rem 1rem", borderRadius: "10px",
                                        border: "1px solid rgba(230,57,70,0.2)",
                                        background: "rgba(230,57,70,0.05)",
                                        color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600,
                                        textDecoration: "none", transition: "all 0.18s"
                                    }}
                                >
                                    <Shield size={15} /> Editar rol / Suspender
                                    <ExternalLink size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />
                                </Link>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div style={{
                            background: "var(--surface)", border: "1px solid var(--surface-border)",
                            borderRadius: "18px", padding: "1.5rem",
                        }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-muted)", margin: "0 0 1.2rem" }}>
                                Cronología
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                {[
                                    { label: "Creado", value: new Date(ticket.createdAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) },
                                    { label: "Actualizado", value: new Date(ticket.updatedAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) },
                                    { label: "Mensajes", value: `${ticket.messages.length} mensaje${ticket.messages.length !== 1 ? "s" : ""}` },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
                                            <Clock size={12} /> {label}
                                        </div>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audit Notice */}
                        <div style={{
                            padding: "1.2rem",
                            borderRadius: "12px",
                            border: "1px solid rgba(230,57,70,0.15)",
                            background: "rgba(230,57,70,0.03)"
                        }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent)", margin: "0 0 0.5rem" }}>
                                Aviso de Auditoría
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                                Modo moderación técnica activo. Toda interacción queda registrada y vinculada a tu cuenta de administrador.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error);
        return notFound();
    }
}
