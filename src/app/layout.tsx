import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { TawkChatInfo } from "@/components/TawkChatInfo";
import "./globals.css";

export const metadata: Metadata = {
    title: "Grindset Online Coaching",
    description: "Transform Your Mind & Body with Grindset Online Coaching",
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
