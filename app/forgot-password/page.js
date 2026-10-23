"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        "If an account exists for this email, you will receive a password recovery link. Please check your inbox and spam folder.",
      );
    } catch {
      setError("Unable to send the recovery email. Please try again.");
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

        <h1>Forgot your password?</h1>
        <p className="auth-description">
          Enter your email address and we will send you a password recovery
          link.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
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

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Sending..." : "Send Recovery Link"}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
