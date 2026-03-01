import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { TawkChatInfo } from "@/components/TawkChatInfo";
import "./globals.css";

export const metadata: Metadata = {
    title: "GrindHub Online Coaching",
    description: "Transform Your Mind & Body with GrindHub Online Coaching",
    icons: {
        icon: "/logo.jpg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    {children}
                    <Footer />
                    <TawkChatInfo />
                </Providers>
            </body>
        </html>
    );
}
