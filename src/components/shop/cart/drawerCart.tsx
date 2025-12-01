"use client";
import { useEffect } from "react";
import { useHomeMenu } from "@/components/menu/homeMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import type { Order } from "@/lib/woo-api/orders";
import { fetchCurrentOrder, type OrderResponse } from "@/lib/orders-client";

const formatCurrency = (value: number, currency?: string) => {
  const code = currency || "RON";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(value);
  } catch {
    const fixed = Number.isFinite(value) ? value.toFixed(2) : "0.00";
    return `${fixed} ${code}`;
  }
};

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useHomeMenu();
  const queryClient = useQueryClient();
  const {
    data: order,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<Order, Error>({
    queryKey: ["order", "current"],
    queryFn: fetchCurrentOrder,
    enabled: cartOpen,
    refetchOnWindowFocus: false,
  });

  const removeItem = useMutation<Order, Error, { lineItemId: number }>({
    mutationFn: async ({ lineItemId }) => {
      if (!order?.id) throw new Error("Order not available");
      const response = await fetch(
        `/api/orders/${order.id}/items/${lineItemId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Failed to remove item (${response.statusText})`);
      }
      const payload: OrderResponse = await response.json();
      return payload.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", "current"] });
    },
  });

  const lineItems = order?.line_items ?? [];
  const currency = order?.currency;
  const subtotalValue = lineItems.reduce((sum, item) => {
    const lineTotal = Number(item.total ?? item.subtotal ?? 0);
    return sum + (Number.isFinite(lineTotal) ? lineTotal : 0);
  }, 0);
  const subtotalLabel = formatCurrency(subtotalValue, currency);

  return (
    <div>
      <Dialog open={cartOpen} onClose={setCartOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">
                        Shopping cart
                      </DialogTitle>
                      {isFetching && order && (
                        <span className="text-xs text-gray-500">
                          Updating...
                        </span>
                      )}
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {isLoading && (
                            <li className="py-6 text-sm text-gray-500">
                              Loading cart...
                            </li>
                          )}

                          {isError && (
                            <li className="py-6 text-sm text-red-600">
                              {error?.message ?? "Failed to load cart items."}
                            </li>
                          )}

                          {removeItem.isError && (
                            <li className="py-2 text-sm text-red-600">
                              {removeItem.error?.message ??
                                "Failed to remove item."}
                            </li>
                          )}

                          {!isLoading && !isError && lineItems.length === 0 && (
                            <li className="py-6 text-sm text-gray-500">
                              Your cart is empty.
                            </li>
                          )}

                          {!isLoading &&
                            !isError &&
                            lineItems.map((item) => {
                              const priceLabel = formatCurrency(
                                Number(item.total ?? item.subtotal ?? 0),
                                currency
                              );
                              const quantity = Number(item.quantity ?? 0);
                              const key =
                                item.id ??
                                `${item.product_id}-${item.variation_id ?? "base"}`;

                              return (
                                <li key={key} className="flex py-6">
                                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <div className="flex size-full items-center justify-center bg-gray-50 text-sm font-medium text-gray-400">
                                      {!item.image ? (
                                        (item.name?.charAt(0) ?? "?")
                                      ) : (
                                        <img
                                          src={item.image?.src ?? ""}
                                          alt={item.image?.alt ?? ""}
                                          className="size-full object-cover"
                                        />
                                      )}
                                    </div>
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          {item.name ??
                                            `Product #${item.product_id}`}
                                        </h3>
                                        <p className="ml-4">{priceLabel}</p>
                                      </div>
                                      {item.sku && (
                                        <p className="mt-1 text-sm text-gray-500">
                                          SKU {item.sku}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Qty {quantity}
                                      </p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          disabled={
                                            removeItem.isPending || !item.id
                                          }
                                          className={`font-medium ${
                                            removeItem.isPending || !item.id
                                              ? "text-gray-400"
                                              : "text-indigo-600 hover:text-indigo-500"
                                          }`}
                                          onClick={() =>
                                            item.id &&
                                            removeItem.mutate({
                                              lineItemId: item.id,
                                            })
                                          }
                                        >
                                          {removeItem.isPending
                                            ? "Removing..."
                                            : "Remove"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{subtotalLabel}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
