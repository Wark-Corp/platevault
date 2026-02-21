"use client";

import { useState } from "react";
import { updateUser } from "@/actions/admin";
import styles from "../../admin.module.css";
import { useRouter } from "next/navigation";

export default function EditUserForm({ user }: { user: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            password: formData.get("password") || undefined,
        };

        const res = await updateUser(user.id, data);
        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/admin/users");
        }
    }

    return (
        <form action={handleSubmit} className="glass" style={{ padding: '2.5rem', borderRadius: '12px', maxWidth: '800px' }}>
            {error && <div style={{ color: '#e63946', background: 'rgba(230, 57, 70, 0.1)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(230, 57, 70, 0.2)', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--accent)' }}>Modificación de Perfil</h3>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Nombre y Apellidos</label>
                    <input name="name" required defaultValue={user.name || ""} />
                </div>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label>Correo Electrónico (Login ID)</label>
                    <input type="email" name="email" required defaultValue={user.email || ""} />
                </div>
                <div className={styles.inputGroup}>
                    <label>Sobrescribir Contraseña</label>
                    <input type="password" name="password" placeholder="Rellenar únicamente para forzar reset" minLength={6} />
                </div>
            </div>

            <div className={styles.formGrid} style={{ marginTop: '2rem' }}>
                <div className={styles.inputGroup}>
                    <label>Nivel de Autorización (Rol)</label>
                    <select name="role" defaultValue={user.role}>
                        <option value="USER">USER (Estándar)</option>
                        <option value="PREMIUM">PREMIUM (Acceso Avanzado)</option>
                        <option value="SUPPORT">SUPPORT (Atención al Cliente)</option>
                        <option value="ADMIN">ADMIN (Administrador Total)</option>
                    </select>
                </div>
            </div>

            <div className={styles.actions} style={{ marginTop: '3rem' }}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading} style={{ width: '100%' }}>
                    {loading ? "Alterando Data Base..." : "Sincronizar Cambios"}
                </button>
            </div>
        </form>
    );
}
