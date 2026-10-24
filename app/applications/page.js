"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const savedApplications = JSON.parse(
      localStorage.getItem("teacherhub-applications") || "[]",
    );

    setApplications(savedApplications);
  }, []);

  function withdrawApplication(applicationId) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this application?",
    );

    if (!confirmed) return;

    const updatedApplications = applications.filter(
      (application) => application.id !== applicationId,
    );

    localStorage.setItem(
      "teacherhub-applications",
      JSON.stringify(updatedApplications),
    );

    setApplications(updatedApplications);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="applications-page">
      <div className="applications-container">
        <Link href="/dashboard" className="back-link">
          ← Back to dashboard
        </Link>

        <div className="applications-heading">
          <div>
            <p className="apply-eyebrow">YOUR CAREER</p>
            <h1>My Applications</h1>
            <p className="applications-subtitle">
              Keep track of the teaching opportunities you have applied for.
            </p>
          </div>

          <Link href="/opportunities" className="apply-button">
            Find opportunities
          </Link>
        </div>

        <div className="applications-summary">
          <div className="application-stat">
            <span>Total applications</span>
            <strong>{applications.length}</strong>
          </div>

          <div className="application-stat">
            <span>Pending review</span>
            <strong>{applications.length}</strong>
          </div>

          <div className="application-stat">
            <span>Accepted</span>
            <strong>0</strong>
          </div>
        </div>

        {applications.length === 0 ? (
          <section className="applications-empty">
            <div className="empty-icon">↗</div>
            <h2>No applications yet</h2>
            <p>
              Your submitted applications will appear here. Explore available
              opportunities and take your next career step.
            </p>
            <Link href="/opportunities" className="apply-button">
              Explore opportunities
            </Link>
          </section>
        ) : (
          <section className="application-list">
            {applications.map((application) => (
              <article className="application-card" key={application.id}>
                <div className="application-card-top">
                  <div className="application-symbol">T</div>

                  <div className="application-main">
                    <h2>{application.opportunityTitle}</h2>
                    <p>Submitted {formatDate(application.submittedAt)}</p>
                  </div>

                  <span className="application-status">Pending</span>
                </div>

                <div className="application-details">
                  <p>
                    <strong>Applicant:</strong> {application.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {application.email}
                  </p>
                  <p>
                    <strong>Experience:</strong> {application.experience}
                  </p>
                </div>

                <button
                  className="withdraw-button"
                  onClick={() => withdrawApplication(application.id)}
                >
                  Remove application
                </button>
              </article>
            ))}
          </section>
        )}

        <p className="applications-disclaimer">
          Applications are stored in this browser for the project demo.
          Employers are not notified, and statuses are not updated by an
          employer.
        </p>
      </div>
    </main>
  );
}
