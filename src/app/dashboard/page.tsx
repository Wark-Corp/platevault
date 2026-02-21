import { Suspense } from "react";
import styles from "./dashboard.module.css";
import SearchExperience from "@/components/SearchExperience";

export default function DashboardPage() {
    return (
        <>
            <header className={styles.header}>
                <h1>Buscador de Matrículas</h1>
                <p>Introduce una matrícula española para obtener su ficha técnica.</p>
            </header>

            <Suspense fallback={<div>Cargando buscador...</div>}>
                <SearchExperience />
            </Suspense>
        </>
    );
}
