"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { LifeBuoy, X, Paperclip, Send, Loader2, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { createTicket } from "@/actions/tickets";

interface SupportSystemProps {
    variant?: "header" | "sidebar" | "fab" | "button";
    className?: string;
    children?: React.ReactNode;
}

export default function SupportSystem({ variant = "header", className, children }: SupportSystemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        files.forEach(file => formData.append("attachments", file));
        try {
            const result = await createTicket(formData);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(false);
                    setFiles([]);
                    setCharCount(0);
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message || "Error al enviar el ticket.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const invalid = newFiles.find(f => f.size > 15 * 1024 * 1024);
            if (invalid) { alert("Un archivo supera los 15MB"); return; }
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    // ── Shared input styles ──────────────────────────────────────────
    const inputStyle: React.CSSProperties = {
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "0.75rem 1rem",
        color: "white",
        fontSize: "0.92rem",
        outline: "none",
        transition: "border-color 0.18s",
        boxSizing: "border-box",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: "0.68rem",
        fontWeight: 800,
        textTransform: "uppercase" as const,
        letterSpacing: "1.2px",
        color: "rgba(255,255,255,0.45)",
        marginBottom: "0.5rem",
    };

    // ── Trigger buttons ──────────────────────────────────────────────
    const triggerHeader = (
        <button
            onClick={() => setIsOpen(true)}
            style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: 0, border: "none", background: "transparent",
                color: "var(--text-muted)",
                fontSize: "1rem", fontWeight: 500,
                cursor: "pointer", transition: "color 0.18s",
                whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
        >
            <LifeBuoy size={18} /> Soporte
        </button>
    );

    const triggerSidebar = (
        <button
            onClick={() => setIsOpen(true)}
            style={{
                display: "flex", alignItems: "center", gap: "0.8rem",
                padding: "0.8rem 1rem", borderRadius: "8px",
                border: "none", background: "transparent",
                color: "var(--text-muted)", fontWeight: 500,
                cursor: "pointer", width: "100%", textAlign: "left",
                transition: "all 0.18s", fontSize: "inherit",
            }}
            onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "rgba(255,255,255,0.05)";
                b.style.color = "var(--foreground)";
            }}
            onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "transparent";
                b.style.color = "var(--text-muted)";
            }}
        >
            <LifeBuoy size={18} /> Nuevo Ticket
        </button>
    );

    const triggerFab = (
        <button
            onClick={() => setIsOpen(true)}
            title="Crear ticket"
            style={{
                position: "fixed", bottom: "2rem", right: "2rem",
                width: "56px", height: "56px", borderRadius: "50%",
                border: "none", background: "var(--accent)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 500,
                boxShadow: "0 8px 24px rgba(230,57,70,0.4)",
                transition: "all 0.18s",
            }}
        >
            <Plus size={24} />
        </button>
    );

    const triggerButton = (
        <button
            onClick={() => setIsOpen(true)}
            className={className}
        >
            {children || "Contactar"}
        </button>
    );

    const trigger = variant === "sidebar" ? triggerSidebar : variant === "fab" ? triggerFab : variant === "button" ? triggerButton : triggerHeader;

    // ── Modal JSX ────────────────────────────────────────────────────
    const modal = (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 99999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1rem",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={() => !isSubmitting && setIsOpen(false)}
                style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.78)",
                    backdropFilter: "blur(8px)",
                }}
            />

            {/* Dialog card */}
            <div
                style={{
                    position: "relative", zIndex: 1,
                    width: "100%", maxWidth: "520px",
                    background: "#0d0d0d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "24px",
                    padding: "2.5rem",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.95)",
                    animation: "pvSlideUp 0.22s cubic-bezier(.4,0,.2,1)",
                    maxHeight: "90vh", overflowY: "auto",
                }}
            >
                {/* Close btn */}
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "absolute", top: "1.25rem", right: "1.25rem",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", color: "rgba(255,255,255,0.5)",
                        width: "32px", height: "32px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.18s",
                    }}
                >
                    <X size={16} />
                </button>

                {success ? (
                    /* ── Success ── */
                    <div style={{ textAlign: "center", padding: "3rem 0" }}>
                        <div style={{
                            width: "72px", height: "72px", borderRadius: "50%",
                            background: "rgba(42,157,143,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.5rem", color: "#2a9d8f",
                        }}>
                            <CheckCircle2 size={36} />
                        </div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                            ¡Ticket enviado!
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
                            Hemos recibido tu consulta. Un agente te responderá pronto.<br />
                            Sigue el progreso en <strong style={{ color: "white" }}>Dashboard → Mis Tickets</strong>.
                        </p>
                    </div>
                ) : (
                    /* ── Form ── */
                    <>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                            <div style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                background: "rgba(230,57,70,0.12)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "var(--accent)", flexShrink: 0,
                            }}>
                                <LifeBuoy size={22} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>Soporte Técnico</h2>
                                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                                    Cuéntanos cómo podemos ayudarte
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                            {/* Subject */}
                            <div>
                                <label style={labelStyle}>Asunto del problema</label>
                                <input
                                    name="subject" required
                                    placeholder="Ej: Error al consultar matrícula"
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = "rgba(230,57,70,0.55)")}
                                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                />
                            </div>

                            {/* Department Selection */}
                            <div>
                                <label style={labelStyle}>Departamento</label>
                                <select
                                    name="department" defaultValue="GENERAL"
                                    style={{
                                        ...inputStyle, cursor: "pointer",
                                        appearance: "none",
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 1rem center",
                                        paddingRight: "2.5rem",
                                    }}
                                    onFocus={e => (e.target.style.borderColor = "rgba(230,57,70,0.55)")}
                                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                >
                                    <option value="GENERAL" style={{ background: "#111" }}>Soporte General</option>
                                    <option value="TECHNICAL" style={{ background: "#111" }}>Incidencias Técnicas</option>
                                    <option value="SALES" style={{ background: "#111" }}>Ventas</option>
                                    <option value="MARKETING" style={{ background: "#111" }}>Marketing</option>
                                    <option value="LEGAL" style={{ background: "#111" }}>Legal</option>
                                    <option value="SECURITY" style={{ background: "#111" }}>Seguridad</option>
                                </select>
                            </div>

                            {/* Priority + File */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label style={labelStyle}>Prioridad</label>
                                    <select
                                        name="priority" defaultValue="MEDIUM"
                                        style={{
                                            ...inputStyle, cursor: "pointer",
                                            appearance: "none",
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 1rem center",
                                            paddingRight: "2.5rem",
                                        }}
                                        onFocus={e => (e.target.style.borderColor = "rgba(230,57,70,0.55)")}
                                        onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                    >
                                        <option value="LOW" style={{ background: "#111" }}>🟢 Baja</option>
                                        <option value="MEDIUM" style={{ background: "#111" }}>🟡 Media</option>
                                        <option value="HIGH" style={{ background: "#111" }}>🔴 Alta</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Adjuntar (máx 15MB)</label>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            ...inputStyle,
                                            display: "flex", alignItems: "center", gap: "0.5rem",
                                            cursor: "pointer", justifyContent: "center",
                                            color: files.length > 0 ? "white" : "rgba(255,255,255,0.45)",
                                        }}
                                    >
                                        <Paperclip size={15} />
                                        <span style={{ fontSize: "0.85rem" }}>
                                            {files.length > 0 ? `${files.length} archivo${files.length > 1 ? "s" : ""}` : "Subir archivo"}
                                        </span>
                                    </button>
                                    <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
                                </div>
                            </div>

                            {/* File list */}
                            {files.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {files.map((f, i) => (
                                        <span key={i} style={{
                                            padding: "0.3rem 0.7rem",
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: "6px", fontSize: "0.75rem",
                                            color: "rgba(255,255,255,0.6)",
                                            display: "flex", alignItems: "center", gap: "0.4rem",
                                        }}>
                                            <Paperclip size={11} /> {f.name}
                                            <button
                                                type="button"
                                                onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                                                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 0 }}
                                            >
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label style={labelStyle}>Descripción</label>
                                <textarea
                                    name="content" required maxLength={4000} rows={5}
                                    placeholder="Describe tu problema con el mayor detalle posible..."
                                    onChange={e => setCharCount(e.target.value.length)}
                                    style={{
                                        ...inputStyle, resize: "vertical",
                                        minHeight: "120px", fontFamily: "inherit", lineHeight: 1.6,
                                    }}
                                    onFocus={e => (e.target.style.borderColor = "rgba(230,57,70,0.55)")}
                                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.35rem" }}>
                                    <span style={{
                                        fontSize: "0.68rem", fontWeight: 700,
                                        color: charCount > 3800 ? "var(--accent)" : "rgba(255,255,255,0.35)",
                                    }}>
                                        {charCount} / 4000
                                    </span>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "0.75rem",
                                    padding: "0.9rem 1rem",
                                    background: "rgba(230,57,70,0.08)",
                                    border: "1px solid rgba(230,57,70,0.25)",
                                    borderRadius: "10px", color: "var(--accent)", fontSize: "0.85rem",
                                }}>
                                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit" disabled={isSubmitting}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    gap: "0.6rem", width: "100%", padding: "0.9rem",
                                    borderRadius: "12px", border: "none",
                                    background: "linear-gradient(135deg, #e63946 0%, #c62828 100%)",
                                    color: "white", fontSize: "0.95rem", fontWeight: 700,
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                    opacity: isSubmitting ? 0.7 : 1,
                                    transition: "all 0.18s",
                                    boxShadow: "0 4px 20px rgba(230,57,70,0.3)",
                                }}
                                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {isSubmitting ? "Enviando..." : "Enviar Ticket"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            {trigger}
            {mounted && isOpen && createPortal(modal, document.body)}
            <style>{`
        @keyframes pvSlideUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </>
    );
}
