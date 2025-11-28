"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { GalleryImage } from "./types";

type ProductGalleryProps = {
  images: GalleryImage[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  return (
    <TabGroup className="flex flex-col-reverse">
      <div className="mx-auto mt-6 w-full max-w-2xl overflow-y-scroll sm:block lg:max-w-none">
        <TabList className="grid grid-cols-4 gap-6 px-5 py-5">
          {images.map((image, index) => (
            <Tab
              key={image.src ?? index}
              className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4"
            >
              <span className="sr-only">{image.alt ?? name}</span>
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Image
                  alt={image.alt ?? name}
                  src={image.src}
                  className="size-full object-cover"
                  fill
                />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
              />
            </Tab>
          ))}
        </TabList>
      </div>

      <TabPanels>
        {images.map((image, index) => (
          <TabPanel key={image.src ?? index}>
            <img
              alt={image.alt ?? name}
              src={image.src}
              className="aspect-square w-full object-cover sm:rounded-lg"
            />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
