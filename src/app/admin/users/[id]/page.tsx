import prisma from "@/lib/db";
import styles from "../../admin.module.css";
import EditUserForm from "./EditUserForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        notFound();
    }

    return (
        <>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/users" style={{ color: 'var(--text-muted)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <h1>Editar Usuario ({user.name || user.email})</h1>
                </div>
            </header>

            <EditUserForm user={user} />
        </>
    );
}
