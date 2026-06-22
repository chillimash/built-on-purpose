"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/types/database";

const links = [
  { href: "/dashboard", label: "Field Notes", exact: true },
  { href: "/dashboard/masterclasses", label: "Masterclasses" },
  { href: "/dashboard/articles", label: "Articles" },
];

export function DashboardNav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-tan/30 bg-paper-dim sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/dashboard" className="font-display font-semibold text-lg text-ink">
          Built On Purpose
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-utility text-xs uppercase tracking-wider transition-colors ${
                  active ? "text-stamp" : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="font-utility text-xs uppercase tracking-wider text-forest hover:text-ink hidden sm:inline"
            >
              Admin →
            </Link>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-utility text-xs uppercase tracking-wider text-ink-soft hover:text-stamp"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="sm:hidden flex items-center gap-5 px-4 pb-3 overflow-x-auto">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-utility text-xs uppercase tracking-wider whitespace-nowrap ${
                active ? "text-stamp" : "text-ink-soft"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
