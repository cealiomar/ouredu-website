import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

/* Fonts are downloaded at build time and served from our own origin —
   no runtime request to Google, which is slow from the Gulf. */
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["800"],
  variable: "--font-alexandria",
  display: "swap",
});

const plexSansAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans-ar",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  /* small labels only — not worth a place in the critical path */
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ouredu.net"),
  title: {
    default: "تعليمنا — كل نظام تحتاجه مؤسستك",
    template: "%s · تعليمنا",
  },
  description:
    "القبول والنقل والمحتوى والدروس الخاصة والاستعداد للاختبارات والتدريب وإدارة المنظمات الخيرية. ثلاثة عشر نظامًا من شركة سعودية واحدة.",
  openGraph: {
    type: "website",
    siteName: "تعليمنا",
    locale: "ar_SA",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${plexSansAr.variable} ${plexMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          تخطَّ إلى المحتوى
        </a>
        {children}
      </body>
    </html>
  );
}
