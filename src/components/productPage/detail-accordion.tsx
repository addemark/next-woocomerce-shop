"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DetailSection } from "./types";

type DetailAccordionProps = {
  sections: DetailSection[];
};

export function DetailAccordion({ sections }: DetailAccordionProps) {
  if (!sections.length) return null;

  return (
    <section aria-labelledby="details-heading" className="mt-12">
      <h2 id="details-heading" className="sr-only">
        Additional details
      </h2>

      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {sections.map((detail) => (
          <Disclosure key={detail.name} as="div">
            <h3>
              <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                  {detail.name}
                </span>
                <span className="ml-6 flex items-center">
                  <PlusIcon
                    aria-hidden="true"
                    className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                  />
                  <MinusIcon
                    aria-hidden="true"
                    className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-open:block"
                  />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel className="pb-6">
              <ul
                role="list"
                className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
              >
                {detail.items.map((item) => (
                  <li key={item} className="pl-2">
                    {item}
                  </li>
                ))}
              </ul>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
