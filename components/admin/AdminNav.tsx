"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/updates", label: "Field Notes" },
  { href: "/admin/masterclasses", label: "Masterclasses" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-ink sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Logo variant="full" size="sm" href="/admin" />
          <span className="font-utility text-[10px] uppercase tracking-wider text-orange border border-orange/50 rounded-sm px-2 py-0.5">
            Admin
          </span>
        </div>

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
                  active ? "text-orange" : "text-paper/60 hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-utility text-xs uppercase tracking-wider text-paper/60 hover:text-paper hidden sm:inline"
          >
            ← Member view
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="font-utility text-xs uppercase tracking-wider text-paper/60 hover:text-orange"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

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
                active ? "text-orange" : "text-paper/60"
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
