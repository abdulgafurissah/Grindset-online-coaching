import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/dashboard/admin');

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Check for Admin Role
                    if (isOnAdmin) {
                        // cast to any or check property if types allow
                        const role = (auth.user as any)?.role;
                        if (role !== "ADMIN") return false; // Deny access
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect logged-in users to dashboard if they handle root or login
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
        // Add role to session
        session({ session, user, token }) {
            if (session.user && token?.role) {
                // @ts-ignore
                session.user.role = token.role;
                session.user.id = token.sub!;
            }
            return session;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
    session: { strategy: "jwt" }, // Use JWT to avoid heavy DB hits on every request if possible, though adapter defaults to database sessions. Using JWT allows easier Edge comaptibility.
} satisfies NextAuthConfig
