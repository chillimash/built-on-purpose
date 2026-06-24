"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { signInWithGoogle, signInWithPassword } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithPassword(email, password);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 paper-grain">
      <div className="w-full max-w-md">
        {/* Header / mark */}
        <div className="mb-10 text-center">
          <Logo variant="full" size="md" href="/" />
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-ink-soft text-sm">
            Sign in to pick up where you left off.
          </p>
        </div>

        {/* Card */}
        <div className="bg-paper-dim border border-tan/30 rounded-sm p-8 relative">
          {/* corner stamp mark */}
          <div className="absolute -top-3 -right-3 stamp text-orange text-[10px] bg-paper">
            Member
          </div>

          {error && (
            <div className="mb-5 border border-orange/40 bg-orange/5 text-orange text-sm rounded-sm px-4 py-3">
              {error}
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            className="w-full mb-5"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-tan/30" />
            <span className="font-utility text-xs uppercase tracking-wider text-ink-soft">
              or
            </span>
            <div className="h-px flex-1 bg-tan/30" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link href="/signup" className="text-ink font-semibold underline underline-offset-4 hover:text-orange">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
