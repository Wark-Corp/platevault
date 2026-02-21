"use client";

import { useState } from "react";
import styles from "../../admin/admin.module.css";
import { updateProfile, updatePassword, setup2FA, verifyAndEnable2FA, disable2FA, exportUserData, deleteAccount } from "@/actions/account";
import { cancelSubscription, createCheckoutSession } from "@/actions/stripe";
import { User, Lock, Shield, Download, Trash2, CheckCircle, AlertTriangle, Upload, Zap, Star, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountView({ initialUser }: { initialUser: any }) {
    const [name, setName] = useState(initialUser.name);
    const [image, setImage] = useState(initialUser.image || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const router = useRouter();

    const isPremium = initialUser.role === "PREMIUM";
    const isAdmin = initialUser.role === "ADMIN" || initialUser.role === "SUPPORT";
    const hasFullAccess = isPremium || isAdmin;

    // Passwords
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");

    // 2FA
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [token, setToken] = useState("");

    // Delete
    const [confirmDelete, setConfirmDelete] = useState("");

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProfile({ name, image });
        if (res.error) showMessage(res.error, "error");
        else showMessage(res.success!, "success");
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("El archivo no puede superar los 5MB.");
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            // Redimensionar a max 400x400 para que el base64 sea manejable
            const MAX = 400;
            let { width, height } = img;
            if (width > height) {
                if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
            } else {
                if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);

            // JPEG al 75% de calidad — típicamente < 50KB
            const compressed = canvas.toDataURL("image/jpeg", 0.75);
            setImage(compressed);
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    };

    const handleCancelSub = async () => {
        if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción Premium? Perderás acceso ilimitado de inmediato.")) return;
        setLoading(true);
        const res = await cancelSubscription();
        if (res.error) showMessage(res.error, "error");
        else {
            showMessage(res.success!, "success");
            window.location.reload();
        }
        setLoading(false);
    };

    const handleSubscribe = async () => {
        setLoading(true);
        const res = await createCheckoutSession();
        if (res.error) showMessage(res.error, "error");
        else if (res.url) {
            window.location.href = res.url;
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updatePassword({ current: currentPass, newPass });
        if (res.error) showMessage(res.error, "error");
        else {
            showMessage(res.success!, "success");
            setCurrentPass("");
            setNewPass("");
        }
        setLoading(false);
    };

    const handleSetup2FA = async () => {
        setLoading(true);
        const res = await setup2FA();
        if (res.error) showMessage(res.error, "error");
        else {
            setQrCode(res.qrCode!);
            setSecret(res.secret!);
        }
        setLoading(false);
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await verifyAndEnable2FA(token);
        if (res.error) showMessage(res.error, "error");
        else {
            showMessage(res.success!, "success");
            setQrCode("");
            window.location.reload();
        }
        setLoading(false);
    };

    const handleDisable2FA = async () => {
        if (!confirm("¿Seguro que quieres deshabilitar la autenticación de dos factores? Esto reducirá la seguridad de tu cuenta.")) return;
        setLoading(true);
        const res = await disable2FA();
        if (res.error) showMessage(res.error, "error");
        else window.location.reload();
        setLoading(false);
    };

    const handleExport = async () => {
        setLoading(true);
        const res = await exportUserData();
        if (res.data) {
            const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `platevault_export_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showMessage("Datos exportados correctamente.", "success");
        } else {
            showMessage(res.error!, "error");
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (confirmDelete !== initialUser.email) {
            showMessage("El correo introducido no coincide. No se ha eliminado la cuenta.", "error");
            return;
        }
        setLoading(true);
        const res = await deleteAccount();
        if (res.error) showMessage(res.error, "error");
        else {
            alert(res.success);
            router.push("/auth/login");
        }
        setLoading(false);
    };

    return (
        <div className={styles.accountContainer}>
            {message.text && (

                <div style={{
                    padding: '1rem',
                    marginBottom: '2rem',
                    borderRadius: '8px',
                    background: message.type === "success" ? 'rgba(42, 157, 143, 0.1)' : 'rgba(230, 57, 70, 0.1)',
                    color: message.type === "success" ? '#2a9d8f' : '#e63946',
                    border: `1px solid ${message.type === "success" ? '#2a9d8f' : '#e63946'}`,
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    {message.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    <span style={{ fontWeight: 500 }}>{message.text}</span>
                </div>
            )}

            {/* General Info */}
            <div className={`glass ${styles.formSection}`} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <User size={22} color="var(--accent)" />
                    <h3 style={{ margin: 0 }}>Información Personal</h3>
                </div>

                <div className={styles.profileHeader}>
                    {image ? (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent)', flexShrink: 0 }}>
                            <img src={image} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #ff8fa3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2rem', flexShrink: 0 }}>
                            {name?.charAt(0).toUpperCase() || initialUser.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Foto de Perfil</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Proporciona una URL válida (jpg, png) para tu avatar.</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                            <label>Foto de Perfil (Máx 5MB)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`${styles.btn}`}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        cursor: 'pointer', fontSize: '0.85rem'
                                    }}
                                >
                                    <Upload size={16} /> Seleccionar archivo
                                </label>
                                {image && (
                                    <button
                                        type="button"
                                        onClick={() => setImage("")}
                                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Quitar foto
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Nombre y Apellidos</label>
                            <input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Correo Electrónico</label>
                            <input value={initialUser.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                            {loading ? <Loader2 size={18} className="spin" /> : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Subscription Status */}
            <div className={`glass ${styles.formSection}`} style={{
                marginBottom: '2rem',
                border: hasFullAccess ? '1px solid rgba(255, 183, 3, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                background: hasFullAccess ? 'radial-gradient(circle at top right, rgba(255, 183, 3, 0.05) 0%, transparent 40%)' : ''
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {hasFullAccess ? <Zap size={22} color="#ffb703" fill="#ffb703" /> : <Star size={22} color="var(--text-muted)" />}
                        <h3 style={{ margin: 0, color: hasFullAccess ? '#ffb703' : 'inherit' }}>Mi Plan</h3>
                    </div>
                    <span style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: hasFullAccess ? 'rgba(255, 183, 3, 0.15)' : 'rgba(255,255,255,0.05)',
                        color: hasFullAccess ? '#ffb703' : 'var(--text-muted)',
                        border: `1px solid ${hasFullAccess ? 'rgba(255, 183, 3, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                        textTransform: 'uppercase'
                    }}>
                        {isAdmin ? "Full Access" : isPremium ? "Premium" : "Básico"}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                            {isAdmin ? "Cuenta de Administración" : isPremium ? "Plan PlateVault Premium Activo" : "Plan Gratuito"}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {hasFullAccess
                                ? "Disfrutas de consultas ilimitadas, comparador avanzado y soporte prioritario por defecto."
                                : "Tienes un límite diario de consultas. Mejora tu cuenta para eliminar restricciones."}
                        </p>
                    </div>

                    {isAdmin ? (
                        <div style={{ color: '#ffb703', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Shield size={16} /> Privilegios de Gestión Activos
                        </div>
                    ) : isPremium ? (
                        <button
                            onClick={handleCancelSub}
                            disabled={loading}
                            className={styles.btn}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            Cancelar Suscripción
                        </button>
                    ) : (
                        <Link
                            href="/dashboard/premium"
                            className={`${styles.btn}`}
                            style={{
                                background: 'linear-gradient(135deg, #ffb703 0%, #ff8c00 100%)',
                                color: 'black',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 15px rgba(255, 183, 3, 0.3)',
                                textDecoration: 'none'
                            }}
                        >
                            <Zap size={16} fill="black" /> Suscribirse ahora
                        </Link>
                    )}
                </div>
            </div>

            {/* Password */}
            <div className={`glass ${styles.formSection}`} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <Lock size={22} color="var(--accent)" />
                    <h3 style={{ margin: 0 }}>Cambiar Contraseña</h3>
                </div>

                <form onSubmit={handlePasswordUpdate}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Contraseña Actual</label>
                            <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} required />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Nueva Contraseña</label>
                            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} />
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>Actualizar Contraseña</button>
                    </div>
                </form>
            </div>

            {/* 2FA */}
            <div className={`glass ${styles.formSection}`} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <Shield size={22} color="var(--accent)" />
                    <h3 style={{ margin: 0 }}>Autenticación en Dos Factores (2FA)</h3>
                </div>

                {initialUser.twoFactorEnabled ? (
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tu cuenta está protegida con Autenticación en Dos Factores (TOTP).</p>
                        <button
                            onClick={handleDisable2FA}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                padding: '0.65rem 1.4rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(230,57,70,0.35)',
                                background: 'rgba(230,57,70,0.08)',
                                color: '#e63946', fontWeight: 600, fontSize: '0.88rem',
                                cursor: 'pointer', transition: 'all 0.18s'
                            }}
                        >
                            <Shield size={16} />
                            Deshabilitar 2FA
                        </button>
                    </div>
                ) : (
                    <div>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Añade una capa extra de seguridad a tu cuenta usando una aplicación como Google Authenticator o Microsoft Authenticator.</p>

                        {!qrCode ? (
                            <button
                                onClick={handleSetup2FA}
                                disabled={loading}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                    padding: '0.65rem 1.4rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white', fontWeight: 600, fontSize: '0.88rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    transition: 'all 0.18s'
                                }}
                            >
                                <Shield size={16} />
                                Configurar Aplicación Autenticadora
                            </button>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
                                    <img src={qrCode} alt="Código QR 2FA" style={{ width: '200px', height: '200px' }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>O introduce esta clave manualmente: <strong style={{ letterSpacing: '2px', color: 'white' }}>{secret}</strong></p>
                                </div>
                                <form onSubmit={handleVerify2FA} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', width: '100%', maxWidth: '400px' }}>
                                    <div className={styles.inputGroup} style={{ flex: 1, marginBottom: 0 }}>
                                        <label>Código de verificación (6 dígitos)</label>
                                        <input type="text" value={token} onChange={e => setToken(e.target.value)} required maxLength={6} style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }} />
                                    </div>
                                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>Activar</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Data & Deletion */}
            <div className={`glass ${styles.formSection}`} style={{ border: '1px solid rgba(230, 57, 70, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <Trash2 size={22} color="#e63946" />
                    <h3 style={{ margin: 0, color: '#e63946' }}>Zona Peligrosa</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Exportar mis datos</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Descarga un archivo JSON con toda tu información registrada e historial de búsquedas.</p>
                        </div>
                        <button
                            onClick={handleExport}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                padding: '0.65rem 1.4rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white', fontWeight: 600, fontSize: '0.88rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                transition: 'all 0.18s', whiteSpace: 'nowrap'
                            }}
                        >
                            <Download size={16} /> Solicitar JSON
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '2rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#e63946' }}>Eliminar Cuenta</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Esta acción es <strong style={{ color: 'white' }}>irreversible</strong>. Se eliminarán permanentemente tus datos, historial de consultas y cualquier configuración asociada a PlateVault.
                        </p>

                        <div style={{ background: 'rgba(230, 57, 70, 0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Para confirmar la eliminación, escribe tu correo electrónico (<strong style={{ color: 'white' }}>{initialUser.email}</strong>):</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    className={styles.inputGroup}
                                    style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--surface-border)', borderRadius: '6px', color: 'white' }}
                                    value={confirmDelete}
                                    onChange={e => setConfirmDelete(e.target.value)}
                                    placeholder={initialUser.email}
                                />
                                <button
                                    onClick={handleDelete}
                                    className={`${styles.btn}`}
                                    style={{ background: '#e63946', color: 'white' }}
                                    disabled={loading || confirmDelete !== initialUser.email}
                                >
                                    Eliminar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
