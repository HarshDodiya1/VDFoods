"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[30rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-600 mb-2">
          What Our Customers Say
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Hear from our happy customers who love VD Foods{" "}
          <span className="text-amber-600 font-medium">
            {" "}
            premium spices and cold-pressed oils{" "}
          </span>
          crafted for
          <span className="font-medium text-teal-600">
            {" "}
            taste, health, and purity.
          </span>
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "The aroma of VD Foods spices takes my cooking to a whole new level. You can truly taste the freshness in every pinch.",
    name: "Anita Verma",
    title: "Ahmedabad, Gujarat",
  },
  {
    quote:
      "I switched to VD Foods cold-pressed oils for my family, and I’ve never looked back. Pure, healthy, and absolutely delicious.",
    name: "Ramesh Nair",
    title: "surat, Gujarat",
  },
  {
    quote:
      "From garam masala to turmeric, every product from VD Foods feels like it came straight from the farm to my kitchen.",
    name: "Pooja Sharma",
    title: "Pune, Maharashtra",
  },
  {
    quote:
      "Cooking with VD Foods spices makes my dishes rich in flavor without needing any artificial additives.",
    name: "Vikram Singh",
    title: "Jaipur, Rajasthan",
  },
  {
    quote:
      "Their oils are light, aromatic, and perfect for both everyday cooking and special dishes. Highly recommend VD Foods!",
    name: "Meena Joshi",
    title: "Vadodara, Gujarat",
  },
];
