import Link from "next/link";
import styles from "../auth.module.css";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <div className={`${styles.card} glass`}>
                <div className={styles.logo}>Plate<span>Vault</span></div>
                <h1>Crear una cuenta</h1>
                <p className={styles.subtitle}>Únete a PlateVault para empezar a consultar matrículas.</p>

                <RegisterForm />

                <p className={styles.footer}>
                    ¿Ya tienes una cuenta? <Link href="/auth/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
