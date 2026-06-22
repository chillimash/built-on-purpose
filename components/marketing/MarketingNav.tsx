import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function MarketingNav() {
  return (
    <header className="border-b border-tan/25">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-display font-semibold text-lg text-ink">
          Built On Purpose
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-utility text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
          >
            Sign in
          </Link>
          <Link href="/signup">
            <Button variant="primary" className="!py-2.5 !px-4 text-xs">
              Join free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
