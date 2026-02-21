"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import { updateTicketMetadata, deleteTicket } from "@/actions/tickets";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
    { value: "OPEN", label: "🔴 Abierto", color: "rgba(230,57,70,0.15)", text: "#e63946" },
    { value: "IN_PROGRESS", label: "🔵 En Progreso", color: "rgba(58,134,255,0.15)", text: "#3a86ff" },
    { value: "RESOLVED", label: "🟢 Resuelto", color: "rgba(42,157,143,0.15)", text: "#2a9d8f" },
    { value: "CLOSED", label: "⚫ Cerrado", color: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.5)" },
];

const PRIORITY_OPTIONS = [
    { value: "LOW", label: "🟢 Baja", color: "rgba(42,157,143,0.15)", text: "#2a9d8f" },
    { value: "MEDIUM", label: "🟡 Media", color: "rgba(255,183,3,0.15)", text: "#ffb703" },
    { value: "HIGH", label: "🔴 Alta", color: "rgba(230,57,70,0.15)", text: "#e63946" },
];

const DEPARTMENT_OPTIONS = [
    { value: "GENERAL", label: "Soporte General" },
    { value: "TECHNICAL", label: "Incidencias Técnicas" },
    { value: "SALES", label: "Ventas" },
    { value: "MARKETING", label: "Marketing" },
    { value: "LEGAL", label: "Legal" },
    { value: "SECURITY", label: "Seguridad" },
];

interface AdminTicketControlsProps {
    ticketId: string;
    currentStatus: string;
    currentPriority: string;
    currentDepartment: string;
    isAdmin: boolean;
}

export default function AdminTicketControls({ ticketId, currentStatus, currentPriority, currentDepartment, isAdmin }: AdminTicketControlsProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [priority, setPriority] = useState(currentPriority);
    const [department, setDepartment] = useState(currentDepartment);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const hasChanges = status !== currentStatus || priority !== currentPriority || department !== currentDepartment;

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }

        setDeleting(true);
        try {
            await deleteTicket(ticketId);
            router.push("/admin/tickets");
            router.refresh();
        } catch (e: any) {
            console.error(e);
            alert(e.message || "Error al eliminar el ticket");
            setDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        setSaving(true);
        try {
            await updateTicketMetadata(ticketId, {
                status: status !== currentStatus ? status : undefined,
                priority: priority !== currentPriority ? priority : undefined,
                department: department !== currentDepartment ? department : undefined,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
            // Podemos hacer un reload suave si es necesario, pero revalidatePath debería encargarse si el componente padre es server
        } catch (e) {
            console.error(e);
            alert("Error al guardar cambios");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem 1.5rem",
            background: "var(--surface)",
            border: "1px solid var(--surface-border)",
            borderRadius: "16px",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                {/* ── Status ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "300px" }}>
                    <span style={{
                        fontSize: "0.68rem", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "1.5px",
                        color: "var(--text-muted)", whiteSpace: "nowrap",
                    }}>
                        Estado:
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {STATUS_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setStatus(opt.value)}
                                style={{
                                    padding: "0.4rem 0.9rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${status === opt.value ? opt.text : "rgba(255,255,255,0.07)"}`,
                                    background: status === opt.value ? opt.color : "transparent",
                                    color: status === opt.value ? opt.text : "rgba(255,255,255,0.4)",
                                    fontSize: "0.75rem",
                                    fontWeight: status === opt.value ? 800 : 500,
                                    cursor: "pointer",
                                    transition: "all 0.16s",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Priority ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{
                        fontSize: "0.68rem", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "1.5px",
                        color: "var(--text-muted)", whiteSpace: "nowrap",
                    }}>
                        Prioridad:
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {PRIORITY_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setPriority(opt.value)}
                                style={{
                                    padding: "0.4rem 0.9rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${priority === opt.value ? opt.text : "rgba(255,255,255,0.07)"}`,
                                    background: priority === opt.value ? opt.color : "transparent",
                                    color: priority === opt.value ? opt.text : "rgba(255,255,255,0.4)",
                                    fontSize: "0.75rem",
                                    fontWeight: priority === opt.value ? 800 : 500,
                                    cursor: "pointer",
                                    transition: "all 0.16s",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Department ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{
                        fontSize: "0.68rem", fontWeight: 900,
                        textTransform: "uppercase", letterSpacing: "1.5px",
                        color: "var(--text-muted)", whiteSpace: "nowrap",
                    }}>
                        Departamento:
                    </span>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        style={{
                            padding: "0.4rem 1rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            outline: "none",
                            transition: "all 0.16s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    >
                        {DEPARTMENT_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ background: "#111" }}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ── Save Button ── */}
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.6rem 1.5rem",
                        borderRadius: "10px",
                        border: "none",
                        background: saved
                            ? "rgba(42,157,143,0.2)"
                            : !hasChanges
                                ? "rgba(255,255,255,0.05)"
                                : "var(--accent)",
                        color: saved ? "#2a9d8f" : "white",
                        fontSize: "0.85rem", fontWeight: 700,
                        cursor: saving || !hasChanges ? "not-allowed" : "pointer",
                        opacity: !hasChanges ? 0.5 : 1,
                        transition: "all 0.18s",
                        whiteSpace: "nowrap",
                    }}
                >
                    {saving
                        ? <Loader2 size={16} className="animate-spin" />
                        : saved
                            ? <CheckCircle2 size={16} />
                            : <Save size={16} />
                    }
                    {saving ? "Guardando…" : saved ? "Cambios Guardados" : "Guardar Cambios"}
                </button>

                {/* ── Delete Button (Only for ADMIN) ── */}
                {isAdmin && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.6rem 1.2rem",
                            borderRadius: "10px",
                            border: confirmDelete ? "1px solid var(--accent)" : "1px solid rgba(255,100,100,0.15)",
                            background: confirmDelete ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.02)",
                            color: confirmDelete ? "#ff3e4e" : "rgba(255,100,100,0.6)",
                            fontSize: "0.80rem", fontWeight: 700,
                            cursor: deleting ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                            marginLeft: "auto"
                        }}
                    >
                        {deleting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        {deleting ? "Borrando..." : confirmDelete ? "¿Estás seguro?" : "Eliminar Ticket"}
                    </button>
                )}
            </div>
        </div>
    );
}
