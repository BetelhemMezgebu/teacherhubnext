"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
    description:
      "Help secondary school students strengthen their mathematics skills and prepare for examinations.",
    schedule: "Flexible evenings",
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
    description:
      "Support learners with English grammar, reading, writing, and conversational skills.",
    schedule: "Weekends",
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
    description:
      "Provide additional science lessons and help students understand difficult concepts.",
    schedule: "Three evenings per week",
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
    description:
      "Teach programming fundamentals to beginners through online lessons.",
    schedule: "Flexible remote hours",
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
    description:
      "Create clear study notes, exercises, and revision materials for school students.",
    schedule: "Project-based",
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
    description:
      "Teach basic computer skills, digital literacy, and introductory ICT concepts.",
    schedule: "Weekends",
  },
];

const formatETB = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(amount);

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [type, setType] = useState("All types");
  const [savedIds, setSavedIds] = useState([]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((item) => {
      const searchText =
        `${item.title} ${item.subject} ${item.organization}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesLocation =
        location === "All locations" || item.location === location;
      const matchesType = type === "All types" || item.type === type;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [search, location, type]);

  function toggleSaved(id) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }

  return (
    <main className="opportunities-page">
      <header className="opportunities-header">
        <Link href="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <p className="eyebrow">GROW YOUR INCOME</p>
        <h1>Teaching Opportunities</h1>
        <p>
          Discover tutoring, online teaching, and freelance work that fits your
          skills and schedule.
        </p>
      </header>

      <section className="opportunities-tools">
        <input
          type="search"
          aria-label="Search opportunities"
          placeholder="Search by title, subject, or organization..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filter by location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        >
          <option>All locations</option>
          <option>Addis Ababa</option>
          <option>Hawassa</option>
          <option>Adama</option>
          <option>Remote</option>
        </select>

        <select
          aria-label="Filter by opportunity type"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option>All types</option>
          <option>Tutoring</option>
          <option>Online</option>
          <option>Freelance</option>
        </select>
      </section>

      <div className="opportunities-results">
        <h2>Available opportunities</h2>
        <span>{filteredOpportunities.length} opportunities</span>
      </div>

      <section className="opportunities-grid">
        {filteredOpportunities.map((item) => (
          <article className="opportunity-card" key={item.id}>
            <div className="opportunity-card-top">
              <span className="opportunity-type">{item.type}</span>

              <button
                type="button"
                className={`save-opportunity ${
                  savedIds.includes(item.id) ? "saved" : ""
                }`}
                onClick={() => toggleSaved(item.id)}
                aria-label={
                  savedIds.includes(item.id)
                    ? `Unsave ${item.title}`
                    : `Save ${item.title}`
                }
              >
                {savedIds.includes(item.id) ? "♥" : "♡"}
              </button>
            </div>

            <h3>{item.title}</h3>
            <p className="opportunity-organization">{item.organization}</p>

            <div className="opportunity-meta">
              <span>📍 {item.location}</span>
              <span>📘 {item.subject}</span>
            </div>

            <p className="opportunity-description">{item.description}</p>

            <div className="opportunity-card-bottom">
              <div>
                <strong>{formatETB(item.pay)}</strong>
                <span>{item.period}</span>
              </div>

              <Link
                href={`/opportunities/${item.id}`}
                className="opportunity-view"
              >
                View details →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {filteredOpportunities.length === 0 && (
        <div className="opportunities-empty">
          <h3>No matching opportunities</h3>
          <p>Try changing your search or filters.</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setLocation("All locations");
              setType("All types");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <p className="opportunities-disclaimer">
        These are sample listings for demonstration, not verified or currently
        available jobs. Pay amounts are illustrative.
      </p>
    </main>
  );
}
