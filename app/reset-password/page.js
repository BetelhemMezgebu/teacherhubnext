"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
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

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Password updated successfully! You can now sign in.");
      setPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Reset your password</h1>
        <p className="auth-description">
          Enter a new password for your TeacherHub account.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            autoComplete="new-password"
            placeholder="Enter a new password"
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
