"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.pageYOffset;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        const progress = Math.min((currentProgress / scrollHeight) * 100, 100);
        setScrollProgress(progress);
      }
    };

    const handleScroll = () => {
      updateScrollProgress();
    };

    window.addEventListener("scroll", handleScroll);
    // Call once to set initial progress
    updateScrollProgress();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate stroke-dashoffset for circular progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* SVG Progress Circle */}
        <svg
          className="absolute inset-0 w-14 h-14 transform -rotate-90"
          viewBox="0 0 56 56"
        >
          {/* Background Circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#00796B"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.1s linear",
            }}
          />
        </svg>

        {/* Arrow Icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp
            className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
            strokeWidth={2.5}
          />
        </motion.div>

        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <span className="font-medium">
            Back to top ({Math.round(scrollProgress)}%)
          </span>
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-y-4 border-y-transparent" />
        </div>
      </motion.button>
    </div>
  );
};

export default ScrollToTopButton;
