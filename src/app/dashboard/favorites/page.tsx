import styles from "../dashboard.module.css";
import { getFavorites } from "@/actions/favorites";
import { Star, ExternalLink, Zap, Gauge } from "lucide-react";
import Link from "next/link";

export default async function FavoritesPage() {
    const favorites = await getFavorites();

    return (
        <>
            <header className={styles.header}>
                <h1>Mis Favoritos</h1>
                <p>Gestiona y accede rápidamente a las fichas técnicas que has guardado.</p>
            </header>

            <div className={styles.favoritesGrid} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '3rem'
            }}>
                {favorites.map((fav: any) => (
                    <div key={fav.id} className="glass" style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        transition: 'transform 0.2s',
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--accent)' }}>
                            <Star size={18} fill="var(--accent)" />
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                                {fav.version.make} {fav.version.model}
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                {fav.version.trim || "Versión Base"} | {fav.version.yearStart}-{fav.version.yearEnd || 'Act'}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                <TrendingUpIcon size={14} /> {fav.version.fuel}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                <Gauge size={14} /> {fav.version.transmission || "Manual"}
                            </div>
                        </div>

                        {fav.plate && (
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '0.5rem 0.8rem',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                letterSpacing: '1px',
                                textAlign: 'center',
                                border: '1px dashed rgba(255,255,255,0.1)'
                            }}>
                                Matrícula: {fav.plate}
                            </div>
                        )}

                        <Link
                            href={`/dashboard?plate=${fav.plate || ""}&v=${fav.vehicleVersionId}`}
                            className={styles.btn}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            Ver Ficha Completa <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>
                ))}

                {favorites.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '20px',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <Star size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <h3>No tienes favoritos todavía</h3>
                        <p>Guarda fichas técnicas haciendo clic en la estrella durante tus búsquedas.</p>
                        <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '1.5rem' }}>
                            Empezar a buscar
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

function TrendingUpIcon({ size }: { size: number }) {
    return <Zap size={size} />;
}
