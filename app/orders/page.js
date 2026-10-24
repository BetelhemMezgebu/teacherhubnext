"use client";

import { useQuery } from "@tanstack/react-query";

const orderQueryKey = ["teacherhub-demo-order"];

async function fetchOrderStatus() {
  const response = await fetch("/api/order-status");

  if (!response.ok) {
    throw new Error("Unable to load order status.");
  }

  return response.json();
}

export default function OrdersPage() {
  const {
    data: order,
    isPending,
    isError,
    error,
    dataUpdatedAt,
    isFetching,
  } = useQuery({
    queryKey: orderQueryKey,
    queryFn: fetchOrderStatus,
    refetchInterval: 10000,
    staleTime: 0,
  });

  if (isPending) {
    return <main className="p-8">Loading order status...</main>;
  }

  if (isError) {
    return <main className="p-8 text-red-700">{error.message}</main>;
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Order Status</h1>

      <p className="mb-6 text-gray-600">
        This demo checks for status updates every 10 seconds.
      </p>

      <article className="rounded-xl border p-6">
        <p className="text-sm text-gray-500">Order #{order.id}</p>

        <h2 className="my-3 text-xl font-semibold">{order.title}</h2>

        <p>
          Status:{" "}
          <strong className="capitalize text-green-800">{order.status}</strong>
        </p>

        <p className="mt-4 text-sm text-gray-500">
          {isFetching
            ? "Checking for updates..."
            : "Waiting for the next check."}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
        </p>
      </article>
    </main>
  );
}
