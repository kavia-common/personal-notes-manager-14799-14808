"use client";

import { useEffect, useState } from "react";
import { getSession, signIn, signOut, signUp } from "@/lib/auth";
import { getConfig } from "@/lib/config";

/**
 * Top navigation bar with branding and auth controls.
 */
export default function TopNav() {
  const cfg = getConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openAuth, setOpenAuth] = useState(false);
  const [session, setSessionState] = useState(getSession());

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password);
    setSessionState(getSession());
    setOpenAuth(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    await signUp(email, password);
    setSessionState(getSession());
    setOpenAuth(false);
  }

  async function handleSignOut() {
    await signOut();
    setSessionState(getSession());
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-md"
            style={{ backgroundColor: "var(--color-accent)" }}
            aria-hidden
          />
          <span className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
            {cfg.appName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setOpenAuth((v) => !v)}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Sign in
              </button>
              {openAuth && (
                <form
                  onSubmit={handleSignIn}
                  className="absolute right-4 top-14 z-20 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
                >
                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenAuth(false)}
                      className="px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-md text-sm font-medium text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={handleSignUp}
                      className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-900"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
