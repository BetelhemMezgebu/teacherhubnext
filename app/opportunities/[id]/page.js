
import Link from "next/link";
import { notFound } from "next/navigation";

const opportunities = [
  {
    id: "1",
    title: "Mathematics Tutor",
    organization: "Private Family",
    location: "Addis Ababa",
    type: "Tutoring",
    subject: "Mathematics",
    pay: 500,
    period: "per session",
    schedule: "Flexible evenings",
    description:
      "Help secondary school students strengthen their mathematics skills and prepare for examinations.",
    responsibilities: [
      "Prepare lessons based on student needs.",
      "Explain mathematical concepts clearly.",
      "Provide practice exercises and feedback.",
      "Track student learning progress.",
    ],
    requirements: [
      "Strong mathematics knowledge.",
      "Good communication skills.",
      "Ability to explain concepts patiently.",
    ],
  },
  {
    id: "2",
    title: "English Language Tutor",
    organization: "Learning Center",
    location: "Hawassa",
    type: "Tutoring",
    subject: "English",
    pay: 400,
    period: "per session",
    schedule: "Weekends",
    description:
      "Support learners with English grammar, reading, writing, and conversational skills.",
    responsibilities: [
      "Prepare English lessons.",
      "Practice reading and speaking with learners.",
      "Give constructive feedback.",
    ],
    requirements: [
      "Strong English language skills.",
      "Patience when teaching beginners.",
      "Good communication skills.",
    ],
  },
  {
    id: "3",
    title: "Science Tutor",
    organization: "Private Family",
    location: "Adama",
    type: "Tutoring",
    subject: "Science",
    pay: 600,
    period: "per session",
    schedule: "Three evenings per week",
    description:
      "Provide additional science lessons and help students understand difficult concepts.",
    responsibilities: [
      "Prepare science lessons.",
      "Explain concepts with practical examples.",
      "Help students prepare for examinations.",
    ],
    requirements: [
      "Strong science subject knowledge.",
      "Clear communication.",
      "Ability to support student learning.",
    ],
  },
  {
    id: "4",
    title: "Online Programming Instructor",
    organization: "Online Learning Program",
    location: "Remote",
    type: "Online",
    subject: "Programming",
    pay: 800,
    period: "per session",
    schedule: "Flexible remote hours",
    description:
      "Teach programming fundamentals to beginners through online lessons.",
    responsibilities: [
      "Prepare beginner-friendly programming lessons.",
      "Demonstrate programming concepts.",
      "Help learners practice and debug code.",
    ],
    requirements: [
      "Programming knowledge.",
      "Reliable internet access.",
      "Ability to explain technical concepts.",
    ],
  },
  {
    id: "5",
    title: "Study Materials Creator",
    organization: "Education Content Team",
    location: "Remote",
    type: "Freelance",
    subject: "Educational Content",
    pay: 1000,
    period: "per project",
    schedule: "Project-based",
    description:
      "Create clear study notes, exercises, and revision materials for school students.",
    responsibilities: [
      "Create educational notes and exercises.",
      "Review content for clarity and accuracy.",
      "Organize materials for student use.",
    ],
    requirements: [
      "Strong writing skills.",
      "Subject knowledge.",
      "Attention to detail.",
    ],
  },
  {
    id: "6",
    title: "ICT Tutor",
    organization: "Community Learning Center",
    location: "Hawassa",
    type: "Tutoring",
    subject: "ICT",
    pay: 450,
    period: "per session",
    schedule: "Weekends",
    description:
      "Teach basic computer skills, digital literacy, and introductory ICT concepts.",
    responsibilities: [
      "Teach basic computer operations.",
      "Demonstrate digital tools.",
      "Help learners practice computer skills.",
    ],
    requirements: [
      "Basic ICT knowledge.",
      "Patience and communication skills.",
      "Ability to guide beginner learners.",
    ],
  },
];

const formatETB = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount);

export default async function OpportunityDetailsPage({ params }) {
  const { id } = await params;

  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="opportunity-details-page">
      <Link href="/opportunities" className="back-link">
        ← All opportunities
      </Link>

      <section className="opportunity-details-layout">
        <article className="opportunity-details-main">
          <span className="opportunity-type">{opportunity.type}</span>

          <h1>{opportunity.title}</h1>
          <p className="details-organization">
            {opportunity.organization}
          </p>

          <div className="details-meta">
            <span>📍 {opportunity.location}</span>
            <span>📘 {opportunity.subject}</span>
            <span>🗓 {opportunity.schedule}</span>
          </div>

          <section className="details-section">
            <h2>About this opportunity</h2>
            <p>{opportunity.description}</p>
          </section>

          <section className="details-section">
            <h2>Responsibilities</h2>
            <ul>
              {opportunity.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="details-section">
            <h2>Requirements</h2>
            <ul>
              {opportunity.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <p className="details-disclaimer">
            Demo listing only. This is not a verified vacancy, and
            the stated compensation is illustrative.
          </p>
        </article>

        <aside className="opportunity-apply-card">
          <p className="eyebrow">COMPENSATION</p>

          <h2>{formatETB(opportunity.pay)}</h2>
          <p>{opportunity.period}</p>

          <div className="apply-divider" />

          <p>
            <strong>Location</strong>
            <br />
            {opportunity.location}
          </p>

          <p>
            <strong>Schedule</strong>
            <br />
            {opportunity.schedule}
          </p>

          <Link
            href={`/opportunities/${opportunity.id}/apply`}
            className="primary-button apply-button"
          >
            Apply for Opportunity →
          </Link>

          <p className="apply-note">
            Application functionality will be connected in the next step.
          </p>
        </aside>
      </section>
    </main>
  );
}
