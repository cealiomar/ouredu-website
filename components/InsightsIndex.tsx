"use client";

import { Kicker } from "@/components/ui";
import { useCopy } from "@/lib/copy";

export function InsightsIndex() {
  const { insights } = useCopy();

  return (
    <main id="main">
      <section className="rule-b" aria-labelledby="insights-page-heading">
        <div className="shell section-y">
          <Kicker>{insights.kicker}</Kicker>
          <h1
            id="insights-page-heading"
            className="mt-5 font-display text-[clamp(36px,5.2vw,64px)] font-extrabold display-leading tracking-[-0.035em]"
          >
            {insights.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="head-gap grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-3">
            {insights.articles.map((article, index) => (
              <article key={article.title} id={`article-${index + 1}`} className="scroll-mt-24 rounded-xl border border-line bg-off p-6">
                <p className="mono-label text-blue-ink">{article.category}</p>
                <h2 className="mt-4 text-[22px] font-semibold leading-[1.36] tracking-[-0.02em]">{article.title}</h2>
                <p className="mono-label mt-6 text-ink-45">{article.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
