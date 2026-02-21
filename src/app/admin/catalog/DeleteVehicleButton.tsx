"use client";

import { useState } from "react";
import { deleteVehicleVersion } from "@/actions/catalog";
import { Trash2 } from "lucide-react";

export default function DeleteVehicleButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("¿Seguro que quieres eliminar este vehículo? Se eliminarán todas las asignaciones de matrículas conectadas a él irreversiblemente.")) return;

        setLoading(true);
        const res = await deleteVehicleVersion(id);
        if (res.error) {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem',
                color: '#e63946', opacity: loading ? 0.5 : 1, display: 'inline-flex', alignItems: 'center'
            }}
            title="Eliminar Vehículo"
        >
            <Trash2 size={16} />
        </button>
    );
}
