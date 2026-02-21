"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import styles from "../app/auth/auth.module.css";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            const res = await login(formData);
            if (res?.error) {
                setError(res.error);
            }
            if (res?.twoFactorRequired) {
                setShowTwoFactor(true);
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

            {!showTwoFactor ? (
                <>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required placeholder="tu@email.com" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required placeholder="••••••••" />
                    </div>
                </>
            ) : (
                <>
                    <div className={styles.inputGroup}>
                        <label style={{ color: 'var(--accent)', fontWeight: 700 }}>Código de Seguridad (2FA)</label>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Introduce el código de 6 dígitos de tu aplicación de autenticación.
                        </p>
                        <input
                            type="text"
                            name="code"
                            required
                            placeholder="000000"
                            maxLength={6}
                            autoFocus
                            style={{
                                textAlign: 'center',
                                letterSpacing: '4px',
                                fontSize: '1.5rem',
                                border: '2px solid var(--accent)'
                            }}
                        />
                        {/* Hidden inputs to preserve credentials in the form data for re-submission */}
                        <input type="hidden" name="email" value={(document.getElementById('email') as HTMLInputElement)?.value} />
                        <input type="hidden" name="password" value={(document.getElementById('password') as HTMLInputElement)?.value} />
                    </div>
                </>
            )}

            <button type="submit" className="premium-gradient" disabled={loading}>
                {loading ? "Procesando..." : showTwoFactor ? "Verificar y Entrar" : "Iniciar Sesión"}
            </button>
            {showTwoFactor && (
                <button
                    type="button"
                    onClick={() => setShowTwoFactor(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem' }}
                >
                    Volver al login clásico
                </button>
            )}
        </form>
    );
}
