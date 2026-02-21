"use client";

import { useState } from "react";
import { deleteUser } from "@/actions/admin";
import { Trash2 } from "lucide-react";

export default function DeleteUserButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("¿Seguro que quieres eliminar este usuario de forma permanente? Se perderá el acceso y todo el historial pero no borrará sus registros de autoría en el log general.")) return;

        setLoading(true);
        const res = await deleteUser(id);
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
            title="Eliminar Usuario"
        >
            <Trash2 size={16} />
        </button>
    );
}
