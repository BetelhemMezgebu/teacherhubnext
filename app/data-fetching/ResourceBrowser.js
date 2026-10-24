
"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=20";
const PAGE_SIZE = 5;

async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load learning resources.");
  }

  return response.json();
}

export default function ResourceBrowser({ initialResources }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: resources = initialResources,
    error,
    isValidating,
  } = useSWR(API_URL, fetcher, {
    fallbackData: initialResources,
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.body.toLowerCase().includes(query)
      );
    });
  }, [resources, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResources.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleResources = filteredResources.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  return (
    <section style={styles.container}>
      <div style={styles.status}>
        {isValidating
          ? "Refreshing resources..."
          : "Resources are up to date."}
      </div>

      {error && (
        <p role="alert" style={styles.error}>
          Could not refresh resources. Showing the available data.
        </p>
      )}

      <label htmlFor="resource-search" style={styles.label}>
        Search resources
      </label>

      <input
        id="resource-search"
        type="search"
        placeholder="Search titles or descriptions..."
        value={search}
        onChange={handleSearch}
        style={styles.input}
      />

      <p style={styles.count}>
        {filteredResources.length} resources found
      </p>

      {visibleResources.length > 0 ? (
        <div style={styles.grid}>
          {visibleResources.map((resource) => (
            <article key={resource.id} style={styles.card}>
              <span style={styles.number}>
                Resource #{resource.id}
              </span>

              <h2 style={styles.title}>{resource.title}</h2>

              <p style={styles.description}>{resource.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No resources match your search.</p>
      )}

      <div style={styles.pagination}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setPage((previous) => previous - 1)}
          style={styles.button}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => setPage((previous) => previous + 1)}
          style={styles.button}
        >
          Next
        </button>
      </div>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  status: {
    marginBottom: "16px",
    color: "#426b4c",
    fontSize: "14px",
  },
  error: {
    padding: "12px",
    background: "#fff0ed",
    color: "#a12c20",
    borderRadius: "8px",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #e8e9e2",
    borderRadius: "10px",
    background: "#fff",
    fontSize: "16px",
  },
  count: {
    color: "#74796f",
    fontSize: "14px",
    margin: "16px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  card: {
    padding: "22px",
    background: "#fff",
    border: "1px solid #e8e9e2",
    borderRadius: "14px",
  },
  number: {
    color: "#426b4c",
    fontSize: "12px",
    fontWeight: 700,
  },
  title: {
    fontSize: "18px",
    margin: "12px 0",
    textTransform: "capitalize",
  },
  description: {
    color: "#74796f",
    lineHeight: 1.7,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginTop: "28px",
  },
  button: {
    padding: "10px 16px",
    border: "1px solid #e8e9e2",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
};
