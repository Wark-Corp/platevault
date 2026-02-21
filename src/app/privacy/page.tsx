import Link from "next/link";
import styles from "../page.module.css";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className="container">
                    <Link href="/" className="flex items-center gap-2 text-muted hover:text-white transition-colors">
                        <ArrowLeft size={18} /> Volver al Inicio
                    </Link>
                </div>
            </header>

            <main className="container" style={{ padding: '6rem 0', maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Shield size={42} className="text-accent" />
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>Política de Privacidad</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Última actualización: 21 de febrero de 2026</p>

                <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>1. Información que Recopilamos</h2>
                        <p>En PlateVault nos tomamos muy en serio su privacidad. Solo recopilamos la información estrictamente necesaria para proporcionar el servicio:</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                            <li><strong>Datos de Cuenta</strong>: Nombre, correo electrónico y contraseña (encriptada).</li>
                            <li><strong>Historial de Consultas</strong>: Las matrículas consultadas para que usted pueda acceder a ellas posteriormente.</li>
                            <li><strong>Datos Técnicos</strong>: No recopilamos datos personales de los propietarios de los vehículos, solo información técnica vinculada a la matrícula.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>2. Uso de la Información</h2>
                        <p>Utilizamos sus datos para:
                            <br />- Proporcionar y mantener el servicio.
                            <br />- Gestionar su cuenta y seguridad (incluyendo 2FA).
                            <br />- Mejorar la precisión de nuestro catálogo técnico.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>3. Protección de Datos (RGPD)</h2>
                        <p>Cumplimos con el Reglamento General de Protección de Datos. Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento desde la sección "Mi Cuenta".</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>4. Cookies</h2>
                        <p>Utilizamos cookies esenciales para mantener su sesión activa y mejorar la seguridad. No utilizamos cookies de rastreo de terceros para publicidad.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>5. Contacto</h2>
                        <p>Para cualquier duda sobre su privacidad, puede contactar con nuestro responsable de protección de datos en privacy@warkcorp.com.</p>
                    </section>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; 2026 PlateVault by Wark Corp.</p>
                </div>
            </footer>
        </div>
    );
}
