import { auth } from "@/auth";
import prisma from "@/lib/db";
import Sidebar from "@/components/Sidebar";
import styles from "./dashboard.module.css";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !session.user?.id) {
        redirect("/auth/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { image: true, name: true }
    });

    const freshSession = {
        ...session,
        user: { ...session.user, image: dbUser?.image, name: dbUser?.name }
    };

    return (
        <div className={styles.wrapper}>
            <Sidebar session={freshSession} />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
