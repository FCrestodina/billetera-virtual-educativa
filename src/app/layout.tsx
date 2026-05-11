import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Billetera Virtual Educativa",
  description: "Simulador educativo de billetera virtual para 6° y 7° grado — Buenos Aires Aprende",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>{children}</body>
    </html>
  );
}
