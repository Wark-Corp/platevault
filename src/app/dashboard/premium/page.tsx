"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";
import { Zap, Check, ShieldCheck, Star, HelpCircle, ArrowRight, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/actions/stripe";

const PREMIUM_BENEFITS = [
    "Consultas de matrículas ilimitadas",
    "Historial completo sin restricciones",
    "Soporte técnico prioritario",
    "Acceso anticipado a nuevas funciones",
    "Sin interrupciones ni tiempos de espera"
];

const STANDARD_BENEFITS = [
    "15 consultas diarias gratuitas",
    "Historial de las últimas 50 búsquedas",
    "Soporte vía tickets estándar",
    "Acceso a datos técnicos básicos"
];

export default function PremiumPage() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const { url, error } = await createCheckoutSession();
            if (error) {
                alert(error);
                return;
            }
            if (url) {
                window.location.href = url;
            }
        } catch (e) {
            console.error(e);
            alert("Error al iniciar el proceso de pago.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="premium-gradient" style={{
                        padding: '0.5rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(230, 57, 70, 0.3)'
                    }}>
                        <Star size={24} color="white" fill="white" />
                    </div>
                    <h1>PlateVault Premium</h1>
                </div>
                <p>Potencia tu experiencia con acceso ilimitado y herramientas profesionales.</p>
            </header>

            <div className={styles.pricingGrid}>
                {/* Plan Estándar */}
                <div className={`${styles.pricingCard} glass`}>
                    <div className={styles.cardHeader}>
                        <h3>Gratuito / Estándar</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>€</span>
                            <span className={styles.amount}>0</span>
                            <span className={styles.period}>/siempre</span>
                        </div>
                    </div>
                    <ul className={styles.benefitList}>
                        {STANDARD_BENEFITS.map((benefit, i) => (
                            <li key={i}>
                                <Check size={16} className={styles.checkIcon} />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.currentPlanBtn} disabled>
                        Plan Actual
                    </button>
                </div>

                {/* Plan PREMIUM */}
                <div className={`${styles.pricingCard} ${styles.premiumCard} glass`}>
                    <div className={styles.cardBadge}>MÁS POPULAR</div>
                    <div className={styles.cardHeader}>
                        <h3>PlateVault Premium</h3>
                        <div className={styles.price}>
                            <span className={styles.currency}>€</span>
                            <span className={styles.amount}>9.99</span>
                            <span className={styles.period}>/mes</span>
                        </div>
                    </div>
                    <ul className={styles.benefitList}>
                        {PREMIUM_BENEFITS.map((benefit, i) => (
                            <li key={i}>
                                <Zap size={16} className={styles.zapIcon} />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="premium-gradient"
                        onClick={handleSubscribe}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} fill="white" />}
                        <span>{loading ? "Preparando..." : "Subir a Premium Ahora"}</span>
                    </button>
                    <p className={styles.cardFooter}>
                        Cancelación en cualquier momento. Pago seguro vía Stripe.
                    </p>
                </div>
            </div>

            <div className={styles.trustSection}>
                <div className={styles.trustItem}>
                    <ShieldCheck size={24} />
                    <div>
                        <h4>Seguridad Garantizada</h4>
                        <p>Tus pagos se procesan de forma cifrada a través de Stripe.</p>
                    </div>
                </div>
                <div className={styles.trustItem}>
                    <HelpCircle size={24} />
                    <div>
                        <h4>¿Dudas sobre el plan?</h4>
                        <p>Contacta con nuestro soporte técnico prioritario.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
