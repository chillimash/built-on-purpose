"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithGoogle, signUpWithPassword } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithPassword(email, password, fullName);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 paper-grain">
        <div className="w-full max-w-md text-center">
          <div className="stamp text-forest text-xs mx-auto mb-6 inline-flex">
            Confirmed
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink mb-3">
            Check your inbox
          </h1>
          <p className="text-ink-soft">
            We sent a confirmation link to <strong className="text-ink">{email}</strong>.
            Open it to activate your account, then come back and sign in.
          </p>
          <Link href="/login" className="inline-block mt-8">
            <Button variant="secondary">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 paper-grain">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <span className="font-utility text-xs uppercase tracking-[0.2em] text-ink-soft">
              Built On Purpose
            </span>
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
            Start your journal
          </h1>
          <p className="mt-2 text-ink-soft text-sm">
            Weekly notes, masterclasses, and articles — built for the long road.
          </p>
        </div>

        <div className="bg-paper-dim border border-tan/30 rounded-sm p-8 relative">
          <div className="absolute -top-3 -right-3 stamp text-forest text-[10px] bg-paper">
            New
          </div>

          {error && (
            <div className="mb-5 border border-stamp/40 bg-stamp/5 text-stamp text-sm rounded-sm px-4 py-3">
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
              id="fullName"
              label="Full name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already a member?{" "}
          <Link href="/login" className="text-ink font-semibold underline underline-offset-4 hover:text-stamp">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
