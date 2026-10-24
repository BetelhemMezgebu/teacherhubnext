
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  ChartNoAxesColumn,
  ChartNoAxesCombined,
  PiggyBank,
  BriefcaseBusiness,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  TrendingDown,
  Heart,
  CircleCheck,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const TRANSACTIONS_KEY = "teacherhub-transactions";
const TRANSACTIONS_EVENT = "teacherhub-transactions-updated";
const SAVINGS_KEY = "teacherhub-savings-goals";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(() => {
    try {
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setTransactions(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Unable to load transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSavingsGoals = useCallback(() => {
    try {
      const stored = localStorage.getItem(SAVINGS_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setSavingsGoals(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Unable to load savings goals:", error);
      setSavingsGoals([]);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    loadSavingsGoals();

    const handleStorageChange = (event) => {
      if (
        event.key === TRANSACTIONS_KEY ||
        event.key === SAVINGS_KEY ||
        event.key === null
      ) {
        loadTransactions();
        loadSavingsGoals();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(TRANSACTIONS_EVENT, loadTransactions);
    window.addEventListener("focus", loadTransactions);
    window.addEventListener("focus", loadSavingsGoals);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(TRANSACTIONS_EVENT, loadTransactions);
      window.removeEventListener("focus", loadTransactions);
      window.removeEventListener("focus", loadSavingsGoals);
    };
  }, [loadTransactions, loadSavingsGoals]);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const balance = income - expenses;

  const formatETB = (amount) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 2,
    }).format(amount);

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0).getTime();
      const dateB = new Date(b.date || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  const biggestExpense = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category = transaction.category || "Other";

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(transaction.amount || 0);
      });

    const categories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );

    return categories.length > 0
      ? { name: categories[0][0], amount: categories[0][1] }
      : null;
  }, [transactions]);

  const savingsSummary = useMemo(() => {
    const goals = savingsGoals.map((goal) => {
      const target = Number(
        goal.targetAmount ?? goal.target ?? goal.amount ?? 0
      );

      const saved = Number(
        goal.savedAmount ?? goal.currentAmount ?? goal.saved ?? 0
      );

      return {
        ...goal,
        target,
        saved,
        progress:
          target > 0
            ? Math.min(100, Math.max(0, (saved / target) * 100))
            : 0,
      };
    });

    const validGoals = goals.filter((goal) => goal.target > 0);

    const totalTarget = validGoals.reduce(
      (total, goal) => total + goal.target,
      0
    );

    const totalSaved = validGoals.reduce(
      (total, goal) => total + goal.saved,
      0
    );

    return {
      goals: validGoals,
      totalTarget,
      totalSaved,
      progress:
        totalTarget > 0
          ? Math.min(100, Math.max(0, (totalSaved / totalTarget) * 100))
          : 0,
    };
  }, [savingsGoals]);

  const financialTip = useMemo(() => {
    if (transactions.length === 0) {
      return {
        title: "Start with your first transaction",
        message:
          "Record your income and expenses to get financial insights based on your own activity.",
      };
    }

    if (income === 0 && expenses > 0) {
      return {
        title: "Record your income",
        message:
          "You have recorded expenses but no income yet. Add your income to get a clearer picture of your finances.",
      };
    }

    if (balance < 0) {
      return {
        title: "Review your spending",
        message:
          "Your recorded expenses are higher than your income. Review your spending categories and look for costs you can reduce.",
      };
    }

    if (biggestExpense && income > 0 && biggestExpense.amount > income * 0.4) {
      return {
        title: "Check your biggest expense",
        message: `${biggestExpense.name} is your largest expense category. Review it to see whether you can reduce spending.`,
      };
    }

    if (savingsSummary.totalTarget > 0 && savingsSummary.progress < 100) {
      return {
        title: "Keep building your savings",
        message: `You have saved ${formatETB(savingsSummary.totalSaved)} toward your savings goals. Consistent contributions can help you reach your targets.`,
      };
    }

    return {
      title: "Keep up the good work",
      message:
        "Keep recording transactions, reviewing your budget, and setting aside money for your future.",
    };
  }, [
    transactions.length,
    income,
    expenses,
    balance,
    biggestExpense,
    savingsSummary,
  ]);

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand">
          Teacher<span>Hub</span>
        </Link>

        <p className="dashboard-sidebar-label">WORKSPACE</p>

        <nav className="dashboard-nav">
          <Link href="/dashboard" className="dashboard-nav-link active">
            <LayoutDashboard size={19} aria-hidden="true" />
            Dashboard
          </Link>

          <Link href="/money" className="dashboard-nav-link">
            <Wallet size={19} aria-hidden="true" />
            Money Manager
          </Link>

          <Link href="/budgets" className="dashboard-nav-link">
            <ChartNoAxesColumn size={19} aria-hidden="true" />
            Monthly Budgets
          </Link>

          <Link href="/savings" className="dashboard-nav-link">
            <PiggyBank size={19} aria-hidden="true" />
            Savings Goals
          </Link>

          <Link href="/opportunities" className="dashboard-nav-link">
            <BriefcaseBusiness size={19} aria-hidden="true" />
            Opportunities
          </Link>

          <Link href="/applications" className="dashboard-nav-link">
            <ClipboardList size={19} aria-hidden="true" />
            My Applications
          </Link>

          <Link href="/reports" className="dashboard-nav-link">
            <ChartNoAxesCombined size={19} aria-hidden="true" />
            Reports
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <p>Manage. Earn. Save. Grow.</p>
          <Link href="/">Back to Home</Link>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR FINANCIAL OVERVIEW</p>
            <h1>Teacher Dashboard</h1>
            <p>Manage your money and plan your financial future.</p>
          </div>

          <Link href="/money" className="dashboard-primary-button">
            <Plus size={18} aria-hidden="true" />
            Add Transaction
          </Link>
        </header>

        <section className="dashboard-summary">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>Total Income</span>
              <span className="dashboard-stat-icon">
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>{loading ? "Loading..." : formatETB(income)}</h2>
            <p>All recorded income</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>Total Expenses</span>
              <span className="dashboard-stat-icon">
                <ArrowDownRight size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>{loading ? "Loading..." : formatETB(expenses)}</h2>
            <p>All recorded expenses</p>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>Remaining Balance</span>
              <span className="dashboard-stat-icon">
                <CircleDollarSign size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>{loading ? "Loading..." : formatETB(balance)}</h2>
            <p>Income minus expenses</p>
          </article>
        </section>

        <section className="dashboard-insights">
          <div className="dashboard-insights-heading">
            <p className="dashboard-eyebrow">YOUR MONEY, AT A GLANCE</p>
            <h2>Financial Insights</h2>
            <p>Understand your spending and savings progress.</p>
          </div>

          <div className="dashboard-insights-grid">
            <article className="dashboard-insight-card">
              <span className="dashboard-insight-icon">
                <TrendingDown size={20} aria-hidden="true" />
              </span>
              <p className="dashboard-insight-label">Biggest Expense</p>

              {loading ? (
                <h3>Loading...</h3>
              ) : biggestExpense ? (
                <>
                  <h3>{biggestExpense.name}</h3>
                  <strong>{formatETB(biggestExpense.amount)}</strong>
                  <p>
                    Your highest spending category across recorded expenses.
                  </p>
                </>
              ) : (
                <p>No expenses recorded yet.</p>
              )}

              <Link href="/money">
                Review transactions <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>

            <article className="dashboard-insight-card">
              <span className="dashboard-insight-icon">
                <Heart size={20} aria-hidden="true" />
              </span>
              <p className="dashboard-insight-label">Savings Progress</p>

              {loading ? (
                <h3>Loading...</h3>
              ) : savingsSummary.totalTarget > 0 ? (
                <>
                  <h3>{Math.round(savingsSummary.progress)}% saved</h3>
                  <div
                    className="dashboard-progress-track"
                    role="progressbar"
                    aria-label="Overall savings progress"
                    aria-valuenow={Math.round(savingsSummary.progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="dashboard-progress-fill"
                      style={{ width: `${savingsSummary.progress}%` }}
                    />
                  </div>
                  <strong>
                    {formatETB(savingsSummary.totalSaved)} of{" "}
                    {formatETB(savingsSummary.totalTarget)}
                  </strong>
                  <p>
                    {savingsSummary.goals.length} savings{" "}
                    {savingsSummary.goals.length === 1 ? "goal" : "goals"}{" "}
                    tracked.
                  </p>
                </>
              ) : (
                <>
                  <h3>No savings goals yet</h3>
                  <p>
                    Create a goal to track how close you are to your target.
                  </p>
                </>
              )}

              <Link href="/savings">
                Manage savings goals{" "}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>

            <article
              className={`dashboard-insight-card ${
                !loading && balance < 0
                  ? "dashboard-insight-warning"
                  : "dashboard-insight-positive"
              }`}
            >
              <span className="dashboard-insight-icon">
                {!loading && balance < 0 ? (
                  <AlertTriangle size={20} aria-hidden="true" />
                ) : (
                  <CircleCheck size={20} aria-hidden="true" />
                )}
              </span>
              <p className="dashboard-insight-label">Spending Check</p>

              {loading ? (
                <h3>Checking...</h3>
              ) : balance < 0 ? (
                <>
                  <h3>Expenses exceed income</h3>
                  <strong>{formatETB(Math.abs(balance))} over income</strong>
                  <p>
                    Your recorded expenses are higher than your recorded
                    income. Review your spending and budget.
                  </p>
                </>
              ) : income === 0 && expenses === 0 ? (
                <>
                  <h3>Ready to get started?</h3>
                  <p>
                    Add income and expenses to see how your finances compare.
                  </p>
                </>
              ) : (
                <>
                  <h3>Your balance is positive</h3>
                  <strong>{formatETB(balance)} remaining</strong>
                  <p>
                    Your recorded income covers your recorded expenses. Keep
                    monitoring your spending.
                  </p>
                </>
              )}

              <Link href="/budgets">
                Review monthly budgets{" "}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Recent Transactions</h2>
                <p>Your latest recorded financial activities.</p>
              </div>
              <Link href="/money">View all</Link>
            </div>

            {loading ? (
              <p className="dashboard-empty">Loading transactions...</p>
            ) : recentTransactions.length === 0 ? (
              <div className="dashboard-empty">
                <span>
                  <CircleDollarSign size={24} aria-hidden="true" />
                </span>
                <h3>No transactions yet</h3>
                <p>
                  Start recording your income and expenses to see your
                  financial overview here.
                </p>
                <Link href="/money" className="dashboard-primary-button">
                  Add your first transaction
                </Link>
              </div>
            ) : (
              <div className="dashboard-transaction-list">
                {recentTransactions.map((transaction, index) => (
                  <div
                    className="dashboard-transaction"
                    key={transaction.id ?? `${transaction.date}-${index}`}
                  >
                    <div className="dashboard-transaction-info">
                      <span
                        className={
                          transaction.type === "income"
                            ? "transaction-icon income-icon"
                            : "transaction-icon expense-icon"
                        }
                      >
                        {transaction.type === "income" ? "+" : "−"}
                      </span>
                      <div>
                        <h3>
                          {transaction.title || "Untitled transaction"}
                        </h3>
                        <p>
                          {transaction.category || "Other"}
                          {transaction.date ? ` · ${transaction.date}` : ""}
                        </p>
                      </div>
                    </div>
                    <strong
                      className={
                        transaction.type === "income"
                          ? "transaction-amount income-amount"
                          : "transaction-amount expense-amount"
                      }
                    >
                      {transaction.type === "income" ? "+" : "−"}
                      {formatETB(Number(transaction.amount || 0))}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section dashboard-tips">
            <h2>Your Personal Financial Tip</h2>
            <p>Advice based on your recorded financial activity.</p>

            <div className="dashboard-personal-tip">
              <span>
                <Sparkles size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>{financialTip.title}</h3>
                <p>{financialTip.message}</p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>01</span>
              <div>
                <h3>Track your spending</h3>
                <p>Record expenses to understand where your money goes.</p>
              </div>
            </div>
            <div className="dashboard-tip-item">
              <span>02</span>
              <div>
                <h3>Plan a budget</h3>
                <p>Set monthly limits for your essential expenses.</p>
              </div>
            </div>
            <div className="dashboard-tip-item">
              <span>03</span>
              <div>
                <h3>Save consistently</h3>
                <p>Choose a savings goal and work toward it over time.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-quick-links">
          <div className="dashboard-section-heading">
            <div>
              <h2>Your Tools</h2>
              <p>Everything you need to manage your teaching finances.</p>
            </div>
          </div>

          <div className="dashboard-quick-grid">
            <Link href="/money" className="dashboard-quick-card">
              <span>01</span>
              <h3>Money Manager</h3>
              <p>Record income and expenses in one place.</p>
              <strong>
                Manage money <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>

            <Link href="/budgets" className="dashboard-quick-card">
              <span>02</span>
              <h3>Monthly Budgets</h3>
              <p>Set spending limits and track your monthly budget.</p>
              <strong>
                View budgets <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>

            <Link href="/opportunities" className="dashboard-quick-card">
              <span>03</span>
              <h3>Earn More</h3>
              <p>Explore teaching and tutoring opportunities.</p>
              <strong>
                Explore opportunities{" "}
                <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>

            <Link href="/applications" className="dashboard-quick-card">
              <span>04</span>
              <h3>My Applications</h3>
              <p>Review the applications you have saved in this browser.</p>
              <strong>
                View applications <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>

            <Link href="/savings" className="dashboard-quick-card">
              <span>05</span>
              <h3>Savings Goals</h3>
              <p>Plan for your future and track your savings.</p>
              <strong>
                Manage savings <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>

            <Link href="/reports" className="dashboard-quick-card">
              <span>06</span>
              <h3>Financial Reports</h3>
              <p>Review your income, expenses, and spending trends.</p>
              <strong>
                View reports <ArrowRight size={15} aria-hidden="true" />
              </strong>
            </Link>
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>TeacherHub · Helping teachers manage, earn, save, and grow.</p>
        </footer>
      </section>
    </main>
  );
}
