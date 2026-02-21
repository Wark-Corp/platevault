"use client";

import { useState, useEffect } from "react";
import styles from "../admin.module.css";
import { mapPlateToVersion, getVehicleVersions } from "@/actions/catalog";
import { Search, Loader2, Check } from "lucide-react";

export default function MappingForm() {
    const [plate, setPlate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Búsqueda en tiempo real con Debounce
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const { versions } = await getVehicleVersions(searchQuery, 1, 10);
                setSearchResults(versions);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plate || !selectedVersion) return;

        setLoading(true);
        const res = await mapPlateToVersion(plate.toUpperCase(), selectedVersion.id);
        if (res.error) {
            setMessage({ text: res.error, type: "error" });
        } else {
            setMessage({ text: `Matrícula ${plate.toUpperCase()} vinculada a ${selectedVersion.make} ${selectedVersion.model} con éxito.`, type: "success" });
            setPlate(""); // Reset form
            setSelectedVersion(null);
            setSearchQuery("");
        }
        setLoading(false);
    };

    return (
        <div className={`glass ${styles.formSection}`} style={{ maxWidth: '700px' }}>
            {message.text && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    background: message.type === "success" ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                    color: message.type === "success" ? '#2a9d8f' : '#e63946',
                    border: `1px solid ${message.type === "success" ? '#2a9d8f' : '#e63946'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className={styles.inputGroup}>
                        <label>Matrícula (Input Manual)</label>
                        <input
                            required
                            value={plate}
                            onChange={e => setPlate(e.target.value.toUpperCase())}
                            placeholder="1234ABC"
                            style={{ textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 'bold' }}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Buscador de Modelo Técnico</label>
                        <div style={{ position: 'relative' }}>
                            {selectedVersion ? (
                                <div style={{
                                    padding: '0.6rem 1rem',
                                    background: 'rgba(230, 57, 70, 0.15)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid var(--accent)'
                                }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                        {selectedVersion.make} {selectedVersion.model} ({selectedVersion.yearStart}-{selectedVersion.yearEnd || 'Act'})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedVersion(null)}
                                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Escribe marca o modelo..."
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                                        {isSearching ? <Loader2 className={styles.spin} size={16} /> : <Search size={16} />}
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="glass" style={{
                                            position: 'absolute',
                                            top: '110%',
                                            left: 0,
                                            right: 0,
                                            zIndex: 100,
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {searchResults.map(v => (
                                                <div
                                                    key={v.id}
                                                    onClick={() => {
                                                        setSelectedVersion(v);
                                                        setSearchResults([]);
                                                    }}
                                                    style={{
                                                        padding: '0.8rem 1rem',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    className={styles.searchResultItem} // We'll add this to CSS
                                                >
                                                    <div style={{ fontWeight: 600 }}>{v.make} {v.model}</div>
                                                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{v.trim || v.generation} | {v.fuel} | {v.yearStart}-{v.yearEnd || 'Act'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading || !selectedVersion || !plate}>
                        {loading ? <Loader2 className={styles.spin} size={16} /> : <Check size={16} style={{ marginRight: '0.5rem' }} />}
                        {loading ? "Sincronizando..." : "Vincular Matrícula"}
                    </button>
                </div>
            </form>
        </div>
    );
}
