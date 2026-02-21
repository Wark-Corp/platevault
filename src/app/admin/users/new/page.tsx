"use client";

import { useState } from "react";
import { createUser } from "@/actions/admin";
import styles from "../../admin.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role"),
        };

        const res = await createUser(data);
        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/admin/users");
        }
    }

    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/users" style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1>Nuevo Usuario</h1>
                </div>
            </header>

            <form action={handleSubmit} className="glass" style={{ padding: '2.5rem', borderRadius: '12px', maxWidth: '800px' }}>
                {error && <div style={{ color: '#e63946', background: 'rgba(230, 57, 70, 0.1)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(230, 57, 70, 0.2)', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}

                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--accent)' }}>Detalles del Perfil</h3>
                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label>Nombre y Apellidos</label>
                        <input name="name" required placeholder="Ej. Juan Pérez" />
                    </div>
                </div>
                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label>Correo Electrónico</label>
                        <input type="email" name="email" required placeholder="correo@ejemplo.com" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Contraseña</label>
                        <input type="password" name="password" required placeholder="Mínimo 6 caracteres" minLength={6} />
                    </div>
                </div>

                <div className={styles.formGrid} style={{ marginTop: '2rem' }}>
                    <div className={styles.inputGroup}>
                        <label>Permisos y Acceso (Rol)</label>
                        <select name="role" defaultValue="USER">
                            <option value="USER">USER (Estándar)</option>
                            <option value="PREMIUM">PREMIUM (Acceso Avanzado)</option>
                            <option value="SUPPORT">SUPPORT (Atención al Cliente)</option>
                            <option value="ADMIN">ADMIN (Administrador Total)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.actions} style={{ marginTop: '3rem' }}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading} style={{ width: '100%' }}>
                        {loading ? "Inscribiendo en Data Base..." : "Añadir Usuario Activo"}
                    </button>
                </div>
            </form>
        </>
    );
}
