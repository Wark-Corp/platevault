"use client";

import { useState } from "react";
import { createVehicleVersion } from "@/actions/catalog";
import styles from "../../admin.module.css";
import { useRouter } from "next/navigation";

export default function NewVehiclePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const specs = {
            engine: {
                fuel: formData.get("fuel"),
                power_cv: parseInt(formData.get("power_cv") as string),
                power_kw: parseInt(formData.get("power_kw") as string),
                displacement_cc: parseInt(formData.get("displacement_cc") as string),
                architecture: formData.get("architecture"),
                euro_norm: formData.get("euro_norm"),
            },
            dimensions: {
                length: parseFloat(formData.get("length") as string),
                width: parseFloat(formData.get("width") as string),
                height: parseFloat(formData.get("height") as string),
                wheelbase: parseFloat(formData.get("wheelbase") as string),
            },
            weights: {
                kerb_weight: parseInt(formData.get("kerb_weight") as string),
                max_weight: parseInt(formData.get("max_weight") as string),
            },
            wheels: {
                tires: formData.get("tires"),
                rims: formData.get("rims"),
            },
            emissions: {
                dgt_label: formData.get("dgt_label"),
            }
        };

        const data = {
            make: formData.get("make"),
            model: formData.get("model"),
            generation: formData.get("generation"),
            trim: formData.get("trim"),
            yearStart: formData.get("yearStart"),
            yearEnd: formData.get("yearEnd"),
            fuel: formData.get("fuel"),
            transmission: formData.get("transmission"),
            specs
        };

        const res = await createVehicleVersion(data);
        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/admin/catalog");
        }
    }

    return (
        <>
            <header className={styles.header}>
                <h1>Nuevo Vehículo</h1>
            </header>

            {error && <div className={styles.errorBox}>{error}</div>}

            <form action={handleSubmit}>
                <div className={styles.formGrid}>
                    {/* IDENTIFICACION */}
                    <div className={`${styles.formSection} glass`}>
                        <h3>Identificación</h3>
                        <div className={styles.inputGroup}>
                            <label>Marca</label>
                            <input name="make" required placeholder="Ej: SEAT" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Modelo</label>
                            <input name="model" required placeholder="Ej: León" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Generación</label>
                            <input name="generation" placeholder="Ej: MK4" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Acabado / Trim</label>
                            <input name="trim" placeholder="Ej: FR" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Año Inicio</label>
                                <input type="number" name="yearStart" placeholder="2020" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Año Fin</label>
                                <input type="number" name="yearEnd" placeholder="2024" />
                            </div>
                        </div>
                    </div>

                    {/* MOTOR */}
                    <div className={`${styles.formSection} glass`}>
                        <h3>Motor y Propulsión</h3>
                        <div className={styles.inputGroup}>
                            <label>Combustible</label>
                            <select name="fuel">
                                <option value="Gasolina">Gasolina</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hibrido">Híbrido</option>
                                <option value="Electrico">Eléctrico</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>CV</label>
                                <input type="number" name="power_cv" placeholder="150" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>kW</label>
                                <input type="number" name="power_kw" placeholder="110" />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Cilindrada (cc)</label>
                            <input type="number" name="displacement_cc" placeholder="1498" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Etiqueta DGT</label>
                            <select name="dgt_label">
                                <option value="0">0 Emisiones</option>
                                <option value="ECO">ECO</option>
                                <option value="C">C (Verde)</option>
                                <option value="B">B (Amarillo)</option>
                                <option value="A">A (Sin Etiqueta)</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Arquitectura</label>
                                <input name="architecture" placeholder="L4, V6, Eléctrico" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Normativa Euro</label>
                                <input name="euro_norm" placeholder="Euro 6d" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formGrid}>
                    {/* DIMENSIONES */}
                    <div className={`${styles.formSection} glass`}>
                        <h3>Dimensiones</h3>
                        <div className={styles.inputGroup}>
                            <label>Largo (m)</label>
                            <input type="number" step="0.01" name="length" placeholder="4.36" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Ancho (m)</label>
                            <input type="number" step="0.01" name="width" placeholder="1.80" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Alto (m)</label>
                            <input type="number" step="0.01" name="height" placeholder="1.45" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Batalla (m)</label>
                            <input type="number" step="0.01" name="wheelbase" placeholder="2.68" />
                        </div>
                    </div>

                    {/* PESOS Y RUEDAS */}
                    <div className={`${styles.formSection} glass`}>
                        <h3>Otros Detalles</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Peso en Vacío (kg)</label>
                                <input type="number" name="kerb_weight" placeholder="1300" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>MMA (Máx. kg)</label>
                                <input type="number" name="max_weight" placeholder="1800" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.inputGroup}>
                                <label>Neumáticos</label>
                                <input name="tires" placeholder="225/45 R17" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Llantas (Material)</label>
                                <input name="rims" placeholder="Aleación 17''" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className={styles.inputGroup}>
                                <label>Precio MSRP Aprox.</label>
                                <input name="msrp" placeholder="35.000 €" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Fuente (Datos)</label>
                                <input name="source" placeholder="km77, catálogo" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                        {loading ? "Guardando..." : "Crear Vehículo"}
                    </button>
                </div>
            </form >
        </>
    );
}
