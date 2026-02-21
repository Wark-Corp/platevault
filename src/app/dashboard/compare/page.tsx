"use client";
import React, { useState, useEffect } from "react";
import styles from "../dashboard.module.css";
import { getVersionsByIds } from "@/actions/favorites";
import { X, ArrowLeftRight, Gauge, Zap, Settings, Maximize, Scale, Disc, Trash2, Info } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadVehicles = async () => {
        const list = JSON.parse(localStorage.getItem("pv_compare_list") || "[]");
        if (list.length === 0) {
            setVehicles([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getVersionsByIds(list);
            // Parse specs JSON
            const parsed = data.map(v => ({
                ...v,
                specs: v.specs as any
            }));
            setVehicles(parsed);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const removeFromCompare = (id: string) => {
        const list = JSON.parse(localStorage.getItem("pv_compare_list") || "[]");
        const newList = list.filter((item: string) => item !== id);
        localStorage.setItem("pv_compare_list", JSON.stringify(newList));
        loadVehicles();
    };

    if (loading) return <div className={styles.main}>Cargando comparador...</div>;

    const specsGroups = [
        {
            title: "Motor y Rendimiento",
            icon: <Zap size={18} />,
            keys: [
                { label: "Combustible", path: "engine.fuel" },
                { label: "Potencia (CV)", path: "engine.power_cv" },
                { label: "Cilindrada", path: "engine.displacement_cc" },
                { label: "Arquitectura", path: "engine.architecture" },
                { label: "Normativa", path: "engine.euro_norm" }
            ]
        },
        {
            title: "Dimensiones",
            icon: <Maximize size={18} />,
            keys: [
                { label: "Longitud (m)", path: "dimensions.length" },
                { label: "Anchura (m)", path: "dimensions.width" },
                { label: "Altura (m)", path: "dimensions.height" },
                { label: "Batalla (m)", path: "dimensions.wheelbase" }
            ]
        },
        {
            title: "Pesos",
            icon: <Scale size={18} />,
            keys: [
                { label: "Peso Vacío (kg)", path: "weights.kerb_weight" },
                { label: "MMA (kg)", path: "weights.max_weight" }
            ]
        }
    ];

    const getValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1>Comparador Técnico</h1>
                    <span className="badge" style={{ background: 'var(--accent)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {vehicles.length} seleccionado(s)
                    </span>
                </div>
                <p>Análisis side-by-side de especificaciones técnicas.</p>
            </header>

            <div style={{ marginTop: '3rem' }}>
                {vehicles.length === 0 ? (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '20px' }}>
                        <ArrowLeftRight size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>Tu lista de comparación está vacía</h3>
                        <p>Añade vehículos desde sus fichas técnicas para compararlos aquí.</p>
                        <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '1.5rem' }}>
                            Volver al buscador
                        </Link>
                    </div>
                ) : (
                    <div className={styles.compareTableWrapper}>
                        <table className={styles.compareTable}>
                            <thead>
                                <tr>
                                    <th className={styles.stickyCol}>Especificación</th>
                                    {vehicles.map(v => (
                                        <th key={v.id} style={{ verticalAlign: 'top' }}>
                                            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', position: 'relative', textAlign: 'center', border: '1px solid var(--accent)' }}>
                                                <button
                                                    onClick={() => removeFromCompare(v.id)}
                                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <h3 style={{ margin: '0 0 0.5rem 0' }}>{v.make}</h3>
                                                <p style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>{v.model}</p>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>{v.trim || 'Versión Base'}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specsGroups.map(group => (
                                    <React.Fragment key={group.title}>
                                        <tr>
                                            <td colSpan={vehicles.length + 1} style={{ padding: '2rem 1rem 1rem 1rem', background: 'transparent' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                                                    {group.icon} {group.title}
                                                </div>
                                            </td>
                                        </tr>
                                        {group.keys.map(key => (
                                            <tr key={key.label}>
                                                <td className={styles.stickyCol} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    {key.label}
                                                </td>
                                                {vehicles.map(v => (
                                                    <td key={v.id} style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                                                        {getValue(v.specs, key.path) || "-"}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Info size={24} style={{ color: 'var(--accent)' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                    Las comparaciones se basan en los datos técnicos oficiales registrados en PlateVault. Ten en cuenta que algunas variantes pueden tener equipamiento opcional que modifique ligeramente los pesos o consumos reales.
                </p>
            </div>
        </>
    );
}
