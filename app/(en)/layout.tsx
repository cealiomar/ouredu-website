import type { Metadata, Viewport } from "next";
import { Alexandria, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

/* Fonts are downloaded at build time and served from our own origin —
   no runtime request to Google, which is slow from the Gulf. */
const alexandria = Alexandria({
  /* the Arabic cut of the display face is loaded only by the Arabic layout.
     One weight, not two: the second cost 35KB to render seven headings that
     read the same at 800. */
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-alexandria",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
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
    default: "OurEdu — every system your institution runs",
    template: "%s · OurEdu",
  },
  description:
    "Admissions, transport, content, private lessons, exam preparation, training and charity management. Thirteen systems from one Saudi company.",
  openGraph: {
    type: "website",
    siteName: "OurEdu",
    locale: "en",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${alexandria.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
