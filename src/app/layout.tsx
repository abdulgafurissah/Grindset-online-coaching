import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { TawkChatInfo } from "@/components/TawkChatInfo";
import "./globals.css";

const quicksand = Quicksand({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "GrindHub Online Coaching",
    description: "Transform Your Mind & Body with GrindHub Online Coaching",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${quicksand.variable} ${nunito.variable} font-body antialiased bg-slate-50 text-slate-800 selection:bg-brand/20 selection:text-brand`} suppressHydrationWarning>
                <Providers>
                    {children}
                    <Footer />
                    <TawkChatInfo />
                </Providers>
            </body>
        </html>
    );
}
