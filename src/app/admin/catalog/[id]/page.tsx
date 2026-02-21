import prisma from "@/lib/db";
import styles from "../../admin.module.css";
import EditVehicleForm from "./EditVehicleForm";
import { notFound } from "next/navigation";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const vehicle = await prisma.vehicleVersion.findUnique({
        where: { id }
    });

    if (!vehicle) {
        notFound();
    }

    return (
        <>
            <header className={styles.header}>
                <h1>Editar Vehículo</h1>
            </header>

            <EditVehicleForm vehicle={vehicle} />
        </>
    );
}
