import { auth } from "@/auth";
import prisma from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import styles from "./admin.module.css";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (!session || !session.user?.id || (role !== "ADMIN" && role !== "SUPPORT")) {
        redirect("/dashboard");
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
            <AdminSidebar session={freshSession} />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
