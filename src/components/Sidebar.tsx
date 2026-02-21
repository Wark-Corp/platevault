"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../app/dashboard/dashboard.module.css";
import { logout } from "@/actions/auth";
import { Search, Clock, User as UserIcon, LogOut, Shield, Star, ArrowLeftRight, LifeBuoy, Zap } from "lucide-react";
import SupportSystem from "@/components/SupportSystem";


export default function Sidebar({ session }: { session: any }) {
    const pathname = usePathname();
    const hasAdminAccess = session?.user?.role === "ADMIN" || session?.user?.role === "SUPPORT";

    return (
        <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo} style={{ textDecoration: 'none', display: 'block' }}>
                Plate<span>Vault</span>
            </Link>

            <nav className={styles.nav}>
                <Link href="/dashboard" className={pathname === "/dashboard" ? styles.active : ""}>
                    <Search size={18} /> Buscador
                </Link>
                <Link href="/dashboard/history" className={pathname === "/dashboard/history" ? styles.active : ""}>
                    <Clock size={18} /> Mi Historial
                </Link>
                <Link href="/dashboard/favorites" className={pathname === "/dashboard/favorites" ? styles.active : ""}>
                    <Star size={18} /> Mis Favoritos
                </Link>
                <Link href="/dashboard/compare" className={pathname === "/dashboard/compare" ? styles.active : ""}>
                    <ArrowLeftRight size={18} /> Comparador
                </Link>
                <Link href="/dashboard/account" className={pathname === "/dashboard/account" ? styles.active : ""}>
                    <UserIcon size={18} /> Mi Cuenta
                </Link>

                {session?.user?.role === "USER" && (
                    <Link href="/dashboard/premium" className={`${styles.premiumNavBtn} ${pathname === "/dashboard/premium" ? styles.activePremium : ""}`}>
                        <Zap size={18} fill="currentColor" /> Mejora a Premium
                    </Link>
                )}
                <Link href="/dashboard/tickets" className={pathname.startsWith("/dashboard/tickets") ? styles.active : ""}>
                    <LifeBuoy size={18} /> Mis Tickets
                </Link>
                <SupportSystem variant="sidebar" />

                {hasAdminAccess && (
                    <div style={{ marginTop: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '1rem' }}>Administración</p>
                        <Link href={session?.user?.role === "SUPPORT" ? "/admin/tickets" : "/admin"} className={styles.adminNavBtn}>
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
            {/* Mobile Bottom Navigation */}
            <div className={styles.mobileNav}>
                <Link href="/dashboard" className={`${styles.mobileNavItem} ${pathname === "/dashboard" ? styles.mobileNavItemActive : ""}`}>
                    <Search size={22} />
                    <span>Buscador</span>
                </Link>
                <Link href="/dashboard/favorites" className={`${styles.mobileNavItem} ${pathname === "/dashboard/favorites" ? styles.mobileNavItemActive : ""}`}>
                    <Star size={22} />
                    <span>Favoritos</span>
                </Link>
                <Link href="/dashboard/tickets" className={`${styles.mobileNavItem} ${pathname.startsWith("/dashboard/tickets") ? styles.mobileNavItemActive : ""}`}>
                    <LifeBuoy size={22} />
                    <span>Tickets</span>
                </Link>
                <Link href="/dashboard/compare" className={`${styles.mobileNavItem} ${pathname === "/dashboard/compare" ? styles.mobileNavItemActive : ""}`}>
                    <ArrowLeftRight size={22} />
                    <span>Comparar</span>
                </Link>
                <Link href="/dashboard/account" className={`${styles.mobileNavItem} ${pathname === "/dashboard/account" ? styles.mobileNavItemActive : ""}`}>
                    <UserIcon size={22} />
                    <span>Cuenta</span>
                </Link>
            </div>
        </aside>
    );
}

