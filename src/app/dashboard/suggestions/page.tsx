"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Search, AlertCircle, CheckCircle2, Car, Loader2, ArrowRight } from "lucide-react";
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
                const models = await searchCatalogModels(searchQuery);
                setResults(models);
                setIsSearching(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plate) return;
        if (!selectedModel && !modelNotFound) {
            setMessage({ type: 'error', text: 'Por favor, selecciona un modelo o marca la casilla de "Modelo no encontrado".' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        const result = await createSuggestion({
            plate,
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
            setMessage({ type: 'error', text: result.error || 'Error al enviar la sugerencia' });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(255, 183, 3, 0.1)', borderRadius: '12px', color: '#ffb703' }}>
                        <Lightbulb size={24} />
                    </div>
                    <h1>Sugerir Vínculo</h1>
                </div>
                <p>Ayúdanos a mejorar PlateVault sugiriendo el modelo correcto para una matrícula.</p>
            </header>

            <div className={styles.accountWrapper}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {message && (
                        <div style={{
                            padding: '1.2rem',
                            borderRadius: '12px',
                            background: message.type === 'success' ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                            border: `1px solid ${message.type === 'success' ? '#2a9d8f' : '#e63946'}`,
                            color: message.type === 'success' ? '#2a9d8f' : '#e63946',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            fontWeight: 600
                        }}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    {/* Step 1: Plate */}
                    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--surface-border)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                            Introduce la Matrícula
                        </h3>
                        <input
                            type="text"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value.toUpperCase())}
                            placeholder="E.G. 1234ABC"
                            className={styles.searchBar}
                            style={{
                                width: '100%',
                                fontSize: '2rem',
                                textAlign: 'center',
                                letterSpacing: '2px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--surface-border)',
                                borderRadius: '12px',
                                padding: '1rem'
                            }}
                            required
                        />
                    </div>

                    {/* Step 2: Model Search */}
                    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--surface-border)' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                            Busca el Modelo en el Catálogo
                        </h3>

                        {!modelNotFound ? (
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Search style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Busca por marca o modelo (ej: BMW M3)"
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--surface-border)',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                    {isSearching && <Loader2 size={20} className="animate-spin" style={{ position: 'absolute', right: '1rem' }} />}
                                </div>

                                {results.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'var(--surface)',
                                        border: '1px solid var(--surface-border)',
                                        borderRadius: '12px',
                                        marginTop: '0.5rem',
                                        zIndex: 100,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}>
                                        {results.map(model => (
                                            <div
                                                key={model.id}
                                                onClick={() => {
                                                    setSelectedModel(model);
                                                    setResults([]);
                                                    setSearchQuery("");
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    transition: 'var(--transition-fast)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <p style={{ margin: 0, fontWeight: 700 }}>{model.make} {model.model}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {model.generation || ''} {model.trim || ''} ({model.yearStart || 'N/A'})
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {selectedModel && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1.5rem',
                                        background: 'rgba(42, 157, 143, 0.1)',
                                        border: '1px solid #2a9d8f',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: '#2a9d8f', fontWeight: 800, letterSpacing: '1px' }}>Modelo Seleccionado</p>
                                            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{selectedModel.make} {selectedModel.model}</p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedModel.generation} {selectedModel.trim}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedModel(null)}
                                            style={{ background: 'transparent', border: 'none', color: '#e63946', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(230, 57, 70, 0.05)',
                                border: '1px dotted var(--accent)',
                                borderRadius: '12px',
                                color: 'var(--text-muted)',
                                textAlign: 'center'
                            }}>
                                <p style={{ margin: 0, fontWeight: 600 }}>Has marcado que el modelo no está en nuestro catálogo.</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>Nuestro equipo administrativo revisará la matrícula y añadirá el modelo pertinente.</p>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(255, 183, 3, 0.05)',
                                borderLeft: '3px solid #ffb703',
                                borderRadius: '4px',
                                flex: 1
                            }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffecb3', fontWeight: 500 }}>
                                    <AlertCircle size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                                    Si no encuentras el modelo exacto en el catálogo, por favor marca la opción de abajo.
                                </p>
                            </div>
                        </div>

                        <label style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            cursor: 'pointer',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: modelNotFound ? 'rgba(255,255,255,0.05)' : 'transparent',
                            transition: 'var(--transition-fast)'
                        }}>
                            <input
                                type="checkbox"
                                checked={modelNotFound}
                                onChange={(e) => {
                                    setModelNotFound(e.target.checked);
                                    if (e.target.checked) setSelectedModel(null);
                                }}
                                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
                            />
                            <span style={{ fontWeight: 600 }}>El modelo no se encuentra en el catálogo</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || (!plate || (!selectedModel && !modelNotFound))}
                        className={styles.searchBar}
                        style={{
                            padding: '1.5rem',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            transition: 'var(--transition-normal)',
                            opacity: (isSubmitting || (!plate || (!selectedModel && !modelNotFound))) ? 0.6 : 1
                        }}
                    >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : (
                            <>
                                Enviar Sugerencia para Revisión <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
