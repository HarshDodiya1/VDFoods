import React from "react";
import { Timeline } from "./ui/timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "Step 1: Cultivation & Harvesting",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Our journey begins on organic farms, where spice crops like
            turmeric, cumin, and coriander are grown without any chemical
            pesticides or fertilizers. Farmers carefully nurture the plants
            until they reach peak maturity.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/step1-1.jpg"
              alt="Organic spice farm"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/step1-2.jpg"
              alt="Farmers harvesting spices"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Cleaning & Drying",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Freshly harvested spices are brought to our processing units, where
            they are thoroughly cleaned to remove dust and impurities. They are
            then sun-dried or mechanically dried to lock in their natural aroma
            and flavor.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/step2-1.jpg"
              alt="Spices drying in sun"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/step2-2.jpg"
              alt="Cleaned organic spices"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Grinding & Blending",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Once dried, the spices are ground into fine powders or blended into
            special mixes like garam masala. We use low-temperature grinding to
            preserve essential oils and ensure maximum freshness.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/step3-1.jpg"
              alt="Grinding spices"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/step3-2.jpg"
              alt="Spice blend mix"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Quality Testing",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            Every batch undergoes strict quality checks to ensure purity,
            freshness, and compliance with food safety standards before
            packaging.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/step4-2.jpg"
              alt="Quality testing spices"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/step4-1.jpg"
              alt="Lab testing spices"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 5: Packaging & Delivery",
      content: (
        <div>
          <p className="mb-8 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200">
            The spices are hygienically packed in eco-friendly, airtight
            packaging to retain freshness, then shipped directly to your
            doorstep — bringing the farm’s goodness to your kitchen.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/step5-1.jpg"
              alt="Spice packaging"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/step5-2.jpg"
              alt="Spices delivery"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
