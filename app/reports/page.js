"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const TRANSACTIONS_KEY = "teacherhub-transactions";

function formatETB(amount) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
}

function getTransactionMonth(transaction) {
  return typeof transaction.date === "string"
    ? transaction.date.slice(0, 7)
    : "";
}

export default function ReportsPage() {
  const today = new Date();

  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(today));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));

  const loadTransactions = useCallback(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(TRANSACTIONS_KEY) || "[]",
      );

      setTransactions(Array.isArray(stored) ? stored : []);
      setError("");
    } catch {
      setError("Unable to load transactions. Please refresh the page.");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadTransactions();

    function handleStorageChange(event) {
      if (event.key === TRANSACTIONS_KEY || event.key === null) {
        loadTransactions();
      }
    }

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "teacherhub-transactions-updated",
      loadTransactions,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "teacherhub-transactions-updated",
        loadTransactions,
      );
    };
  }, [loadTransactions]);

  const availableYears = useMemo(() => {
    const years = transactions
      .map((transaction) => getTransactionMonth(transaction).slice(0, 4))
      .filter((year) => /^\d{4}$/.test(year));

    return [
      ...new Set([...years, String(today.getFullYear())]),
    ].sort((a, b) => Number(b) - Number(a));
  }, [transactions, today]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const month = getTransactionMonth(transaction);

      if (!/^\d{4}-\d{2}$/.test(month)) return false;

      if (period === "monthly") {
        return month === selectedMonth;
      }

      if (period === "yearly") {
        return month.slice(0, 4) === selectedYear;
      }

      return true;
    });
  }, [transactions, period, selectedMonth, selectedYear]);

  const report = useMemo(() => {
    const income = filteredTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + (Number(transaction.amount) || 0),
        0,
      );

    const expenses = filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + (Number(transaction.amount) || 0),
        0,
      );

    const categoryTotals = {};

    filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category = transaction.category || "Other";
        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          (Number(transaction.amount) || 0);
      });

    const categories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const previousPeriodTransactions = transactions.filter((transaction) => {
      const month = getTransactionMonth(transaction);

      if (!/^\d{4}-\d{2}$/.test(month)) return false;

      if (period === "monthly") {
        const [year, monthNumber] = selectedMonth.split("-").map(Number);
        const previousDate = new Date(year, monthNumber - 2, 1);
        return month === getMonthKey(previousDate);
      }

      if (period === "yearly") {
        return month.slice(0, 4) === String(Number(selectedYear) - 1);
      }

      return false;
    });

    const previousExpenses = previousPeriodTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + (Number(transaction.amount) || 0),
        0,
      );

    const expenseChange =
      period === "all" || previousExpenses === 0
        ? null
        : ((expenses - previousExpenses) / previousExpenses) * 100;

    return {
      income,
      expenses,
      balance: income - expenses,
      categories,
      previousExpenses,
      expenseChange,
    };
  }, [filteredTransactions, transactions, period, selectedMonth, selectedYear]);

  const maxCategoryAmount = Math.max(
    ...report.categories.map((category) => category.amount),
    1,
  );

  const reportTitle =
    period === "monthly"
      ? getMonthLabel(selectedMonth)
      : period === "yearly"
        ? selectedYear
        : "All recorded transactions";

  return (
    <main className="reports-page">
      <div className="reports-container">
        <Link href="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>

        <header className="reports-header">
          <div>
            <p className="apply-eyebrow">UNDERSTAND YOUR MONEY</p>
            <h1>Financial Reports</h1>
            <p>
              Track your income, spending, and financial progress.
            </p>
          </div>
        </header>

        <section className="reports-filters">
          <div className="reports-period-control">
            <label htmlFor="report-period">Report period</label>
            <select
              id="report-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="all">All time</option>
            </select>
          </div>

          {period === "monthly" && (
            <div className="reports-period-control">
              <label htmlFor="report-month">Choose month</label>
              <input
                id="report-month"
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            </div>
          )}

          {period === "yearly" && (
            <div className="reports-period-control">
              <label htmlFor="report-year">Choose year</label>
              <select
                id="report-year"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {error && (
          <p className="budget-error" role="alert">
            {error}
          </p>
        )}

        {!loaded ? (
          <p>Loading your financial report...</p>
        ) : (
          <>
            <div className="reports-period">
              <strong>{reportTitle}</strong>
              <span>{filteredTransactions.length} transactions</span>
            </div>

            <section className="reports-summary">
              <article className="reports-stat">
                <span>Total income</span>
                <strong>{formatETB(report.income)}</strong>
                <p>Money received in this period</p>
              </article>

              <article className="reports-stat">
                <span>Total expenses</span>
                <strong>{formatETB(report.expenses)}</strong>
                <p>Money spent in this period</p>
              </article>

              <article className="reports-stat">
                <span>Net balance</span>
                <strong>{formatETB(report.balance)}</strong>
                <p>
                  {report.balance >= 0
                    ? "Income minus expenses"
                    : "Expenses exceed income"}
                </p>
              </article>
            </section>

            <section className="reports-grid">
              <article className="reports-panel">
                <h2>Income vs. expenses</h2>
                <p className="reports-help">
                  Compare your recorded income with your spending.
                </p>

                {report.income === 0 && report.expenses === 0 ? (
                  <p className="reports-empty">
                    No financial activity recorded for this period.
                  </p>
                ) : (
                  <div className="reports-comparison">
                    <div className="reports-comparison-item">
                      <div className="reports-comparison-label">
                        <span>Income</span>
                        <strong>{formatETB(report.income)}</strong>
                      </div>
                      <div className="reports-bar-track">
                        <div
                          className="reports-income-bar"
                          style={{
                            width: `${
                              report.income + report.expenses === 0
                                ? 0
                                : (report.income /
                                    (report.income + report.expenses)) *
                                  100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="reports-comparison-item">
                      <div className="reports-comparison-label">
                        <span>Expenses</span>
                        <strong>{formatETB(report.expenses)}</strong>
                      </div>
                      <div className="reports-bar-track">
                        <div
                          className="reports-expense-bar"
                          style={{
                            width: `${
                              report.income + report.expenses === 0
                                ? 0
                                : (report.expenses /
                                    (report.income + report.expenses)) *
                                  100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {report.income > 0 && (
                  <p className="reports-insight">
                    You spent{" "}
                    {Math.round((report.expenses / report.income) * 100)}% of
                    your recorded income during this period.
                  </p>
                )}

                {report.income === 0 && report.expenses > 0 && (
                  <p className="reports-insight">
                    Expenses are recorded, but no income is recorded for this
                    period.
                  </p>
                )}
              </article>

              <article className="reports-panel">
                <h2>Expense breakdown</h2>
                <p className="reports-help">
                  See which categories account for your spending.
                </p>

                {report.categories.length === 0 ? (
                  <p className="reports-empty">No expenses in this period.</p>
                ) : (
                  <div className="reports-category-list">
                    {report.categories.map((category) => (
                      <div className="reports-category" key={category.name}>
                        <div className="reports-category-heading">
                          <span>{category.name}</span>
                          <strong>{formatETB(category.amount)}</strong>
                        </div>

                        <div className="reports-bar-track">
                          <div
                            className="reports-category-bar"
                            style={{
                              width: `${
                                (category.amount / maxCategoryAmount) * 100
                              }%`,
                            }}
                          />
                        </div>

                        <p>
                          {Math.round(
                            (category.amount / report.expenses) * 100,
                          )}
                          % of expenses
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>

            {period !== "all" && (
              <section className="reports-panel reports-history-panel">
                <h2>Spending comparison</h2>
                <p className="reports-help">
                  {period === "monthly"
                    ? "Compare this month with the previous month."
                    : "Compare this year with the previous year."}
                </p>

                <div className="reports-history-grid">
                  <div>
                    <span>Selected period expenses</span>
                    <strong>{formatETB(report.expenses)}</strong>
                  </div>

                  <div>
                    <span>Previous period expenses</span>
                    <strong>{formatETB(report.previousExpenses)}</strong>
                  </div>

                  <div>
                    <span>Change in expenses</span>
                    <strong>
                      {report.expenseChange === null
                        ? "No baseline"
                        : `${report.expenseChange > 0 ? "+" : ""}${Math.round(
                            report.expenseChange,
                          )}%`}
                    </strong>
                    <p>
                      {report.expenseChange === null
                        ? "No previous expenses to compare."
                        : report.expenseChange > 0
                          ? "Spending increased."
                          : report.expenseChange < 0
                            ? "Spending decreased."
                            : "Spending stayed the same."}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="reports-panel reports-transactions-panel">
              <h2>Transactions — {reportTitle}</h2>

              {filteredTransactions.length === 0 ? (
                <p className="reports-help">
                  No transactions recorded for this period.
                </p>
              ) : (
                <div className="reports-table-wrapper">
                  <table className="reports-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...filteredTransactions]
                        .sort((a, b) =>
                          String(b.date).localeCompare(String(a.date)),
                        )
                        .map((transaction, index) => (
                          <tr
                            key={
                              transaction.id ??
                              `${transaction.date}-${transaction.description}-${index}`
                            }
                          >
                            <td>{transaction.date}</td>
                            <td>{transaction.description || "Untitled"}</td>
                            <td>{transaction.category || "Other"}</td>
                            <td>
                              <span
                                className={
                                  transaction.type === "income"
                                    ? "reports-type-income"
                                    : "reports-type-expense"
                                }
                              >
                                {transaction.type === "income"
                                  ? "Income"
                                  : "Expense"}
                              </span>
                            </td>
                            <td>{formatETB(transaction.amount)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="reports-actions">
              <Link href="/money" className="apply-button">
                Manage transactions
              </Link>
              <Link href="/budgets" className="reports-secondary-button">
                View budgets
              </Link>
            </div>
          </>
        )}

        <p className="budget-disclaimer">
          Reports are calculated from transactions stored in this browser.
          They are estimates, not official bank statements.
        </p>
      </div>
    </main>
  );
}
