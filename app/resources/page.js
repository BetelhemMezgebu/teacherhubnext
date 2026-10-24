"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchResources({ queryKey }) {
  const [, search, page] = queryKey;

  const params = new URLSearchParams({
    search,
    page: String(page),
  });

  const response = await fetch(`/api/resources?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load resources.");
  }

  return response.json();
}

export default function ResourcesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["resources", search, page],
    queryFn: fetchResources,
    staleTime: 30 * 1000,
  });

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Teaching Resources</h1>

      <p className="mb-6 text-gray-600">
        Search and browse teaching resources.
      </p>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search teaching resources..."
          aria-label="Search teaching resources"
          className="min-w-0 flex-1 rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={isFetching}
          className="rounded-lg bg-green-800 px-5 py-3 text-white disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {search !== "" && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="mb-5 text-sm text-green-800 underline"
        >
          Clear search
        </button>
      )}

      {isPending && (
        <p role="status" className="my-4">
          Loading resources...
        </p>
      )}

      {isFetching && !isPending && (
        <p role="status" className="mb-3 text-sm text-gray-500">
          Updating resources...
        </p>
      )}

      {isError && (
        <div role="alert" className="my-4 text-red-700">
          <p>{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 underline"
          >
            Try again
          </button>
        </div>
      )}

      {data && !isError && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {data.total} results found
          </p>

          <div className="grid gap-3">
            {data.resources.length > 0 ? (
              data.resources.map((resource) => (
                <article key={resource.id} className="rounded-xl border p-5">
                  <h2 className="font-semibold">{resource.title}</h2>
                  <p className="mt-2 text-gray-600">{resource.description}</p>
                </article>
              ))
            ) : (
              <p>No resources found. Try another search.</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            <span>
              Page {data.page} of {data.totalPages}
            </span>

            <button
              type="button"
              disabled={page >= data.totalPages || isFetching}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
