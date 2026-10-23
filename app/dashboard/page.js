"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  BriefcaseBusiness,
  ClipboardList,
  BookOpen,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Search,
  CircleDollarSign,
  Menu,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("teacherhub-transactions");
      const parsed = saved ? JSON.parse(saved) : [];
      setTransactions(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTransactions([]);
    }
  }, []);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const formatETB = (amount) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 2,
    }).format(amount);

  const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Teaching Opportunities", href: "/opportunities", icon: BriefcaseBusiness },
    { label: "My Applications", href: "/applications", icon: ClipboardList },
    { label: "Money Manager", href: "/money", icon: Wallet },
    { label: "Savings Goals", href: "/savings", icon: PiggyBank },
  ];

  const teachingTools = [
    {
      number: "01",
      title: "Find Teaching Work",
      description:
        "Explore opportunities to teach, tutor, and grow your professional experience.",
      action: "Explore opportunities",
      href: "/opportunities",
      icon: BriefcaseBusiness,
    },
    {
      number: "02",
      title: "Track Applications",
      description:
        "Keep track of the teaching opportunities you have applied for.",
      action: "View applications",
      href: "/applications",
      icon: ClipboardList,
    },
    {
      number: "03",
      title: "Manage Your Earnings",
      description:
        "Record your income and expenses from teaching and tutoring.",
      action: "Open money manager",
      href: "/money",
      icon: CircleDollarSign,
    },
  ];

  return (
    <main className="dashboard-page">
      <aside className={`dashboard-sidebar ${menuOpen ? "mobile-open" : ""}`}>
        <Link href="/" className="dashboard-brand">
          Teacher<span>Hub</span>
        </Link>

        <p className="dashboard-sidebar-label">TEACHER WORKSPACE</p>

        <nav className="dashboard-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-nav-link ${
                  item.href === "/dashboard" ? "active" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={19} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <p>Teach. Connect. Grow.</p>
          <Link href="/">Back to Home</Link>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">YOUR TEACHER WORKSPACE</p>
            <h1>Welcome to TeacherHub!</h1>
            <p>
              Find opportunities, build your teaching career, and manage your
              earnings in one place.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-primary-button mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
            Menu
          </button>

          <Link href="/opportunities" className="dashboard-primary-button">
            <Search size={18} aria-hidden="true" />
            Find Opportunities
          </Link>
        </header>

        <section className="dashboard-welcome-panel">
          <div className="dashboard-welcome-content">
            <span className="dashboard-welcome-icon">
              <GraduationCap size={30} aria-hidden="true" />
            </span>
            <p className="dashboard-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
            <h2>Make your teaching skills go further.</h2>
            <p>
              Discover opportunities, organize your career, and find new ways
              to earn through teaching.
            </p>
            <Link href="/opportunities" className="dashboard-welcome-button">
              Explore teaching opportunities
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="dashboard-summary">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>Teaching Opportunities</span>
              <span className="dashboard-stat-icon">
                <BriefcaseBusiness size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>Find your next role</h2>
            <p>Explore available teaching and tutoring opportunities.</p>
            <Link href="/opportunities" className="dashboard-card-link">
              Browse opportunities <ArrowRight size={15} />
            </Link>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>My Applications</span>
              <span className="dashboard-stat-icon">
                <ClipboardList size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>Stay organized</h2>
            <p>Review your saved teaching applications.</p>
            <Link href="/applications" className="dashboard-card-link">
              View applications <ArrowRight size={15} />
            </Link>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-heading">
              <span>Financial Overview</span>
              <span className="dashboard-stat-icon">
                <Wallet size={20} aria-hidden="true" />
              </span>
            </div>
            <h2>{formatETB(income - expenses)}</h2>
            <p>Recorded income minus recorded expenses.</p>
            <Link href="/money" className="dashboard-card-link">
              Manage finances <ArrowRight size={15} />
            </Link>
          </article>
        </section>

        <section className="dashboard-insights">
          <div className="dashboard-insights-heading">
            <p className="dashboard-eyebrow">GROW YOUR CAREER</p>
            <h2>Your Teaching Toolkit</h2>
            <p>Useful tools to help you take the next step.</p>
          </div>

          <div className="dashboard-quick-grid">
            {teachingTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  href={tool.href}
                  className="dashboard-quick-card"
                  key={tool.number}
                >
                  <span className="dashboard-tool-icon">
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <span>{tool.number}</span>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <strong>
                    {tool.action} <ArrowRight size={15} aria-hidden="true" />
                  </strong>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Build Your Teaching Profile</h2>
                <p>Help students and learning organizations discover you.</p>
              </div>
            </div>

            <div className="dashboard-personal-tip">
              <span>
                <GraduationCap size={22} aria-hidden="true" />
              </span>
              <div>
                <h3>Show what makes you a great teacher</h3>
                <p>
                  Prepare your subjects, qualifications, teaching experience,
                  and tutoring preferences for your professional profile.
                </p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>01</span>
              <div>
                <h3>Add your subjects</h3>
                <p>List the subjects and grade levels you can teach.</p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>02</span>
              <div>
                <h3>Highlight your experience</h3>
                <p>Include your qualifications and relevant skills.</p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>03</span>
              <div>
                <h3>Explore tutoring work</h3>
                <p>Look for opportunities that match your skills.</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section dashboard-tips">
            <h2>Your Earnings Snapshot</h2>
            <p>Based on your recorded financial transactions.</p>

            <div className="dashboard-personal-tip">
              <span>
                <TrendingUp size={22} aria-hidden="true" />
              </span>
              <div>
                <h3>Total income</h3>
                <p>{formatETB(income)}</p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>−</span>
              <div>
                <h3>Total expenses</h3>
                <p>{formatETB(expenses)}</p>
              </div>
            </div>

            <div className="dashboard-tip-item">
              <span>+</span>
              <div>
                <h3>Remaining balance</h3>
                <p>{formatETB(income - expenses)}</p>
              </div>
            </div>

            <Link href="/money" className="dashboard-primary-button">
              Open Money Manager
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="dashboard-quick-links">
          <div className="dashboard-section-heading">
            <div>
              <h2>More Tools for Teachers</h2>
              <p>Keep your professional goals and finances organized.</p>
            </div>
          </div>

          <div className="dashboard-quick-grid">
            <Link href="/budgets" className="dashboard-quick-card">
              <span className="dashboard-tool-icon">
                <CalendarDays size={22} aria-hidden="true" />
              </span>
              <h3>Monthly Budgets</h3>
              <p>Plan your monthly spending and keep track of your budget.</p>
              <strong>View budgets <ArrowRight size={15} /></strong>
            </Link>

            <Link href="/savings" className="dashboard-quick-card">
              <span className="dashboard-tool-icon">
                <PiggyBank size={22} aria-hidden="true" />
              </span>
              <h3>Savings Goals</h3>
              <p>Set financial goals and track your progress.</p>
              <strong>Manage savings <ArrowRight size={15} /></strong>
            </Link>

            <Link href="/reports" className="dashboard-quick-card">
              <span className="dashboard-tool-icon">
                <BookOpen size={22} aria-hidden="true" />
              </span>
              <h3>Financial Reports</h3>
              <p>Review your recorded income and expenses.</p>
              <strong>View reports <ArrowRight size={15} /></strong>
            </Link>
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>
            TeacherHub Ethiopia · Helping teachers connect, earn, and grow.
          </p>
        </footer>
      </section>
    </main>
  );
}