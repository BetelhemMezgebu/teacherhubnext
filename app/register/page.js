
"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        window.location.href = "/dashboard";
      } else {
        setMessage(
          "Account created! Check your email to confirm your account, then sign in."
        );
        form.reset();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="logo">
          TeacherHub
        </Link>

        <h1>Create your account</h1>
        <p className="auth-description">
          Start building a stronger financial future.
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            required
          />

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
            placeholder="Create a password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && (
            <p role="alert" style={{ color: "crimson" }}>
              {error}
            </p>
          )}

          {message && (
            <p role="status" style={{ color: "green" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
