import Link from "next/link";
import styles from "../page.module.css";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>Términos del Servicio</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Última actualización: 21 de febrero de 2026</p>

                <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.8' }}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>1. Aceptación de los Términos</h2>
                        <p>Al acceder y utilizar PlateVault (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Términos del Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>2. Uso del Servicio</h2>
                        <p>PlateVault proporciona acceso a especificaciones técnicas de vehículos basadas en matrículas españolas. La información se proporciona "tal cual" y es responsabilidad del usuario verificarla para usos críticos.</p>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                            <li>No está permitido el raspado de datos (scraping) automatizado.</li>
                            <li>Queda prohibido el uso de la plataforma para actividades ilegales o acoso.</li>
                            <li>El acceso a la API está sujeto a límites de frecuencia (rate limiting).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>3. Cuentas de Usuario</h2>
                        <p>Para acceder a ciertas funciones, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>4. Propiedad Intelectual</h2>
                        <p>Todo el contenido de la plataforma, incluyendo el software, diseño y logotipos, es propiedad de Wark Corp. o sus licenciantes y está protegido por leyes de propiedad intelectual.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>5. Limitación de Responsabilidad</h2>
                        <p>Wark Corp. no será responsable por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar el servicio.</p>
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
