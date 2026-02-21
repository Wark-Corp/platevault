import Link from "next/link";
import styles from "../auth.module.css";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={`${styles.card} glass`}>
                <div className={styles.logo}>Plate<span>Vault</span></div>
                <h1>Bienvenido de nuevo</h1>
                <p className={styles.subtitle}>Ingresa tus credenciales para acceder al buscador.</p>

                <LoginForm />

                <p className={styles.footer}>
                    ¿No tienes una cuenta? <Link href="/auth/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
