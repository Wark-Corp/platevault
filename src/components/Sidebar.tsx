"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../app/dashboard/dashboard.module.css";
import { logout } from "@/actions/auth";
import { Search, Clock, User as UserIcon, LogOut, Shield, Star, ArrowLeftRight, LifeBuoy, Zap, Menu, X, Lightbulb } from "lucide-react";
import SupportSystem from "@/components/SupportSystem";
import { useState } from "react";


export default function Sidebar({ session }: { session: any }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const hasAdminAccess = session?.user?.role === "ADMIN" || session?.user?.role === "SUPPORT";

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    Plate<span>Vault</span>
                </Link>
                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Menu Overlay */}
            {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}

            <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
                <Link href="/" className={styles.logo} style={{ textDecoration: 'none', display: 'block' }} onClick={closeMenu}>
                    Plate<span>Vault</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={pathname === "/dashboard" ? styles.active : ""} onClick={closeMenu}>
                        <Search size={18} /> Buscador
                    </Link>
                    <Link href="/dashboard/history" className={pathname === "/dashboard/history" ? styles.active : ""} onClick={closeMenu}>
                        <Clock size={18} /> Mi Historial
                    </Link>
                    <Link href="/dashboard/favorites" className={pathname === "/dashboard/favorites" ? styles.active : ""} onClick={closeMenu}>
                        <Star size={18} /> Mis Favoritos
                    </Link>
                    <Link href="/dashboard/compare" className={pathname === "/dashboard/compare" ? styles.active : ""} onClick={closeMenu}>
                        <ArrowLeftRight size={18} /> Comparador
                    </Link>
                    <Link href="/dashboard/account" className={pathname === "/dashboard/account" ? styles.active : ""} onClick={closeMenu}>
                        <UserIcon size={18} /> Mi Cuenta
                    </Link>

                    {session?.user?.role === "USER" && (
                        <Link href="/dashboard/premium" className={`${styles.premiumNavBtn} ${pathname === "/dashboard/premium" ? styles.activePremium : ""}`} onClick={closeMenu}>
                            <Zap size={18} fill="currentColor" /> Mejora a Premium
                        </Link>
                    )}
                    <Link href="/dashboard/tickets" className={pathname.startsWith("/dashboard/tickets") ? styles.active : ""} onClick={closeMenu}>
                        <LifeBuoy size={18} /> Mis Tickets
                    </Link>
                    <Link href="/dashboard/suggestions" className={pathname === "/dashboard/suggestions" ? styles.active : ""} onClick={closeMenu}>
                        <Lightbulb size={18} /> Sugerir Vínculo
                    </Link>
                    <SupportSystem variant="sidebar" />

                    {hasAdminAccess && (
                        <div style={{ marginTop: '2rem' }}>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '1rem' }}>Administración</p>
                            <Link href={session?.user?.role === "SUPPORT" ? "/admin/tickets" : "/admin"} className={styles.adminNavBtn} onClick={closeMenu}>
                                <Shield size={18} /> Panel Admin
                            </Link>
                        </div>
                    )}
                </nav>

                <div className={styles.user}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        {session?.user?.image ? (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--accent)' }}>
                                <img src={session.user.image} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #ff8fa3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{session?.user?.name || 'Usuario'}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{session?.user?.email}</p>
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

