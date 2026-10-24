
import Link from "next/link";

const features = [
  {
    title: "Manage Your Money",
    description:
      "Track your salary, expenses, savings, and debts in one place.",
    href: "/money",
    icon: "💰",
  },
  {
    title: "Find Opportunities",
    description:
      "Discover tutoring jobs and opportunities to earn extra income.",
    href: "/opportunities",
    icon: "📚",
  },
  {
    title: "Track Your Progress",
    description:
      "Understand your finances and work toward your financial goals.",
    href: "/dashboard",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="logo">
          TeacherHub
        </Link>

        <div className="nav-links">
          <Link href="/money">Money</Link>
          <Link href="/opportunities">Opportunities</Link>
          <Link href="/login" className="login-link">
            Login
          </Link>
          <Link href="/register" className="signup-button">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">BUILT FOR ETHIOPIAN TEACHERS</p>

        <h1>
          Your teaching career.
          <br />
          Your financial future.
        </h1>

        <p className="hero-description">
          Manage your salary, understand your spending, and discover
          new opportunities to grow your income — all in one place.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="primary-button">
            Get Started Free →
          </Link>

          <Link href="/opportunities" className="secondary-button">
            Explore Opportunities
          </Link>
        </div>

        <p className="hero-note">
          Designed around the financial needs of Ethiopian teachers.
        </p>
      </section>

      <section className="features">
        <div className="section-heading">
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h2>Everything you need to move forward</h2>
          <p>
            Practical tools to help you manage today and plan for tomorrow.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <Link href={feature.href} className="feature-link">
                Explore feature →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <Link href="/" className="logo">
          TeacherHub
        </Link>
        <p>Supporting the people who shape our future.</p>
        <p>© {new Date().getFullYear()} TeacherHub</p>
      </footer>
    </main>
  );
}
