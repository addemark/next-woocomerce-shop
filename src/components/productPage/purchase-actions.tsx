import { HeartIcon } from "@heroicons/react/24/outline";

export function PurchaseActions() {
  return (
    <div className="mt-10 flex">
      <button
        type="button"
        className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
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
