import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function MarketingNav() {
  return (
    <header className="border-b border-tan/25 bg-paper/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo variant="full" size="sm" href="/" />
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
