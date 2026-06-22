import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { ThemeStamp } from "@/components/marketing/ThemeStamp";
import { Button } from "@/components/ui/Button";
import { THEMES } from "@/types/database";

const FEATURES = [
  {
    mark: "✎",
    title: "Field Notes",
    body: "A weekly note in your inbox and on the platform — short, direct, built to be applied the same day you read it.",
  },
  {
    mark: "◉",
    title: "Masterclasses",
    body: "Live sessions you can join in real time, plus a growing library of recorded teaching organized by theme.",
  },
  {
    mark: "¶",
    title: "Articles",
    body: "Longer-form writing for when a single note isn't enough — the reasoning behind the frameworks, not just the summary.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 paper-grain">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <span className="stamp text-stamp text-xs -rotate-2 inline-flex mb-8">
          Est. for the long road
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-[1.1] tracking-tight">
          Awaken to your
          <br />
          God-given potential.
        </h1>
        <p className="mt-6 text-ink-soft text-lg max-w-xl mx-auto leading-relaxed">
          Weekly field notes, masterclasses, and articles that challenge you to take
          responsibility, live with purpose, strengthen your relationships, and pursue
          meaningful impact.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4 flex-wrap">
          <Link href="/signup">
            <Button variant="primary">Start your journal</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Sign in</Button>
          </Link>
        </div>
      </section>

      {/* Six frameworks — real taxonomy, shown as a stamped index */}
      <section className="border-y border-tan/25 bg-paper-dim/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
              The framework
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink mt-2">
              Six themes. Six tools you can actually remember.
            </h2>
            <p className="text-ink-soft mt-3 max-w-lg mx-auto">
              Every note, masterclass, and article is built around one of these — each
              with its own memorable framework for putting it into practice.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((theme, i) => (
              <ThemeStamp key={theme} theme={theme} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
            What&rsquo;s inside
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink mt-2">
            Three ways to go deeper
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <span className="font-display text-3xl text-tan">{f.mark}</span>
              <h3 className="font-display text-xl text-ink mt-4">{f.title}</h3>
              <p className="text-ink-soft text-sm mt-2 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Faith framing — practical, not preachy */}
      <section className="border-t border-tan/25 bg-paper-dim/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="font-display text-xl sm:text-2xl text-ink leading-snug italic">
            &ldquo;Faith here isn&rsquo;t a category &mdash; it&rsquo;s the operating system. Stewardship,
            discipline, service, and wisdom, applied to an ordinary week.&rdquo;
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Your potential isn&apos;t waiting on permission.
        </h2>
        <p className="text-ink-soft mt-3">
          Free to join. One note a week. No pressure, just purpose.
        </p>
        <div className="mt-7">
          <Link href="/signup">
            <Button variant="primary">Start your journal</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-tan/25 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
          <span className="font-display font-semibold text-ink">Built On Purpose</span>
          <span className="font-utility text-xs text-ink-soft">
            © {new Date().getFullYear()} Built On Purpose
          </span>
        </div>
      </footer>
    </div>
  );
}
