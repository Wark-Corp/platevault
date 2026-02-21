import styles from "../admin.module.css";
import Link from "next/link";
import { Edit2, Search } from "lucide-react";
import DeleteUserButton from "./DeleteUserButton";
import { getUsers } from "@/actions/admin";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string, p?: string }> }) {
    const { q, p } = await searchParams;
    const currentPage = parseInt(p || "1");
    const { users, total, totalPages } = await getUsers(q, currentPage, 20);

    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1>Gestión de Usuarios ({total})</h1>
                    <Link href="/admin/users/new" className={`${styles.btn} ${styles.btnPrimary}`}>
                        + Añadir Usuario
                    </Link>
                </div>

                <form action="/admin/users" method="GET" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Buscar por nombre o email..."
                        style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.4rem 0.8rem', outline: 'none', width: '250px' }}
                    />
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
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Registro</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name || "-"}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: user.role === 'ADMIN' ? 'rgba(230, 57, 70, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                        color: user.role === 'ADMIN' ? 'var(--accent)' : 'white'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Link href={`/admin/users/${user.id}`} style={{ color: 'var(--accent)', display: 'inline-flex', padding: '0.2rem' }} title="Editar Usuario">
                                            <Edit2 size={16} />
                                        </Link>
                                        <DeleteUserButton id={user.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No hay usuarios que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Página {currentPage} de {totalPages} ({total} usuarios)
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            href={`/admin/users?p=${currentPage - 1}${q ? `&q=${q}` : ''}`}
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
                            href={`/admin/users?p=${currentPage + 1}${q ? `&q=${q}` : ''}`}
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
            )}
        </>
    );
}
