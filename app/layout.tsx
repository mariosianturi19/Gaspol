// app/layout.tsx
import type { Metadata } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GASPOL System",
  description: "Simulasi kredit kendaraan untuk tim sales",
  manifest: "/manifest.json",
  icons: {
    icon: '/GASPOL.png',
    apple: '/GASPOL.png',
  },
  openGraph: {
    title: "GASPOL System",
    description: "Simulasi kredit kendaraan untuk tim sales",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${jakartaSans.variable} ${barlowCondensed.variable} gaspol-body antialiased flex min-h-screen flex-col pb-16 md:pb-0`}
      >
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
