"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import styles from "../app/auth/auth.module.css";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            const res = await login(formData);
            if (res?.error) {
                setError(res.error);
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
            <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required placeholder="tu@email.com" />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" required placeholder="••••••••" />
            </div>
            <button type="submit" className="premium-gradient" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
        </form>
    );
}
