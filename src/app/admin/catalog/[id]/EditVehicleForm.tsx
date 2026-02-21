"use client";

import { useState } from "react";
import { updateVehicleVersion } from "@/actions/catalog";
import styles from "../../admin.module.css";
import { useRouter } from "next/navigation";

export default function EditVehicleForm({ vehicle }: { vehicle: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Prepopulate values from JSON specs if available
    const specs = vehicle.specs || {};
    const engine = specs.engine || {};
    const dimensions = specs.dimensions || {};
    const weights = specs.weights || {};
    const wheels = specs.wheels || {};
    const emissions = specs.emissions || {};

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const newSpecs = {
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
            },
            pricing: {
                msrp: formData.get("msrp") || undefined,
                source: formData.get("source") || undefined,
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
            specs: newSpecs
        };

        const res = await updateVehicleVersion(vehicle.id, data);
        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/admin/catalog");
        }
    }

    return (
        <form action={handleSubmit}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.formGrid}>
                {/* IDENTIFICACION */}
                <div className={`${styles.formSection} glass`}>
                    <h3>Identificación</h3>
                    <div className={styles.inputGroup}>
                        <label>Marca</label>
                        <input name="make" required defaultValue={vehicle.make} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Modelo</label>
                        <input name="model" required defaultValue={vehicle.model} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Generación</label>
                        <input name="generation" defaultValue={vehicle.generation || ""} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Acabado / Trim</label>
                        <input name="trim" defaultValue={vehicle.trim || ""} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>Año Inicio</label>
                            <input type="number" name="yearStart" defaultValue={vehicle.yearStart || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Año Fin</label>
                            <input type="number" name="yearEnd" defaultValue={vehicle.yearEnd || ""} />
                        </div>
                    </div>
                </div>

                {/* MOTOR */}
                <div className={`${styles.formSection} glass`}>
                    <h3>Motor y Propulsión</h3>
                    <div className={styles.inputGroup}>
                        <label>Combustible</label>
                        <select name="fuel" defaultValue={vehicle.fuel || "Gasolina"}>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hibrido">Híbrido</option>
                            <option value="Electrico">Eléctrico</option>
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>CV</label>
                            <input type="number" name="power_cv" defaultValue={engine.power_cv || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>kW</label>
                            <input type="number" name="power_kw" defaultValue={engine.power_kw || ""} />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Cilindrada (cc)</label>
                        <input type="number" name="displacement_cc" defaultValue={engine.displacement_cc || ""} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Etiqueta DGT</label>
                        <select name="dgt_label" defaultValue={emissions.dgt_label || "A"}>
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
                            <input name="architecture" defaultValue={engine.architecture || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Normativa Euro</label>
                            <input name="euro_norm" defaultValue={engine.euro_norm || ""} />
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
                        <input type="number" step="0.01" name="length" defaultValue={dimensions.length || ""} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Ancho (m)</label>
                        <input type="number" step="0.01" name="width" defaultValue={dimensions.width || ""} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Alto (m)</label>
                        <input type="number" step="0.01" name="height" defaultValue={dimensions.height || ""} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Batalla (m)</label>
                        <input type="number" step="0.01" name="wheelbase" defaultValue={dimensions.wheelbase || ""} />
                    </div>
                </div>

                {/* PESOS Y RUEDAS */}
                <div className={`${styles.formSection} glass`}>
                    <h3>Otros Detalles</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>Peso en Vacío (kg)</label>
                            <input type="number" name="kerb_weight" defaultValue={weights.kerb_weight || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>MMA (Máx. kg)</label>
                            <input type="number" name="max_weight" defaultValue={weights.max_weight || ""} />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.inputGroup}>
                            <label>Neumáticos</label>
                            <input name="tires" defaultValue={wheels.tires || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Llantas (Material)</label>
                            <input name="rims" defaultValue={wheels.rims || ""} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className={styles.inputGroup}>
                            <label>Precio MSRP Aprox.</label>
                            <input name="msrp" defaultValue={specs.pricing?.msrp || ""} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Fuente (Datos)</label>
                            <input name="source" defaultValue={specs.pricing?.source || ""} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                    {loading ? "Actualizando..." : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}
