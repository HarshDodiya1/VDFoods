"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const processes = [
  {
    title: "Farming",
    desc: "Fresh and organic spices are grown and harvested with care from the best farms.",
    animation:
      "https://lottie.host/cc9b117b-85c1-4a60-96ad-6dbcc062f35a/bgH18IGa6Z.lottie",
    bg: "bg-amber-200",
    border: "border-amber-400 hover:border-orange-400",
  },
  {
    title: "Processing & Packaging",
    desc: "Spices are cleaned, ground, and carefully packed to preserve their freshness and aroma.",
    animation:
      "https://lottie.host/30a33444-487d-4eb8-acd7-e4d2bea02cda/WnTrD37D58.lottie",
    bg: "bg-sky-200",
    border: "border-sky-400 hover:border-sky-800",
  },
  {
    title: "Delivery",
    desc: "Your favorite spices are delivered with speed and care, right to your doorstep.",
    animation:
      "https://lottie.host/f9656575-f8ba-4929-87c4-a942ab91987a/pkYo8Qh8yo.lottie",
    bg: "bg-red-200",
    border: "border-red-400 hover:border-pink-600",
  },
];

const ProcessCards: React.FC = () => {
  return (
    <section className="py-12 px-6 md:px-16 lg:px-24 item-center justify-center">
      <div className="flex justify-center">
        <h2 className="relative inline-block text-4xl md:text-7xl font-bold text-gray-600 mb-12 bg-gray-200 p-2 rounded-2xl">
          Our spice journey
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {processes.map((process, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 transition duration-300 ${process.bg} flex flex-col justify-between border-2 ${process.border}`}
          >
            <div>
              <h3 className="text-xl font-bold mb-2">{process.title}</h3>
              <p className="text-gray-700 mb-4">{process.desc}</p>
            </div>
            <div className="flex justify-center items-center">
              <DotLottieReact
                src={process.animation}
                loop
                autoplay
                style={{ height: "300px", width: "300px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessCards;
