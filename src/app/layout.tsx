import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
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
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
