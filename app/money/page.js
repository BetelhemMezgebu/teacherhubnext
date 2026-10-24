"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "teacherhub-transactions";
const TRANSACTIONS_EVENT = "teacherhub-transactions-updated";

const formatETB = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(amount);

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 10);
};

const createEmptyForm = () => ({
  title: "",
  type: "expense",
  category: "Food",
  amount: "",
  date: getToday(),
});

export default function MoneyPage() {
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(createEmptyForm);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }
    } catch {
      console.error("Could not load saved transactions.");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

      window.dispatchEvent(new Event(TRANSACTIONS_EVENT));
    } catch {
      setFormError("Could not save your changes in this browser.");
    }
  }, [transactions, loaded]);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const balance = income - expenses;

  const filteredTransactions = transactions
    .filter((item) => {
      if (filter === "all") return true;
      return item.type === filter;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function handleTypeChange(event) {
    const type = event.target.value;

    setForm((current) => ({
      ...current,
      type,
      category: type === "income" ? "Salary" : "Food",
    }));

    setFormError("");
  }

  function resetForm() {
    setForm(createEmptyForm());
    setEditingId(null);
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const amount = Number(form.amount);

    if (!title) {
      setFormError("Please enter a transaction name.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setFormError("Please select a transaction date.");
      return;
    }

    const transactionData = {
      title,
      type: form.type,
      category: form.category,
      amount,
      date: form.date,
    };

    if (editingId !== null) {
      setTransactions((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...transactionData } : item,
        ),
      );
    } else {
      const newTransaction = {
        id: crypto.randomUUID(),
        ...transactionData,
      };

      setTransactions((current) => [newTransaction, ...current]);
    }

    resetForm();
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);

    setForm({
      title: transaction.title,
      type: transaction.type,
      category: transaction.category,
      amount: String(transaction.amount),
      date: transaction.date,
    });

    setFormError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id) {
    const transaction = transactions.find((item) => item.id === id);

    if (!transaction) return;

    const confirmed = window.confirm(
      `Delete "${transaction.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setTransactions((current) => current.filter((item) => item.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="money-page">
      <header className="money-header">
        <div>
          <Link href="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>

          <p className="eyebrow">YOUR PERSONAL FINANCES</p>
          <h1>Money Manager</h1>

          <p className="money-subtitle">
            Track your income, manage expenses, and take control of your
            financial future.
          </p>
        </div>
      </header>

      <section className="money-summary">
        <article className="money-stat">
          <span>Total Income</span>
          <h2>{formatETB(income)}</h2>
        </article>

        <article className="money-stat">
          <span>Total Expenses</span>
          <h2>{formatETB(expenses)}</h2>
        </article>

        <article className="money-stat money-balance">
          <span>Remaining Balance</span>
          <h2>{formatETB(balance)}</h2>
        </article>
      </section>

      <section className="money-content">
        <div className="money-form-card">
          <h2>{editingId !== null ? "Edit Transaction" : "Add Transaction"}</h2>

          <p>
            {editingId !== null
              ? "Update the details and save your changes."
              : "Record income or an expense."}
          </p>

          <form className="money-form" onSubmit={handleSubmit}>
            <label htmlFor="type">Transaction type</label>

            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleTypeChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label htmlFor="title">Transaction name</label>

            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Monthly salary"
              required
            />

            <label htmlFor="category">Category</label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {(form.type === "income"
                ? ["Salary", "Tutoring", "Business", "Other"]
                : [
                    "Food",
                    "Housing",
                    "Transport",
                    "Phone & Internet",
                    "Family Support",
                    "Education",
                    "Loans & Debts",
                    "Other",
                  ]
              ).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label htmlFor="amount">Amount (ETB)</label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <label htmlFor="date">Date</label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            {formError && (
              <p className="budget-error" role="alert">
                {formError}
              </p>
            )}

            <button className="primary-button" type="submit">
              {editingId !== null ? "Save Changes" : "+ Save Transaction"}
            </button>

            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel Editing
              </button>
            )}
          </form>
        </div>

        <div className="money-history-card">
          <div className="money-history-header">
            <div>
              <h2>Transaction History</h2>
              <p>{transactions.length} recorded transactions</p>
            </div>

            <select
              aria-label="Filter transactions"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {!loaded ? (
            <p className="money-empty">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <div className="money-empty">
              <span>📊</span>
              <h3>No transactions yet</h3>
              <p>Add your first income or expense using the form.</p>
            </div>
          ) : (
            <div className="money-transaction-list">
              {filteredTransactions.map((item) => (
                <article className="money-transaction" key={item.id}>
                  <div className="money-transaction-icon">
                    {item.type === "income" ? "↙" : "↗"}
                  </div>

                  <div className="money-transaction-details">
                    <h3>{item.title}</h3>
                    <p>
                      {item.category} · {item.date}
                    </p>
                  </div>

                  <strong className={item.type}>
                    {item.type === "income" ? "+" : "−"}
                    {formatETB(Number(item.amount || 0))}
                  </strong>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-transaction"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete ${item.title}`}
                    title="Delete transaction"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
