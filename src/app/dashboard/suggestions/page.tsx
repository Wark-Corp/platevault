"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Search, AlertCircle, CheckCircle2, Car, Loader2, ArrowRight, Info } from "lucide-react";
import { createSuggestion, searchCatalogModels } from "@/actions/suggestions";
import styles from "../dashboard.module.css";

export default function SuggestionsPage() {
    const [plate, setPlate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [modelNotFound, setModelNotFound] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const models = await searchCatalogModels(searchQuery);
                    setResults(models);
                } catch (e) {
                    console.error("Search failed:", e);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanPlate = plate.toUpperCase().replace(/\s/g, "");
        if (!cleanPlate || cleanPlate.length < 5) {
            setMessage({ type: 'error', text: 'Por favor, introduce una matrícula válida.' });
            return;
        }

        if (!selectedModel && !modelNotFound) {
            setMessage({ type: 'error', text: 'Selecciona un modelo o indica que no se encuentra en el catálogo.' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const result = await createSuggestion({
                plate: cleanPlate,
                versionId: selectedModel?.id,
                modelNotFound
            });

            if (result.success) {
                setMessage({ type: 'success', text: result.success });
                setPlate("");
                setSearchQuery("");
                setSelectedModel(null);
                setModelNotFound(false);
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al procesar la sugerencia.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header}>
                <h1>Sugerir Vínculo</h1>
                <p>Ayúdanos a mejorar PlateVault vinculando matrículas con sus modelos exactos.</p>
            </header>

            <div className={styles.searchSection} style={{ maxWidth: '900px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    {message && (
                        <div className="animate-in zoom-in duration-300" style={{
                            padding: '1.2rem',
                            borderRadius: '16px',
                            background: message.type === 'success' ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                            border: `1px solid ${message.type === 'success' ? '#2a9d8f' : '#e63946'}`,
                            backdropFilter: 'blur(10px)',
                            color: message.type === 'success' ? '#2a9d8f' : '#e63946',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontWeight: 600,
                            boxShadow: `0 10px 40px ${message.type === 'success' ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)'}`
                        }}>
                            {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            {message.text}
                        </div>
                    )}

                    {/* Stage 1: Plate with Premium Design */}
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <span style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                background: 'var(--accent)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', fontWeight: 800,
                                boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)'
                            }}>1</span>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Identifica la Matrícula</h3>
                        </div>

                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <input
                                type="text"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                                placeholder="1234ABC"
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    fontSize: '2.8rem',
                                    textAlign: 'center',
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    letterSpacing: '4px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '2px solid var(--surface-border)',
                                    borderRadius: '16px',
                                    padding: '1.2rem',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
                                required
                            />
                        </div>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.85rem' }}>
                            Introduce la matrícula tal cual aparece en el vehículo.
                        </p>
                    </div>

                    {/* Stage 2: Model Search with Enhanced UI */}
                    <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <span style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                background: 'var(--accent)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.9rem', fontWeight: 800,
                                boxShadow: '0 4px 15px rgba(230, 57, 70, 0.4)'
                            }}>2</span>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Asigna el Modelo Técnico</h3>
                        </div>

                        {!modelNotFound ? (
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--surface-border)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    padding: '0.2rem'
                                }}>
                                    <Search style={{ marginLeft: '1.2rem', color: 'var(--text-muted)' }} size={22} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Busca Marca y Modelo (ej: BMW M3 E92)"
                                        style={{
                                            width: '100%',
                                            padding: '1.2rem',
                                            paddingLeft: '0.8rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            outline: 'none',
                                            fontWeight: 500
                                        }}
                                    />
                                    {isSearching && <Loader2 size={24} className="animate-spin" style={{ marginRight: '1.5rem', color: 'var(--accent)' }} />}
                                </div>

                                {results.length > 0 && !selectedModel && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 10px)',
                                        left: 0,
                                        right: 0,
                                        background: 'var(--surface)',
                                        border: '1px solid var(--surface-border)',
                                        borderRadius: '16px',
                                        zIndex: 100,
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                                        maxHeight: '350px',
                                        overflowY: 'auto',
                                        backdropFilter: 'blur(20px)',
                                        overflowX: 'hidden'
                                    }}>
                                        {results.map(model => (
                                            <div
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model);
                                                    setResults([]);
                                                    setSearchQuery("");
                                                }}
                                                className={styles.suggestionItem}
                                                style={{
                                                    padding: '1.2rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem'
                                                }}
                                            >
                                                <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                                    <Car size={20} style={{ color: 'var(--text-muted)' }} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{model.make} {model.model}</p>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        {model.generation || ''} {model.trim || ''} • {model.yearStart || 'Año N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedModel && (
                                    <div className="animate-in slide-in-from-top-2 duration-300" style={{
                                        marginTop: '1.5rem',
                                        padding: '1.8rem',
                                        background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.1), rgba(42, 157, 143, 0.05))',
                                        border: '1px solid rgba(42, 157, 143, 0.3)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        boxShadow: '0 10px 30px rgba(42, 157, 143, 0.1)'
                                    }}>
                                        <div style={{ padding: '1rem', background: 'rgba(42, 157, 143, 0.2)', borderRadius: '14px', color: '#2a9d8f' }}>
                                            <Car size={28} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: '#2a9d8f', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '0.3rem' }}>Modelo Vinculado</p>
                                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{selectedModel.make} {selectedModel.model}</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{selectedModel.generation} {selectedModel.trim}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedModel(null)}
                                            style={{
                                                background: 'rgba(230, 57, 70, 0.1)',
                                                border: '1px solid rgba(230, 57, 70, 0.2)',
                                                color: '#e63946',
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(230, 57, 70, 0.2)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(230, 57, 70, 0.1)'}
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500" style={{
                                padding: '2rem',
                                background: 'rgba(255, 183, 3, 0.02)',
                                border: '1px dashed rgba(255, 183, 3, 0.3)',
                                borderRadius: '20px',
                                color: 'var(--text-muted)',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{ padding: '1rem', background: 'rgba(255, 183, 3, 0.1)', borderRadius: '50%', color: '#ffb703' }}>
                                    <Search size={32} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#ffb703' }}>Búsqueda Manual Admin</p>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '400px' }}>
                                        Has marcado que el modelo no existe en el catálogo. Nuestros especialistas investigarán esta matrícula manualmente para encontrar el modelo exacto.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderLeft: '4px solid var(--accent)',
                                borderRadius: '8px',
                                flex: 1,
                                minWidth: '300px'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Info size={18} style={{ color: 'var(--accent)' }} />
                                    <span>¿No encuentras el modelo? Marca la casilla para que un experto lo revise.</span>
                                </p>
                            </div>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                padding: '1rem 1.5rem',
                                borderRadius: '16px',
                                background: modelNotFound ? 'rgba(230, 57, 70, 0.1)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${modelNotFound ? 'rgba(230, 57, 70, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: modelNotFound ? '0 10px 30px rgba(230, 57, 70, 0.15)' : 'none'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: '2px solid var(--surface-border)',
                                    background: modelNotFound ? 'var(--accent)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    color: 'white'
                                }}>
                                    {modelNotFound && <CheckCircle2 size={16} />}
                                    <input
                                        type="checkbox"
                                        checked={modelNotFound}
                                        onChange={(e) => {
                                            setModelNotFound(e.target.checked);
                                            if (e.target.checked) setSelectedModel(null);
                                        }}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Modelo no disponible en catálogo</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || (!plate || (!selectedModel && !modelNotFound))}
                        style={{
                            padding: '1.5rem',
                            background: (isSubmitting || (!plate || (!selectedModel && !modelNotFound)))
                                ? 'rgba(255,255,255,0.05)'
                                : 'linear-gradient(135deg, var(--accent), #d62828)',
                            color: (isSubmitting || (!plate || (!selectedModel && !modelNotFound))) ? 'var(--text-muted)' : 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontWeight: 900,
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: (isSubmitting || (!plate || (!selectedModel && !modelNotFound)))
                                ? 'none'
                                : '0 15px 45px rgba(230, 57, 70, 0.4)',
                            transform: (!isSubmitting && plate && (selectedModel || modelNotFound)) ? 'scale(1)' : 'scale(0.98)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isSubmitting && plate && (selectedModel || modelNotFound)) {
                                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 60px rgba(230, 57, 70, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSubmitting && plate && (selectedModel || modelNotFound)) {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 15px 45px rgba(230, 57, 70, 0.4)';
                            }
                        }}
                    >
                        {isSubmitting ? <Loader2 size={32} className="animate-spin" /> : (
                            <>
                                Enviar Sugerencia <ArrowRight size={24} />
                            </>
                        )}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.6 }}>
                        Al enviar, un administrador revisará los datos. Se te notificará cuando el vínculo sea verificado.
                    </p>
                </form>
            </div>
        </div>
    );
}
