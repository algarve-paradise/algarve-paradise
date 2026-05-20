import type { ReactNode } from "react";
import { IBM_Plex_Mono, Manrope, Playfair_Display } from "next/font/google";

import "@/styles/globals.css";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

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
      <head>
        {/* Machine-readable privacy policy links — indexed by crawlers and GDPR scanners */}
        <link rel="privacy-policy" href="/politica-de-privacidade" />
        <link rel="terms-of-service" href="/politica-de-cookies" />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground">
        {children}
        <SmoothScroll />
        <CookieConsentBanner />
        {/* Visible fallback for crawlers / users without JavaScript */}
        <noscript>
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#04162f", color: "#fff", padding: "12px 20px", fontSize: "13px", zIndex: 9999, textAlign: "center" }}>
            Este site utiliza cookies essenciais.{" "}
            <a href="/politica-de-privacidade" style={{ color: "#93c5fd", textDecoration: "underline" }}>Política de Privacidade</a>
            {" · "}
            <a href="/politica-de-cookies" style={{ color: "#93c5fd", textDecoration: "underline" }}>Política de Cookies</a>
          </div>
        </noscript>
      </body>
    </html>
  );
}
