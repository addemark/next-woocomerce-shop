"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setToken(null);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body?.error ?? "Invalid credentials");
        return;
      }

      setToken(body.token);
      console.log("id", body.userId);
    } catch (err: any) {
      setError(err.message ?? "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your WooCommerce credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username or email
            </label>
            <input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {token && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 break-all">
              Signed in! Token: {token} ---
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
