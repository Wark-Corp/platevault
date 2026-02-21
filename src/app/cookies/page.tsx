import Link from "next/link";
import styles from "../page.module.css";
import { ArrowLeft, Cookie, ShieldCheck, Database, Eye, Settings, Info, Lock } from "lucide-react";

export default function CookiesPage() {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className="container">
                    <Link href="/" className="flex items-center gap-2 text-muted hover:text-white transition-colors py-4">
                        <ArrowLeft size={18} /> Volver a la página principal
                    </Link>
                </div>
            </header>

            <main className="container" style={{ padding: '8rem 0 12rem 0', maxWidth: '1000px' }}>
                {/* Hero Section Legal */}
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div className="badge mb-4" style={{ margin: '0 auto 1.5rem auto' }}>POLÍTICA DE COOKIES</div>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
                        Transparencia en <span className="text-accent">Ingeniería</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        En PlateVault, la privacidad es una característica, no una opción. Aquí detallamos cómo utilizamos las cookies para ofrecerte el mejor servicio técnico.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '3rem' }}>
                    {/* 1. Introducción */}
                    <section className="glass p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                        <div className="flex gap-4 items-center mb-8">
                            <div className="p-4 bg-accent/20 rounded-2xl text-accent"><Info size={28} /></div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>1. Declaración de Uso</h2>
                        </div>
                        <p className="text-muted leading-relaxed text-xl" style={{ opacity: 0.9 }}>
                            Utilizamos cookies y tecnologías similares para mejorar el rendimiento de nuestra plataforma de consulta de matrículas.
                            Al navegar por PlateVault, aceptas el uso de estas tecnologías. Una cookie es un pequeño fragmento
                            de texto enviado por el sitio web a tu navegador que ayuda a recordar información sobre tu visita de forma segura.
                        </p>
                    </section>

                    {/* 2. Categorías Detalladas */}
                    <section>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem', textAlign: 'center' }}>¿Qué tipo de cookies usamos?</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                            <div className="glass p-10 rounded-[2.5rem] border border-white/10 shadow-xl hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center">
                                <div className="p-4 bg-white/5 rounded-2xl text-accent mb-6"><Lock size={40} /></div>
                                <h4 className="text-2xl font-black mb-4">Técnicas</h4>
                                <p className="text-muted text-base leading-relaxed mb-6">
                                    Fundamentales para el funcionamiento. Permiten gestionar tu sesión cerrada, la seguridad 2FA y el acceso a tu suscripción Premium sin fisuras.
                                </p>
                                <div className="mt-auto px-4 py-2 bg-accent/10 rounded-full text-[10px] text-accent font-black uppercase tracking-widest">Activas Siempre</div>
                            </div>

                            <div className="glass p-10 rounded-[2.5rem] border border-white/10 shadow-xl hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center">
                                <div className="p-4 bg-white/5 rounded-2xl text-accent mb-6"><Database size={40} /></div>
                                <h4 className="text-2xl font-black mb-4">Preferencias</h4>
                                <p className="text-muted text-base leading-relaxed mb-6">
                                    Personalizan tu interfaz: modo oscuro, historial de búsquedas de vehículos preferidos e idioma seleccionado para tu comodidad.
                                </p>
                                <div className="mt-auto px-4 py-2 bg-white/5 rounded-full text-[10px] text-muted font-black uppercase tracking-widest">Activas por defecto</div>
                            </div>

                            <div className="glass p-10 rounded-[2.5rem] border border-white/10 shadow-xl hover:border-accent/40 transition-all duration-500 flex flex-col items-center text-center">
                                <div className="p-4 bg-white/5 rounded-2xl text-accent mb-6"><Eye size={40} /></div>
                                <h4 className="text-2xl font-black mb-4">Analíticas</h4>
                                <p className="text-muted text-base leading-relaxed mb-6">
                                    Nos permiten optimizar PlateVault mediante el análisis anónimo de errores y rendimiento técnico en tiempo real.
                                </p>
                                <div className="mt-auto px-4 py-2 bg-white/5 rounded-full text-[10px] text-muted font-black uppercase tracking-widest">Configurable</div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Tabla de Cookies */}
                    <section className="glass overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <div className="p-10 md:p-16">
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Inventario de Ingeniería</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Nombre</th>
                                            <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Proveedor</th>
                                            <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Finalidad</th>
                                            <th style={{ padding: '1.5rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Expiración</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted text-sm">
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                                            <td style={{ padding: '1.5rem' }}>pv_session</td>
                                            <td style={{ padding: '1.5rem' }}>platevault.es</td>
                                            <td style={{ padding: '1.5rem' }}>Mantenimiento de sesión de usuario</td>
                                            <td style={{ padding: '1.5rem' }}>Sesión</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                                            <td style={{ padding: '1.5rem' }}>pv_auth_token</td>
                                            <td style={{ padding: '1.5rem' }}>platevault.es</td>
                                            <td style={{ padding: '1.5rem' }}>Seguridad y acceso a datos técnicos</td>
                                            <td style={{ padding: '1.5rem' }}>30 días</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                                            <td style={{ padding: '1.5rem' }}>pv_cookie_consent</td>
                                            <td style={{ padding: '1.5rem' }}>platevault.es</td>
                                            <td style={{ padding: '1.5rem' }}>Preferencias de privacidad</td>
                                            <td style={{ padding: '1.5rem' }}>1 año</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 4. Gestión y Desactivación */}
                    <section className="glass p-10 md:p-16 rounded-[3rem] border border-accent/30 bg-accent/5">
                        <div className="flex gap-4 items-center mb-8">
                            <div className="p-4 bg-accent/20 rounded-2xl text-accent"><Settings size={28} /></div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Gestión del Usuario</h2>
                        </div>
                        <p className="text-muted leading-relaxed text-xl mb-10">
                            Puedes restringir o borrar las cookies de PlateVault utilizando la configuración de tu navegador.
                            Valoramos tu soberanía digital.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" className="bg-white/10 px-8 py-4 rounded-2xl text-sm font-black hover:bg-accent hover:text-white transition-all">Google Chrome</a>
                            <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" className="bg-white/10 px-8 py-4 rounded-2xl text-sm font-black hover:bg-accent hover:text-white transition-all">Firefox</a>
                            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" className="bg-white/10 px-8 py-4 rounded-2xl text-sm font-black hover:bg-accent hover:text-white transition-all">Safari</a>
                        </div>
                    </section>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-muted text-base">
                        Consultas sobre soberanía de datos: <br />
                        <span className="text-accent font-black text-xl hover:underline cursor-pointer">privacy@platevault.es</span>
                    </p>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p>&copy; 2026 PlateVault by Wark Corp. Ingeniería y Privacidad Garantizada.</p>
                </div>
            </footer>
        </div>
    );
}
