
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const users = JSON.parse(localStorage.getItem("teacherHubUsers") || "[]");

    const user = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!user) {
      setError("Invalid email or password. Please register first.");
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "teacherHubUser",
      JSON.stringify({ name: user.name, email: user.email })
    );

    router.push("/dashboard");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo">
          TeacherHub
        </Link>

        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to manage your finances and opportunities.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <div style={{ textAlign: "right", marginTop: "-8px" }}>
            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          {error && (
            <p role="alert" style={{ color: "crimson" }}>
              {error}
            </p>
          )}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}
