"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "teacherhub-query-practice";

const initialTransactions = [
  {
    id: 1,
    title: "Tutoring income",
    type: "income",
    amount: 1500,
  },
  {
    id: 2,
    title: "Transport",
    type: "expense",
    amount: 300,
  },
];

const transactionQueryKey = ["teacherhub-demo-transactions"];

async function getTransactions() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTransactions));

    return initialTransactions;
  }

  return JSON.parse(saved);
}

async function createTransaction(transaction) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const saved = localStorage.getItem(STORAGE_KEY);

  const transactions = saved === null ? initialTransactions : JSON.parse(saved);

  const newTransaction = {
    id: Date.now(),
    ...transaction,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newTransaction, ...transactions]),
  );

  return newTransaction;
}

export default function QueryPractice() {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const {
    data: transactions = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: transactionQueryKey,
    queryFn: getTransactions,
    initialData: initialTransactions,
    staleTime: 0,
  });

  const addTransaction = useMutation({
    mutationFn: createTransaction,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKey,
      });

      setTitle("");
      setAmount("");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    addTransaction.mutate({
      title: cleanTitle,
      amount: numericAmount,
      type,
    });
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">TanStack Query Practice</h1>

      <p className="mb-6 text-gray-600">
        Learn queries, mutations, caching, and invalidation.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-xl border p-5"
      >
        <label className="grid gap-2">
          Transaction title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Tutoring income"
            className="rounded-lg border p-3"
            required
          />
        </label>

        <label className="grid gap-2">
          Amount (ETB)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 500"
            className="rounded-lg border p-3"
            required
          />
        </label>

        <label className="grid gap-2">
          Transaction type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-lg border p-3"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={addTransaction.isPending}
          className="rounded-lg bg-green-800 p-3 font-semibold text-white disabled:opacity-60"
        >
          {addTransaction.isPending ? "Adding..." : "Add transaction"}
        </button>

        {addTransaction.isError && (
          <p role="alert" className="text-red-700">
            {addTransaction.error.message}
          </p>
        )}

        {addTransaction.isSuccess && (
          <p className="text-green-800">Transaction added successfully.</p>
        )}
      </form>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transactions</h2>

        <span className="text-sm text-gray-500">
          {isFetching ? "Refreshing..." : "Up to date"}
        </span>
      </div>

      {isPending && <p>Loading transactions...</p>}

      {isError && (
        <p role="alert" className="text-red-700">
          Could not load transactions: {error.message}
        </p>
      )}

      {!isPending && !isError && (
        <div className="grid gap-3">
          {transactions.map((transaction) => (
            <article
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">{transaction.title}</h3>

                <p className="text-sm capitalize text-gray-500">
                  {transaction.type}
                </p>
              </div>

              <strong
                className={
                  transaction.type === "income"
                    ? "text-green-800"
                    : "text-red-700"
                }
              >
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toLocaleString()} ETB
              </strong>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
