
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkRecoverySession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setMessage("This recovery link is invalid or expired. Please request a new one.");
          setLoading(false);
          return;
        }
      } else if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (error) {
          setMessage("This recovery link is invalid or expired. Please request a new one.");
          setLoading(false);
          return;
        }
      } else if (url.hash.includes("access_token=")) {
        const params = new URLSearchParams(url.hash.slice(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const recoveryType = params.get("type");

        if (recoveryType !== "recovery" || !accessToken || !refreshToken) {
          setMessage("Please open the password recovery link from your email.");
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setMessage("This recovery link is invalid or expired. Please request a new one.");
          setLoading(false);
          return;
        }
      } else {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setMessage("Your recovery session is missing or expired. Please request a new password recovery link.");
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();

      if (!error && data.session) {
        setReady(true);
        window.history.replaceState({}, "", "/reset-password");
      } else {
        setMessage("Your recovery session is missing or expired. Please request a new password recovery link.");
      }

      setLoading(false);
    }

    checkRecoverySession();
  }, []);

  async function handleReset(event) {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Your password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. You can now log in.");
    setPassword("");
    setLoading(false);

    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Reset your password</h1>
        <p className="mb-6 text-gray-600">
          Enter a new password for your TeacherHub account.
        </p>

        {loading ? (
          <p>Checking your recovery link...</p>
        ) : ready ? (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
            >
              Update password
            </button>
          </form>
        ) : null}

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        {!loading && !ready && (
          <a
            href="/forgot-password"
            className="mt-4 inline-block text-blue-600 underline"
          >
            Request a new recovery link
          </a>
        )}
      </div>
    </main>
  );
}
