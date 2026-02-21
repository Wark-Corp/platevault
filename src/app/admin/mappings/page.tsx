import { getVehicleVersions } from "@/actions/catalog";
import styles from "../admin.module.css";
import MappingForm from "./MappingForm";
import PlateMappingList from "./PlateMappingList";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function GlobalMappingsPage() {
    return (
        <>
            <header className={styles.header}>
                <h1>Gestor de Vínculos de Matrículas</h1>
                <p>Asocia matrículas a vehículos o gestiona las vinculaciones existentes en el sistema.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Nuevo Vínculo</h2>
                    <MappingForm />
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 0' }} />

                <section>
                    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="spin" size={32} style={{ opacity: 0.3 }} /></div>}>
                        <PlateMappingList />
                    </Suspense>
                </section>
            </div>
        </>
    );
}
