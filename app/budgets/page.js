
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const BUDGETS_KEY = "teacherhub-budgets";
const TRANSACTIONS_KEY = "teacherhub-transactions";
const TRANSACTIONS_EVENT = "teacherhub-transactions-updated";

const categories = [
  "Rent",
  "Food",
  "Transport",
  "Phone & Internet",
  "Family Support",
  "Loans & Debts",
  "Education",
  "Other",
];

function formatETB(amount) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(getCurrentMonth());
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(() => {
    try {
      const savedTransactions = JSON.parse(
        localStorage.getItem(TRANSACTIONS_KEY) || "[]"
      );

      setTransactions(
        Array.isArray(savedTransactions) ? savedTransactions : []
      );
    } catch {
      setTransactions([]);
      setError("We couldn't load your transactions.");
    }
  }, []);

  useEffect(() => {
    try {
      const savedBudgets = JSON.parse(
        localStorage.getItem(BUDGETS_KEY) || "[]"
      );

      if (Array.isArray(savedBudgets)) {
        setBudgets(savedBudgets);
      }

      loadTransactions();
    } catch {
      setError("We couldn't load your saved data.");
    } finally {
      setLoaded(true);
    }

    const handleStorageChange = (event) => {
      if (event.key === TRANSACTIONS_KEY || event.key === null) {
        loadTransactions();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(TRANSACTIONS_EVENT, loadTransactions);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(TRANSACTIONS_EVENT, loadTransactions);
    };
  }, [loadTransactions]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const budgetAmount = Number(amount);

    if (!month) {
      setError("Please select a budget month.");
      return;
    }

    if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
      setError("Enter a budget amount greater than zero.");
      return;
    }

    const existing = budgets.find(
      (budget) => budget.category === category && budget.month === month
    );

    const updatedBudgets = existing
      ? budgets.map((budget) =>
          budget.category === category && budget.month === month
            ? { ...budget, amount: budgetAmount }
            : budget
        )
      : [
          ...budgets,
          {
            id: crypto.randomUUID(),
            category,
            month,
            amount: budgetAmount,
          },
        ];

    try {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(updatedBudgets));
      setBudgets(updatedBudgets);
      setAmount("");
    } catch {
      setError("Could not save your budget in this browser.");
    }
  }

  function deleteBudget(id) {
    const updatedBudgets = budgets.filter((budget) => budget.id !== id);

    try {
      localStorage.setItem(BUDGETS_KEY, JSON.stringify(updatedBudgets));
      setBudgets(updatedBudgets);
    } catch {
      setError("Could not delete this budget. Please try again.");
    }
  }

  const monthlyBudgets = budgets.filter(
    (budget) => budget.month === month
  );

  const monthlyExpenses = transactions.filter(
    (transaction) =>
      transaction.type === "expense" &&
      typeof transaction.date === "string" &&
      transaction.date.startsWith(month)
  );

  const getCategorySpent = (budgetCategory) =>
    monthlyExpenses
      .filter((transaction) => transaction.category === budgetCategory)
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0
      );

  const totalBudget = monthlyBudgets.reduce(
    (total, budget) => total + Number(budget.amount || 0),
    0
  );

  const totalSpent = monthlyBudgets.reduce(
    (total, budget) => total + getCategorySpent(budget.category),
    0
  );

  const remaining = totalBudget - totalSpent;

  return (
    <main className="budgets-page">
      <div className="budgets-container">
        <Link href="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>

        <header className="budgets-header">
          <div>
            <p className="apply-eyebrow">FINANCIAL PLANNING</p>
            <h1>Monthly Budgets</h1>
            <p>
              Plan your spending, monitor expenses, and take control of your
              money.
            </p>
          </div>

          <label className="month-picker">
            <span>Budget month</span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </label>
        </header>

        <section className="budget-summary">
          <article className="budget-summary-card">
            <span>Total planned</span>
            <strong>{loaded ? formatETB(totalBudget) : "Loading..."}</strong>
          </article>

          <article className="budget-summary-card">
            <span>Spent in budgeted categories</span>
            <strong>{loaded ? formatETB(totalSpent) : "Loading..."}</strong>
          </article>

          <article className="budget-summary-card">
            <span>Remaining</span>
            <strong className={remaining < 0 ? "over-budget" : ""}>
              {loaded ? formatETB(remaining) : "Loading..."}
            </strong>
          </article>
        </section>

        <section className="budget-layout">
          <div className="budget-panel">
            <h2>Set a category budget</h2>
            <p className="budget-help">
              Choose a category and monthly spending limit. Saving an existing
              category updates its budget.
            </p>

            <form className="budget-form" onSubmit={handleSubmit}>
              <label htmlFor="budget-category">Expense category</label>
              <select
                id="budget-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label htmlFor="budget-amount">Monthly limit (ETB)</label>
              <input
                id="budget-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="e.g. 3000"
                required
              />

              <button className="apply-button" type="submit">
                Save budget
              </button>

              {error && (
                <p className="budget-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="budget-panel">
            <h2>Spending progress</h2>
            <p className="budget-help">
              Your recorded expenses are compared with each category's budget
              for the selected month.
            </p>

            {!loaded ? (
              <p>Loading budgets...</p>
            ) : monthlyBudgets.length === 0 ? (
              <div className="budget-empty">
                <h3>No budgets for this month</h3>
                <p>Create your first category budget to start tracking.</p>
              </div>
            ) : (
              <div className="budget-list">
                {monthlyBudgets.map((budget) => {
                  const spent = getCategorySpent(budget.category);
                  const limit = Number(budget.amount || 0);
                  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                  const overBudget = spent > limit;
                  const remainingForCategory = limit - spent;

                  return (
                    <article className="budget-item" key={budget.id}>
                      <div className="budget-item-heading">
                        <strong>{budget.category}</strong>
                        <span className={overBudget ? "over-budget" : ""}>
                          {Math.round(percentage)}%
                        </span>
                      </div>

                      <div
                        className="budget-progress-track"
                        role="progressbar"
                        aria-label={`${budget.category} budget used`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(
                          100,
                          Math.round(percentage)
                        )}
                      >
                        <div
                          className={`budget-progress-fill ${
                            overBudget ? "budget-progress-over" : ""
                          }`}
                          style={{
                            width: `${Math.min(100, percentage)}%`,
                          }}
                        />
                      </div>

                      <div className="budget-item-footer">
                        <span>Spent: {formatETB(spent)}</span>
                        <span>Limit: {formatETB(limit)}</span>
                      </div>

                      {overBudget ? (
                        <p className="budget-warning">
                          You are {formatETB(Math.abs(remainingForCategory))}{" "}
                          over budget.
                        </p>
                      ) : (
                        <p>
                          Remaining: {formatETB(remainingForCategory)}
                        </p>
                      )}

                      <button
                        className="budget-delete"
                        type="button"
                        onClick={() => deleteBudget(budget.id)}
                      >
                        Delete budget
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <p className="budget-disclaimer">
          Spending totals are calculated from transactions recorded in
          TeacherHub in this browser. Only expenses whose categories match a
          budget are included in the summary.
        </p>
      </div>
    </main>
  );
}
