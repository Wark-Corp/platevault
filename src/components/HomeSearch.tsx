"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/page.module.css";

import { Search } from "lucide-react";

export default function HomeSearch() {
    const [plate, setPlate] = useState("");
    const router = useRouter();

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const cleanPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (!cleanPlate || cleanPlate.length < 6) return;

        router.push(`/dashboard?plate=${cleanPlate}`);
    };

    return (
        <form onSubmit={handleSearch} className={styles.searchPlaceholder}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '0.8rem', paddingLeft: '0.5rem' }}>
                <Search size={20} className="text-muted" />
                <input
                    type="text"
                    placeholder="Introduce matrícula (ej. 1234ABC)"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    maxLength={8}
                />
            </div>
            <button type="submit" className="premium-gradient">Consultar Ficha</button>
        </form>
    );
}
