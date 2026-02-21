"use client";

import { useState, useEffect } from "react";
import styles from "./results.module.css";
import { VehicleSpecs } from "@/actions/lookup";
import {
    Zap,
    Gauge,
    Settings,
    Maximize,
    Scale,
    Disc,
    TrendingUp,
    Star,
    ArrowLeftRight,
    Info,
    CheckCircle2
} from "lucide-react";
import { toggleFavorite, isFavorite } from "@/actions/favorites";

interface Props {
    specs: VehicleSpecs;
    plate?: string;
    versionId?: string;
}

export default function TechnicalSheet({ specs, plate, versionId }: Props) {
    const [isFav, setIsFav] = useState(false);
    const [isCompare, setIsCompare] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);

    useEffect(() => {
        if (versionId) {
            isFavorite(versionId, plate).then(setIsFav);

            // Verificación de comparador
            const list = JSON.parse(localStorage.getItem("pv_compare_list") || "[]");
            setIsCompare(list.includes(versionId));
        }
    }, [versionId, plate]);

    const handleToggleFavorite = async () => {
        if (!versionId) return;
        setLoadingFav(true);
        const res = await toggleFavorite(versionId, plate);
        if (res.success) {
            setIsFav(res.action === "added");
        }
        setLoadingFav(false);
    };

    const handleToggleCompare = () => {
        if (!versionId) return;
        const list = JSON.parse(localStorage.getItem("pv_compare_list") || "[]");
        let newList;
        if (list.includes(versionId)) {
            newList = list.filter((id: string) => id !== versionId);
            setIsCompare(false);
        } else {
            if (list.length >= 3) {
                alert("Máximo 3 vehículos para comparar.");
                return;
            }
            newList = [...list, versionId];
            setIsCompare(true);
        }
        localStorage.setItem("pv_compare_list", JSON.stringify(newList));
    };

    // Cálculos para barras de progreso (Normalizados 0-100)
    const powerPercent = Math.min((specs.engine.power_cv / 600) * 100, 100);
    const displacementPercent = Math.min((specs.engine.displacement_cc / 5000) * 100, 100);

    return (
        <div className={styles.sheet}>
            <header className={styles.header}>
                <div className={styles.mainTitle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <h2>
                            {specs.make} {specs.model}
                            <span className={styles.yearHighlight}>
                                {" "}({(specs as any).yearStart || specs.year}{((specs as any).yearEnd || (specs as any).yearStart) ? `-${(specs as any).yearEnd || 'Act'}` : ''})
                            </span>
                        </h2>
                        {specs.pricing?.source?.includes("External") && (
                            <span style={{
                                background: 'rgba(255, 183, 3, 0.2)',
                                color: '#ffb703',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '1px solid rgba(255, 183, 3, 0.3)',
                                letterSpacing: '0.5px'
                            }}>
                                API EXTERNA
                            </span>
                        )}
                    </div>
                    <div className={styles.titleActions}>
                        <span className={styles.badge}>{specs.trim || "Versión Base"}</span>
                        {specs.generation && <span className={styles.badge}>{specs.generation}</span>}
                    </div>
                </div>

                <div className={styles.labelWrapper}>
                    <div className={`${styles.dgtLabel} ${styles["label-" + specs.emissions.dgt_label]}`}>
                        Etiqueta {specs.emissions.dgt_label}
                    </div>
                </div>
            </header>

            <div className={styles.actionsBar}>
                <button
                    className={`${styles.actionBtn} ${isFav ? styles.actionBtnActive : ""}`}
                    onClick={handleToggleFavorite}
                    disabled={loadingFav || !versionId}
                >
                    <Star size={18} fill={isFav ? "white" : "none"} />
                    {isFav ? "En Favoritos" : "Guardar Favorito"}
                </button>
                <button
                    className={`${styles.actionBtn} ${isCompare ? styles.actionBtnActive : ""}`}
                    onClick={handleToggleCompare}
                    disabled={!versionId || (plate?.startsWith("ext_") ?? false)}
                >
                    <ArrowLeftRight size={18} />
                    {isCompare ? "En Comparador" : "Comparar"}
                </button>
            </div>

            <div className={styles.grid}>
                {/* Identificación */}
                <section className={`${styles.section} glass`}>
                    <h3><Settings size={18} /> Motorización</h3>

                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span><TrendingUp size={16} /> Potencia Máxima</span>
                            <strong>{specs.engine.power_cv} CV</strong>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.progressBar} style={{ width: `${powerPercent}%` }} />
                        </div>
                        <small style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '2px' }}>{specs.engine.power_kw} kW</small>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span><Zap size={16} /> Cilindrada</span>
                            <strong>{specs.engine.displacement_cc} cc</strong>
                        </div>
                        <div className={`${styles.progressTrack} ${styles.blueBar}`}>
                            <div className={styles.progressBar} style={{ width: `${displacementPercent}%` }} />
                        </div>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Combustible</span> <strong>{specs.engine.fuel}</strong>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Arquitectura</span> <strong>{specs.engine.architecture}</strong>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Normativa</span> <strong>{specs.engine.euro_norm}</strong>
                        </div>
                    </div>
                </section>

                {/* Dimensiones */}
                <section className={`${styles.section} glass`}>
                    <h3><Maximize size={18} /> Dimensiones y Capacidad</h3>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Largo / Ancho / Alto</span>
                            <strong>{specs.dimensions.length?.toFixed(2) || "-"}m / {specs.dimensions.width?.toFixed(2) || "-"}m / {specs.dimensions.height?.toFixed(2) || "-"}m</strong>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Batalla (Ejes)</span> <strong>{specs.dimensions.wheelbase?.toFixed(2) || "-"}m</strong>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span><Scale size={16} /> Peso en Vacío</span> <strong>{specs.weights.kerb_weight} kg</strong>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>MMA (Máximo)</span> <strong>{specs.weights.max_weight} kg</strong>
                        </div>
                    </div>
                </section>

                {/* Ruedas */}
                <section className={`${styles.section} glass`}>
                    <h3><Disc size={18} /> Tren de Rodaje</h3>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Medidas Neumáticos</span> <strong>{specs.wheels.tires}</strong>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.itemLabel}>
                            <span>Tipo de Llantas</span> <strong>{specs.wheels.rims}</strong>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#2a9d8f', fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} /> Verificado por PlateVault Technical Team
                    </div>
                </section>

                {/* Precio Referencia */}
                {specs.pricing && (
                    <section className={`${styles.section} glass ${styles.pricing}`}>
                        <h3><TrendingUp size={18} /> Valor de Mercado</h3>
                        <div className={styles.msrpValue}>{specs.pricing.msrp}</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Valor de referencia para vehículo nuevo en fecha de lanzamiento.</p>
                        <p className={styles.source}><Info size={12} style={{ marginRight: '4px' }} /> Fuente: {specs.pricing.source}</p>
                    </section>
                )}
            </div>

            <p className={styles.disclaimer}>
                * Los datos mostrados corresponden a la versión técnica identificada y pueden variar según equipamiento opcional. PlateVault utiliza algoritmos de matching avanzados para garantizar la precisión de los datos.
            </p>
        </div>
    );
}

