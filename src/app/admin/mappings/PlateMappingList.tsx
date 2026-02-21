"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { getPlateMappings, unmapPlate, updatePlateMapping } from "@/actions/mappings";
import { getVehicleVersions } from "@/actions/catalog";
import { Search, Trash2, Edit2, Check, X, Loader2, ChevronLeft, ChevronRight, Car } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PlateMappingList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q") || "";
    const p = parseInt(searchParams.get("p") || "1");

    const [mappings, setMappings] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(q);

    // Para la edición de modelo
    const [editSearch, setEditSearch] = useState("");
    const [editResults, setEditResults] = useState<any[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<any>(null);
    const [isSearchingVersions, setIsSearchingVersions] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getPlateMappings(q, p, 10);
            setMappings(data.mappings);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [q, p]);

    // Búsqueda de modelos para reasignación
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (editSearch.length < 2) {
                setEditResults([]);
                return;
            }
            setIsSearchingVersions(true);
            try {
                const { versions } = await getVehicleVersions(editSearch, 1, 5);
                setEditResults(versions);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearchingVersions(false);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [editSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/mappings?q=${searchQuery}&p=1`);
    };

    const handleUnlink = async (id: string, plate: string) => {
        if (!confirm(`¿Estás seguro de que deseas desvincular la matrícula ${plate}?`)) return;
        const res = await unmapPlate(id);
        if (res.success) {
            fetchData();
        } else {
            alert(res.error);
        }
    };

    const handleSaveUpdate = async (id: string) => {
        if (!selectedVersion) return;
        setLoading(true);
        const res = await updatePlateMapping(id, selectedVersion.id);
        if (res.success) {
            setEditingId(null);
            setSelectedVersion(null);
            setEditSearch("");
            fetchData();
        } else {
            alert(res.error);
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Gestión de Vínculos ({total})</h2>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Matrícula, marca o modelo..."
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.4rem 0.8rem', outline: 'none', width: '220px' }}
                    />
                    <button type="submit" style={{ background: 'var(--accent)', border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer' }}>
                        <Search size={16} />
                    </button>
                </form>
            </div>

            <div className={`${styles.tableWrapper} glass`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Vehículo Vinculado</th>
                            <th>Última Actualización</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                    <Loader2 className="spin" size={24} style={{ opacity: 0.5 }} />
                                </td>
                            </tr>
                        ) : mappings.map((m) => (
                            <tr key={m.id}>
                                <td style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px' }}>{m.plate}</td>
                                <td>
                                    {editingId === m.id ? (
                                        <div style={{ position: 'relative', width: '300px' }}>
                                            {selectedVersion ? (
                                                <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,183,3,0.1)', border: '1px solid #ffb703', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedVersion.make} {selectedVersion.model}</span>
                                                    <button onClick={() => setSelectedVersion(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        autoFocus
                                                        value={editSearch}
                                                        onChange={e => setEditSearch(e.target.value)}
                                                        placeholder="Buscar nuevo modelo..."
                                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', width: '100%', borderRadius: '6px' }}
                                                    />
                                                    {isSearchingVersions && <Loader2 className="spin" size={14} style={{ position: 'absolute', right: '10px', top: '10px', opacity: 0.5 }} />}

                                                    {editResults.length > 0 && (
                                                        <div className="glass" style={{ position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 10, borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                                                            {editResults.map(v => (
                                                                <div key={v.id} onClick={() => { setSelectedVersion(v); setEditResults([]); }} style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }} className={styles.searchResultItem}>
                                                                    <strong>{v.make} {v.model}</strong>
                                                                    <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>{v.yearStart}-{v.yearEnd || 'Act'} | {v.fuel}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{m.version.make} {m.version.model}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.version.trim || m.version.generation} | {m.version.yearStart}-{m.version.yearEnd || 'Act'}</div>
                                        </div>
                                    )}
                                </td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(m.lastUpdated).toLocaleDateString()}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                                        {editingId === m.id ? (
                                            <>
                                                <button onClick={() => handleSaveUpdate(m.id)} disabled={!selectedVersion} className={styles.btn} style={{ padding: '0.4rem', background: '#2a9d8f' }} title="Guardar">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => { setEditingId(null); setSelectedVersion(null); }} className={styles.btn} style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.1)' }} title="Cancelar">
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setEditingId(m.id)} className={styles.btn} style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)' }} title="Cambiar Modelo">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleUnlink(m.id, m.plate)} className={styles.btn} style={{ padding: '0.4rem', background: 'rgba(230, 57, 70, 0.1)', color: '#e63946' }} title="Desvincular">
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && mappings.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No se encontraron vinculaciones.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Página {p} de {totalPages}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            disabled={p <= 1}
                            onClick={() => router.push(`/admin/mappings?q=${q}&p=${p - 1}`)}
                            className={styles.btn}
                            style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', opacity: p <= 1 ? 0.3 : 1 }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={p >= totalPages}
                            onClick={() => router.push(`/admin/mappings?q=${q}&p=${p + 1}`)}
                            className={styles.btn}
                            style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', opacity: p >= totalPages ? 0.3 : 1 }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
