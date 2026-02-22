"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../app/admin/admin.module.css";
import { logout } from "@/actions/auth";
import { BarChart, Car, Users, Link as LinkIcon, LogOut, LayoutDashboard, LifeBuoy, ShieldCheck, Menu, X, ClipboardList } from "lucide-react";
import { useState } from "react";

export default function AdminSidebar({ session }: { session: any }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <Link href="/" className={styles.logo} onClick={closeMenu} style={{ textDecoration: 'none' }}>
                    Plate<span>Vault</span>
                    <div style={{ fontSize: '0.55rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.1rem', fontWeight: 900 }}>Administration</div>
                </Link>
                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Overlay */}
            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

            <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
                <Link href="/" className={styles.logo} style={{ textDecoration: 'none', display: 'block' }} onClick={closeMenu}>
                    Plate<span>Vault</span>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.2rem', fontWeight: 900 }}>Administration</div>
                </Link>

                <nav className={styles.sidebarNav}>
                    {session?.user?.role === "ADMIN" && (
                        <>
                            <Link href="/admin" className={pathname === "/admin" ? styles.active : ""} onClick={closeMenu}>
                                <BarChart size={18} /> Panel y Auditoría
                            </Link>
                            <Link href="/admin/catalog" className={pathname?.startsWith("/admin/catalog") ? styles.active : ""} onClick={closeMenu}>
                                <Car size={18} /> Catálogo Técnico
                            </Link>
                            <Link href="/admin/mappings" className={pathname?.startsWith("/admin/mappings") ? styles.active : ""} onClick={closeMenu}>
                                <LinkIcon size={18} /> Vínculos de Matrículas
                            </Link>
                            <Link href="/admin/verify" className={pathname?.startsWith("/admin/verify") ? styles.active : ""} onClick={closeMenu}>
                                <ShieldCheck size={18} /> Verificar Matrículas
                            </Link>
                            <Link href="/admin/users" className={pathname?.startsWith("/admin/users") ? styles.active : ""} onClick={closeMenu}>
                                <Users size={18} /> Usuarios
                            </Link>
                            <Link href="/admin/suggestions" className={pathname?.startsWith("/admin/suggestions") ? styles.active : ""} onClick={closeMenu}>
                                <ClipboardList size={18} /> Sugerencias
                            </Link>
                        </>
                    )}
                    <Link href="/admin/tickets" className={pathname?.startsWith("/admin/tickets") ? styles.active : ""} onClick={closeMenu}>
                        <LifeBuoy size={18} /> Tickets de Soporte
                    </Link>

                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <Link href="/dashboard" className={styles.returnBtn} onClick={closeMenu}>
                            <LayoutDashboard size={18} /> Volver a la App
                        </Link>
                    </div>
                </nav>

                <div className={styles.user}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        {session?.user?.image ? (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #2a9d8f' }}>
                                <img src={session.user.image} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #2a9d8f, #264653)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        )}
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{session?.user?.name || 'Administrador'}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session?.user?.role}</p>
                        </div>
                    </div>

                    <form action={logout}>
                        <button type="submit" className={styles.logoutBtn}>
                            <LogOut size={16} /> Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
