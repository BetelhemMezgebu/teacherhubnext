
"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const initialTransactions = [
  { id: 1, title: "Transportation", amount: 500 },
  { id: 2, title: "Food", amount: 1200 },
];

function getTransactions() {
  return initialTransactions;
}

export default function QueryPracticePage() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const queryClient = useQueryClient();

  const {
    data: transactions,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["practice-transactions"],
    queryFn: getTransactions,
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction) => {
      return newTransaction;
    },
    onSuccess: (newTransaction) => {
      queryClient.setQueryData(
        ["practice-transactions"],
        (oldTransactions = []) => [
          ...oldTransactions,
          newTransaction,
        ]
      );

      setTitle("");
      setAmount("");
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const numericAmount = Number(amount);

    if (!trimmedTitle || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    addTransactionMutation.mutate({
      id: Date.now(),
      title: trimmedTitle,
      amount: numericAmount,
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Transaction Practice
      </h1>

      <p className="mb-6 text-gray-600">
        Practice adding expenses with TanStack Query.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid gap-3 rounded-xl border p-5"
      >
        <label className="grid gap-1">
          Expense name
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Internet"
            className="rounded-lg border p-3"
            required
          />
        </label>

        <label className="grid gap-1">
          Amount (ETB)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="e.g. 300"
            className="rounded-lg border p-3"
            required
          />
        </label>

        <button
          type="submit"
          disabled={addTransactionMutation.isPending}
          className="rounded-lg bg-green-800 p-3 text-white disabled:opacity-50"
        >
          {addTransactionMutation.isPending
            ? "Adding..."
            : "Add Expense"}
        </button>

        {addTransactionMutation.isError && (
          <p role="alert" className="text-red-700">
            Failed to add expense.
          </p>
        )}

        {addTransactionMutation.isSuccess && (
          <p role="status" className="text-green-800">
            Expense added successfully!
          </p>
        )}
      </form>

      {isPending && <p>Loading transactions...</p>}

      {isError && (
        <p role="alert" className="text-red-700">
          {error.message}
        </p>
      )}

      {transactions && (
        <div className="grid gap-3">
          {transactions.map((transaction) => (
            <article
              key={transaction.id}
              className="flex items-center justify-between rounded-xl border p-5"
            >
              <h2 className="font-semibold">{transaction.title}</h2>
              <p>{transaction.amount.toLocaleString()} ETB</p>
            </article>
          ))}

          <div className="mt-3 rounded-xl bg-gray-100 p-5">
            <p className="font-semibold">Total expenses</p>
            <p className="mt-1 text-2xl font-bold">
              {transactions
                .reduce(
                  (total, transaction) => total + transaction.amount,
                  0
                )
                .toLocaleString()}{" "}
              ETB
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
