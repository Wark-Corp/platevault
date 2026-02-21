import Link from "next/link";
import { getVehicleVersions } from "@/actions/catalog";
import styles from "../admin.module.css";
import DeleteVehicleButton from "./DeleteVehicleButton";
import { Edit2, Search } from "lucide-react";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string, p?: string }> }) {
    const { q, p } = await searchParams;
    const currentPage = parseInt(p || "1");
    const { versions, total, totalPages } = await getVehicleVersions(q, currentPage, 100);

    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1>Catálogo Técnico ({total})</h1>
                    <Link href="/admin/catalog/new" className={`${styles.btn} ${styles.btnPrimary}`}>
                        + Añadir Vehículo
                    </Link>
                </div>

                <form action="/admin/catalog" method="GET" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por marca o modelo..."
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.4rem 0.8rem', outline: 'none', width: '250px' }}
                    />
                    {/* Preservamos la página 1 al buscar de nuevo */}
                    <input type="hidden" name="p" value="1" />
                    <button type="submit" style={{ background: 'var(--accent)', border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Search size={16} />
                    </button>
                </form>
            </header>

            <div className={`${styles.tableWrapper} glass`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Vehículo</th>
                            <th>Año</th>
                            <th>Combustible</th>
                            <th>Matrículas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map((v) => (
                            <tr key={v.id}>
                                <td>
                                    <strong>{v.make} {v.model}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.trim || v.generation}</div>
                                </td>
                                <td>{v.yearStart} - {v.yearEnd || 'Actual'}</td>
                                <td>{v.fuel}</td>
                                <td>{v._count.mappings} vinculadas</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                        <Link href={`/admin/catalog/${v.id}`} style={{ color: 'var(--accent)', display: 'inline-flex', padding: '0.2rem' }} title="Editar Vehículo">
                                            <Edit2 size={16} />
                                        </Link>
                                        <DeleteVehicleButton id={v.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {versions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No hay vehículos en el catálogo manual.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Mostrando página {currentPage} de {totalPages} ({total} resultados)
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                        href={`/admin/catalog?p=${currentPage - 1}${q ? `&q=${q}` : ''}`}
                        className={`${styles.btn}`}
                        style={{
                            pointerEvents: currentPage <= 1 ? 'none' : 'auto',
                            opacity: currentPage <= 1 ? 0.3 : 1,
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        Anterior
                    </Link>
                    <Link
                        href={`/admin/catalog?p=${currentPage + 1}${q ? `&q=${q}` : ''}`}
                        className={`${styles.btn}`}
                        style={{
                            pointerEvents: currentPage >= totalPages ? 'none' : 'auto',
                            opacity: currentPage >= totalPages ? 0.3 : 1,
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        Siguiente
                    </Link>
                </div>
            </div>
        </>
    );
}
