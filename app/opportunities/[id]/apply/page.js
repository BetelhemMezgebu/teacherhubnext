
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const opportunities = {
  "1": "Mathematics Tutor",
  "2": "Part-Time English Teacher",
  "3": "Physics Tutor",
  "4": "Primary School Teacher",
  "5": "Online Programming Tutor",
  "6": "Chemistry Tutor",
};

export default function ApplyPage() {
  const { id } = useParams();
  const opportunityTitle = opportunities[id];

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!opportunityTitle) {
      return;
    }
  }, [opportunityTitle]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const existingApplications = JSON.parse(
      localStorage.getItem("teacherhub-applications") || "[]"
    );

    const newApplication = {
      id: crypto.randomUUID(),
      opportunityId: id,
      opportunityTitle,
      ...form,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "teacherhub-applications",
      JSON.stringify([...existingApplications, newApplication])
    );

    setSubmitted(true);
  }

  if (!opportunityTitle) {
    return (
      <main className="apply-page">
        <div className="apply-card">
          <h1>Opportunity not found</h1>
          <Link href="/opportunities">Browse opportunities</Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="apply-page">
        <div className="apply-card success-card">
          <div className="success-icon">✓</div>
          <h1>Application saved!</h1>
          <p>
            Your application for <strong>{opportunityTitle}</strong> has
            been saved in this browser.
          </p>
          <Link className="apply-button" href="/opportunities">
            Browse more opportunities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="apply-page">
      <div className="apply-card">
        <Link className="back-link" href={`/opportunities/${id}`}>
          ← Back to opportunity
        </Link>

        <p className="apply-eyebrow">TEACHERHUB APPLICATION</p>
        <h1>Apply for this opportunity</h1>
        <p className="apply-subtitle">{opportunityTitle}</p>

        <form className="apply-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <label htmlFor="experience">Teaching experience</label>
          <select
            id="experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select your experience</option>
            <option value="No experience yet">No experience yet</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1–3 years">1–3 years</option>
            <option value="More than 3 years">More than 3 years</option>
          </select>

          <label htmlFor="message">Why are you a good fit?</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Introduce yourself and explain why you are interested..."
            rows={5}
            required
          />

          <button className="apply-button" type="submit">
            Submit application
          </button>
        </form>

        <p className="privacy-note">
          Demo: your application is stored locally in this browser.
        </p>
      </div>
    </main>
  );
}
