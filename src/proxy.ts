import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

    // Redirigir a login si intenta entrar a áreas privadas sin estar logueado
    if (!isLoggedIn && (isAdminPage || isDashboardPage)) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    // Redirigir a dashboard si está logueado e intenta entrar a login/register
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // Protección de rol para /admin
    if (isAdminPage) {
        const role = (req.auth?.user as any)?.role;
        const hasAccess = role === "ADMIN" || role === "SUPPORT";
        if (!hasAccess) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
