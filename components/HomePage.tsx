"use client";

import { useScrollTriggerRefresh } from "@/components/motion/primitives";
import { CopyProvider, copyFor, type Lang } from "@/lib/copy";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { RecordRail } from "@/components/sections/RecordRail";
import { Dashboard } from "@/components/product/Dashboard";
import { StatLine } from "@/components/sections/StatLine";
import { TrustBand } from "@/components/sections/TrustBand";
import { Comparison } from "@/components/sections/Comparison";
import { SystemsDeck } from "@/components/sections/SystemsDeck";
import { WhoItsFor } from "@/components/sections/WhoItsFor";
import { Outputs } from "@/components/sections/Outputs";
import { Story } from "@/components/sections/Story";
import { Security } from "@/components/sections/Security";
import { Insights } from "@/components/sections/Insights";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

/* One page, two languages. Everything below reads its words from the locale
   the provider hands down, so Arabic is a translation of this page rather
   than a second copy of it that can drift. */
export function HomePage({ lang }: { lang: Lang }) {
  useScrollTriggerRefresh();
  const { a11y } = copyFor(lang);

  return (
    <CopyProvider lang={lang}>
      <Preloader />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <RecordRail />
        <section className="rule-b bg-off" aria-label={a11y.platform}>
          <div className="shell section-y-sm">
            <Dashboard />
          </div>
        </section>
        <StatLine />
        <TrustBand />
        <Comparison />
        <SystemsDeck />
        <WhoItsFor />
        <Outputs />
        <Story />
        <Security />
        <Insights />
        <FinalCTA />
      </main>
      <Footer />
    </CopyProvider>
  );
}
