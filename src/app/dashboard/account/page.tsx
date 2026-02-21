import { auth } from "@/auth";
import prisma from "@/lib/db";
import AccountView from "./AccountView";
import styles from "../dashboard.module.css";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const session = await auth();
    if (!session || !session.user?.id) redirect("/auth/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) redirect("/auth/login");

    const safeUser = {
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
    };

    return (
        <div className={styles.accountWrapper}>
            <header className={styles.header}>
                <h1>Mi Cuenta</h1>
                <p>Gestiona tu perfil, seguridad y preferencias.</p>
            </header>

            <AccountView initialUser={safeUser} />
        </div>
    );
}
