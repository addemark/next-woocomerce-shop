'use client';

import { HeartIcon } from "@heroicons/react/24/outline";

type PurchaseActionsProps = {
  disabled?: boolean;
};

export function PurchaseActions({ disabled }: PurchaseActionsProps) {
  return (
    <div className="mt-10 flex">
      <button
        type="button"
        disabled={disabled}
        className={`flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium sm:w-full ${
          disabled
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        }`}
      >
        Add to bag
      </button>

      <button
        type="button"
        className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      >
        <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
        <span className="sr-only">Add to favorites</span>
      </button>
    </div>
  );
}
