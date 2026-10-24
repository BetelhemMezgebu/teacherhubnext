"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "teacherhub-savings-goals";

function formatETB(amount) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function getProgress(saved, target) {
  if (!Number(target) || target <= 0) return 0;
  return Math.min(100, Math.max(0, (Number(saved) / Number(target)) * 100));
}

export default function SavingsPage() {
  const [goals, setGoals] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    target: "",
    saved: "0",
    deadline: "",
  });

  const loadGoals = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setGoals(Array.isArray(stored) ? stored : []);
      setError("");
    } catch {
      setError("Unable to load your savings goals.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadGoals();

    function handleStorageChange(event) {
      if (event.key === STORAGE_KEY || event.key === null) {
        loadGoals();
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadGoals]);

  function saveGoals(updatedGoals) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
      setError("");
      return true;
    } catch {
      setError("Unable to save changes. Please check your browser storage.");
      return false;
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function addGoal(event) {
    event.preventDefault();
    setError("");

    const title = form.title.trim();
    const target = Number(form.target);
    const saved = Number(form.saved);

    if (
      !title ||
      !Number.isFinite(target) ||
      !Number.isFinite(saved) ||
      target <= 0 ||
      saved < 0 ||
      saved > target
    ) {
      setError(
        "Enter a goal name, a positive target, and savings between zero and your target.",
      );
      return;
    }

    const newGoal = {
      id: crypto.randomUUID(),
      title,
      target,
      saved,
      deadline: form.deadline,
      createdAt: new Date().toISOString(),
    };

    if (saveGoals([...goals, newGoal])) {
      setForm({
        title: "",
        target: "",
        saved: "0",
        deadline: "",
      });
    }
  }

  function updateSavings(goal) {
    const enteredAmount = window.prompt(
      `Enter the total amount saved so far (0–${goal.target} ETB).`,
      String(goal.saved),
    );

    if (enteredAmount === null) return;

    if (enteredAmount.trim() === "") {
      setError("Please enter a valid savings amount.");
      return;
    }

    const newSaved = Number(enteredAmount);

    if (
      !Number.isFinite(newSaved) ||
      newSaved < 0 ||
      newSaved > Number(goal.target)
    ) {
      setError("Enter an amount between zero and your savings target.");
      return;
    }

    const updatedGoals = goals.map((item) =>
      item.id === goal.id ? { ...item, saved: newSaved } : item,
    );

    saveGoals(updatedGoals);
  }

  function deleteGoal(goalId) {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }

    saveGoals(goals.filter((goal) => goal.id !== goalId));
  }

  const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target || 0),
    0,
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.saved || 0),
    0,
  );

  const totalRemaining = goals.reduce(
    (total, goal) =>
      total +
      Math.max(0, Number(goal.target || 0) - Number(goal.saved || 0)),
    0,
  );

  const completedGoals = goals.filter(
    (goal) => Number(goal.saved) >= Number(goal.target),
  ).length;

  return (
    <main className="savings-page">
      <div className="savings-container">
        <Link href="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>

        <header className="savings-header">
          <div>
            <p className="apply-eyebrow">BUILD YOUR FUTURE</p>
            <h1>Savings Goals</h1>
            <p>
              Make a plan, build your savings, and celebrate every milestone.
            </p>
          </div>
        </header>

        <section className="savings-summary">
          <article className="savings-stat">
            <span>Total savings</span>
            <strong>{loaded ? formatETB(totalSaved) : "Loading..."}</strong>
          </article>

          <article className="savings-stat">
            <span>Total target</span>
            <strong>{loaded ? formatETB(totalTarget) : "Loading..."}</strong>
          </article>

          <article className="savings-stat">
            <span>Still needed</span>
            <strong>{loaded ? formatETB(totalRemaining) : "Loading..."}</strong>
          </article>
        </section>

        <section className="savings-layout">
          <div className="savings-panel">
            <h2>Create a savings goal</h2>
            <p className="savings-help">
              Set a target and record how much you have already saved.
            </p>

            <form className="savings-form" onSubmit={addGoal}>
              <label htmlFor="goal-title">Goal name</label>
              <input
                id="goal-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Emergency fund"
                maxLength={70}
                required
              />

              <label htmlFor="goal-target">Savings target (ETB)</label>
              <input
                id="goal-target"
                name="target"
                type="number"
                min="0.01"
                step="0.01"
                value={form.target}
                onChange={handleChange}
                placeholder="e.g. 20000"
                required
              />

              <label htmlFor="goal-saved">Already saved (ETB)</label>
              <input
                id="goal-saved"
                name="saved"
                type="number"
                min="0"
                step="0.01"
                value={form.saved}
                onChange={handleChange}
                required
              />

              <label htmlFor="goal-deadline">Target date (optional)</label>
              <input
                id="goal-deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
              />

              <button className="apply-button" type="submit">
                Create goal
              </button>

              {error && (
                <p className="budget-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="savings-panel">
            <div className="savings-list-heading">
              <h2>Your goals</h2>
              <span>
                {goals.length} total · {completedGoals} completed
              </span>
            </div>

            {!loaded ? (
              <p>Loading your goals...</p>
            ) : goals.length === 0 ? (
              <div className="savings-empty">
                <div className="empty-icon">◎</div>
                <h3>Start saving for something important</h3>
                <p>Create your first goal to start tracking your progress.</p>
              </div>
            ) : (
              <div className="savings-goal-list">
                {goals.map((goal) => {
                  const saved = Number(goal.saved) || 0;
                  const target = Number(goal.target) || 0;
                  const percentage = getProgress(saved, target);
                  const completed = target > 0 && saved >= target;

                  return (
                    <article className="savings-goal" key={goal.id}>
                      <div className="savings-goal-heading">
                        <div>
                          <h3>{goal.title}</h3>
                          {goal.deadline && (
                            <p className="savings-deadline">
                              Target date: {goal.deadline}
                            </p>
                          )}
                        </div>

                        <span
                          className={
                            completed
                              ? "goal-badge goal-complete"
                              : "goal-badge"
                          }
                        >
                          {completed ? "Completed" : "In progress"}
                        </span>
                      </div>

                      <div
                        className="savings-progress-track"
                        role="progressbar"
                        aria-label={`${goal.title} progress`}
                        aria-valuenow={Math.round(percentage)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="savings-progress-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="savings-progress-details">
                        <strong>{Math.round(percentage)}% saved</strong>
                        <span>{formatETB(saved)}</span>
                      </div>

                      <p className="savings-target">
                        Target: {formatETB(target)}
                      </p>

                      {!completed && (
                        <p className="savings-remaining">
                          {formatETB(target - saved)} to go
                        </p>
                      )}

                      <div className="savings-actions">
                        <button
                          type="button"
                          className="savings-update-button"
                          onClick={() => updateSavings(goal)}
                        >
                          Update savings
                        </button>

                        <button
                          type="button"
                          className="budget-delete"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          Delete goal
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <p className="budget-disclaimer">
          Savings amounts are manually recorded and stored in this browser.
          They are not linked to a bank account or mobile-money service.
        </p>
      </div>
    </main>
  );
}
