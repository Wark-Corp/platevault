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
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>2FA</th>
                            <th>Última IP</th>
                            <th>Último Acceso</th>
                            <th>Registro</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const user = u as any;
                            // Consideramos "Online" si ha tenido actividad en los últimos 5 minutos
                            const isOnline = user.lastLoginAt && (new Date().getTime() - new Date(user.lastLoginAt).getTime() < 5 * 60 * 1000);

                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatarWrapper}>
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name || ""}
                                                        className={styles.avatarImg}
                                                    />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        {(user.name || user.email || "?")[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div
                                                    className={`${styles.statusDot} ${isOnline ? styles.onlineDot : styles.offlineDot}`}
                                                    title={isOnline ? "Online" : "Offline"}
                                                />
                                            </div>
                                            <span className={styles.userName}>{user.name || "-"}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`${styles.twoFactorBadge} ${user.twoFactorEnabled ? styles.badgeActive : styles.badgeInactive}`}>
                                            {user.twoFactorEnabled ? "ACTIVO" : "INACTIVO"}
                                        </div>
                                    </td>
                                    <td className={styles.auditIp}>
                                        {user.lastLoginIp || "Sin registros"}
                                    </td>
                                    <td className={styles.auditCol}>
                                        <div className={styles.auditColInner}>
                                            {user.lastLoginAt ? (
                                                <>
                                                    <span className={styles.auditDate}>{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                                                    <span className={styles.auditTime}>
                                                        {new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className={styles.auditDate}>Nunca</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.auditDate}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Link href={`/admin/users/${user.id}`} style={{ color: 'var(--accent)', display: 'inline-flex', padding: '0.2rem' }} title="Editar Usuario">
                                                <Edit2 size={16} />
                                            </Link>
                                            <DeleteUserButton id={user.id} />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
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
