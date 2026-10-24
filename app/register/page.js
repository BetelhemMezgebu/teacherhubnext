
"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name").trim();
      const email = formData.get("email").trim().toLowerCase();
      const password = formData.get("password");

      const users = JSON.parse(
        localStorage.getItem("teacherHubUsers") || "[]"
      );

      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = { name, email, password };

      localStorage.setItem(
        "teacherHubUsers",
        JSON.stringify([...users, newUser])
      );

      setMessage("Account created successfully! You can now sign in.");
      event.currentTarget.reset();
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
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
