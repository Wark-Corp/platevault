"use client";

import { useEffect, useState } from "react";
import { getPendingSuggestions, approveSuggestion, rejectSuggestion, searchCatalogModels } from "@/actions/suggestions";
import { ClipboardList, Check, X, Search, AlertCircle, Loader2, Edit3, Car } from "lucide-react";
import styles from "../admin.module.css";

export default function AdminSuggestionsPage() {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Approval modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);
    const [catalogSearch, setCatalogSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [finalVersion, setFinalVersion] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [searchingCatalog, setSearchingCatalog] = useState(false);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        try {
            const data = await getPendingSuggestions();
            setSuggestions(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // Catalog search debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (catalogSearch.length >= 2) {
                setSearchingCatalog(true);
                const results = await searchCatalogModels(catalogSearch);
                setSearchResults(results);
                setSearchingCatalog(false);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [catalogSearch]);

    const handleApprove = async () => {
        if (!currentSuggestion || !finalVersion) return;
        setActionLoading(currentSuggestion.id);

        const res = await approveSuggestion(currentSuggestion.id, finalVersion.id, adminNote);
        if (res.success) {
            setIsModalOpen(false);
            loadSuggestions();
        } else {
            alert(res.error);
        }
        setActionLoading(null);
    };

    const handleReject = async (id: string) => {
        const note = prompt("Motivo del rechazo (opcional):");
        if (note === null) return;

        setActionLoading(id);
        const res = await rejectSuggestion(id, note);
        if (res.success) {
            loadSuggestions();
        } else {
            alert(res.error);
        }
        setActionLoading(null);
    };

    const openApproveModal = (s: any) => {
        setCurrentSuggestion(s);
        setFinalVersion(s.version || null);
        setCatalogSearch("");
        setAdminNote("");
        setIsModalOpen(true);
    };

    if (loading) return <div className={styles.loadingWrapper}><Loader2 className="animate-spin" /></div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header}>
                <div>
                    <h1>Revisión de Sugerencias</h1>
                    <p>Gestiona y aprueba los vínculos de matrículas sugeridos por la comunidad.</p>
                </div>
            </header>

            <div className={styles.tableWrapper} style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Matrícula</th>
                            <th>Modelo Sugerido</th>
                            <th>Estado Origen</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suggestions.map((s) => (
                            <tr key={s.id}>
                                <td>
                                    <p style={{ margin: 0, fontWeight: 700 }}>{s.user.name || 'Usuario'}</p>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.user.email}</p>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '4px',
                                        fontWeight: 800,
                                        fontFamily: 'monospace',
                                        letterSpacing: '1px'
                                    }}>
                                        {s.plate}
                                    </span>
                                </td>
                                <td>
                                    {s.version ? (
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{s.version.make} {s.version.model}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.version.generation}</p>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.8rem' }}>MODELO NO ENCONTRADO</span>
                                    )}
                                </td>
                                <td>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: s.modelNotFound ? 'rgba(230, 57, 70, 0.1)' : 'rgba(42, 157, 143, 0.1)',
                                        color: s.modelNotFound ? '#e63946' : '#2a9d8f'
                                    }}>
                                        {s.modelNotFound ? "DIFÍCIL" : "CON MODELO"}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(s.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => openApproveModal(s)}
                                            className={styles.actionBtn}
                                            style={{ background: 'rgba(42, 157, 143, 0.1)', color: '#2a9d8f' }}
                                            disabled={actionLoading === s.id}
                                        >
                                            {actionLoading === s.id ? <Loader2 size={16} className="animate-spin" /> : <Edit3 size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleReject(s.id)}
                                            className={styles.actionBtn}
                                            style={{ background: 'rgba(230, 57, 70, 0.1)', color: '#e63946' }}
                                            disabled={actionLoading === s.id}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {suggestions.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontStyle: 'italic' }}>No hay sugerencias pendientes</p>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {isModalOpen && currentSuggestion && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                    padding: '2rem'
                }}>
                    <div className="animate-in fade-in zoom-in duration-300" style={{
                        background: 'var(--surface)', border: '1px solid var(--surface-border)',
                        width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '2.5rem',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Check style={{ color: '#2a9d8f' }} /> Aprobar Sugerencia
                        </h2>

                        <div style={{ marginBottom: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Matrícula:</span>
                                <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{currentSuggestion.plate}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Usuario:</span>
                                <span style={{ fontWeight: 600 }}>{currentSuggestion.user.email}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Modelo Final (Corregir si es necesario)</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Search style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={18} />
                                    <input
                                        type="text"
                                        value={catalogSearch}
                                        onChange={(e) => setCatalogSearch(e.target.value)}
                                        placeholder="Buscar en el catálogo..."
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem',
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)',
                                            borderRadius: '12px', color: 'white', outline: 'none'
                                        }}
                                    />
                                    {searchingCatalog && <Loader2 size={18} className="animate-spin" style={{ position: 'absolute', right: '1rem' }} />}
                                </div>

                                {searchResults.length > 0 && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        background: 'var(--surface)', border: '1px solid var(--surface-border)',
                                        borderRadius: '12px', marginTop: '0.4rem', zIndex: 100,
                                        maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                                    }}>
                                        {searchResults.map(m => (
                                            <div key={m.id} onClick={() => { setFinalVersion(m); setSearchResults([]); }}
                                                style={{ padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{m.make} {m.model}</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.generation} {m.trim}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {finalVersion && (
                            <div style={{
                                marginBottom: '2rem', padding: '1rem', background: 'rgba(42, 157, 143, 0.05)',
                                border: '1px solid #2a9d8f', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem'
                            }}>
                                <Car style={{ color: '#2a9d8f' }} />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700 }}>{finalVersion.make} {finalVersion.model}</p>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{finalVersion.generation} {finalVersion.trim}</p>
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nota Administrativa (Opcional)</label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                style={{
                                    width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--surface-border)', borderRadius: '12px',
                                    color: 'white', resize: 'none', height: '80px', outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleApprove}
                            disabled={!finalVersion || actionLoading === currentSuggestion.id}
                            style={{
                                width: '100%', padding: '1.2rem', background: 'var(--accent)',
                                color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
                                opacity: (!finalVersion || actionLoading === currentSuggestion.id) ? 0.6 : 1
                            }}
                        >
                            {actionLoading === currentSuggestion.id ? <Loader2 className="animate-spin" /> : "Confirmar y Vincular Matrícula"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
