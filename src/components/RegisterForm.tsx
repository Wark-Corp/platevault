"use client";

import { useState } from "react";
import { register } from "@/actions/auth";
import styles from "../app/auth/auth.module.css";

export default function RegisterForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await register(formData);
            if (res?.error) {
                setError(res.error);
            } else if (res?.success) {
                setSuccess(res.success);
            }
        } catch (e) {
            setError("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner}>{error}</div>}
            {success && <div className={styles.successBanner}>{success}</div>}
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nombre completo</label>
                <input type="text" id="name" name="name" required placeholder="Juan Pérez" />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="tu@email.com" />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>
            <button type="submit" className="premium-gradient" disabled={loading}>
                {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
        </form>
    );
}
