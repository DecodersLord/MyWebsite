import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-inter",
});

const firaCode = Fira_Code({
    subsets: ["latin"],
    weight: ["400", "600"],
    variable: "--font-fira-code",
});

export const metadata: Metadata = {
    title: "Priyank Sevak",
    description: "Priyank Sevak Portfolio Website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${firaCode.variable} antialiased`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
