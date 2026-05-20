import type { ReactNode } from "react";
import { IBM_Plex_Mono, Manrope, Playfair_Display } from "next/font/google";

import "@/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${manrope.variable} ${playfair.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
