"use client";

import { Button } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PurchaseActionsProps = {
  disabled?: boolean;
  productId: number;
  variationId?: number;
  quantity?: number;
  onOrderReady?: (orderId: number) => void;
};

export function PurchaseActions({
  disabled,
  productId,
  variationId,
  quantity = 1,
  onOrderReady,
}: PurchaseActionsProps) {
  const queryClient = useQueryClient();
  const addToOrder = useMutation<
    { data: { id: number }; totalItems?: number },
    Error
  >({
    mutationFn: async () => {
      const response = await fetch("/api/orders/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          variationId,
          quantity,
        }),
      });
      if (!response.ok) {
        throw new Error(`Order request failed (${response.statusText})`);
      }
      return response.json() as Promise<{
        data: { id: number };
        totalItems?: number;
      }>;
    },
    onSuccess: (result) => {
      const orderId = result?.data?.id;
      if (orderId) {
        onOrderReady?.(orderId);
      }
      queryClient.invalidateQueries({ queryKey: ["order", "current"] });
    },
  });

  const isDisabled = disabled || addToOrder.isPending;
  const label = addToOrder.isPending ? "Processing..." : "Add to bag";

  return (
    <div className="mt-10 flex">
      <Button
        type="button"
        disabled={isDisabled}
        className={`flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium sm:w-full ${
          isDisabled
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        }`}
        onClick={() => addToOrder.mutate()}
      >
        {label}
      </Button>

      <Button
        type="button"
        className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      >
        <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
        <span className="sr-only">Add to favorites</span>
      </Button>
    </div>
  );
}
