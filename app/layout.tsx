import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { business, cityLabel } from "@/content/business";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { QuoteNudge } from "@/components/quote/QuoteNudge";
import { JsonLd, localBusinessSchema } from "@/lib/schema";
import { isDraft } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} | Premium Home & Commercial Cleaning in ${cityLabel}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_US",
    title: `${business.name} | Tailored cleaning, made right. Always.`,
    description: business.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  ...(isDraft && { robots: { index: false, follow: false } }),
};

export const viewport: Viewport = {
  themeColor: "#081226",
};

/** Hide reveal targets before paint only when motion is allowed; fail open after 4s. */
const motionGuard = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.classList.add('motion-ok');setTimeout(function(){if(!window.__motionReady)d.classList.remove('motion-ok')},4000)}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
        <JsonLd data={localBusinessSchema()} />
      </head>
      <body className="min-h-dvh bg-porcelain text-ink">
        <MotionProvider>
          <Header />
          <main id="main" className="overflow-x-clip">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <MobileCTA />
        {/* The concierge only appears once it can actually answer (API key set). */}
        {process.env.ANTHROPIC_API_KEY && <ChatLauncher />}
        <QuoteNudge />
      </body>
    </html>
  );
}
