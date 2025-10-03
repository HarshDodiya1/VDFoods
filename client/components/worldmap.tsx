"use client";
import { motion } from "motion/react";
import { WorldMap } from "./ui/world-map";

export function WorldMapDemo() {
  return (
    <div className="py-0 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <p className="font-bold text-3xl md:text-5xl dark:text-white text-black">
          VD FOODS{" "}
          <span className="text-neutral-400">
            {"Worldwide".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </p>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto py-4">
          Delivering premium spices and pure oils to every corner of the globe.
          From our farms to your kitchen — freshness without borders.
        </p>
      </div>

      {/* World map */}
      <WorldMap
        dots={[
          {
            start: { lat: 64.2008, lng: -149.4937 },
            end: { lat: 34.0522, lng: -118.2437 },
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]}
      />
    </div>
  );
}
