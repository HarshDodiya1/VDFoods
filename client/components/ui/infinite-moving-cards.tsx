"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { Pause, Play } from "lucide-react";

interface InfiniteMovingCardsProps {
  items?: { name?: string; title?: string; quote?: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items = [],
  direction = "left",
  speed = "fast",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLUListElement | null>(null);

  const [start, setStart] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    addAnimation();
    return () => {
      if (scrollerRef.current) {
        const children = Array.from(scrollerRef.current.children);
        children.forEach((el, idx) => {
          if (idx >= items.length) el.remove();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "10s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "30s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "70s");
      }
    }
  };

  const handlePauseToggle = () => {
    setPaused((p) => !p);
  };

  return (
    <div className="relative">
      {/* Cards Container */}
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef}
          style={{ animationPlayState: paused ? "paused" : "running" }}
          className={cn(
            "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
            start && "animate-scroll"
          )}
        >
          {(items || []).map((item, idx) => (
            <li
              className="relative w-[280px] sm:w-[350px] md:w-[400px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
              key={item.name || idx}
            >
              <blockquote>
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>
                <span className="relative z-20 text-xs sm:text-sm leading-[1.6] font-normal text-neutral-600 dark:text-gray-100">
                  {item.quote}
                </span>
                <div className="relative z-20 mt-4 sm:mt-6 flex flex-row items-center">
                  <span className="flex flex-col gap-1">
                    <span className="text-xs sm:text-sm leading-[1.6] font-normal text-black dark:text-gray-400">
                      {item.name}
                    </span>
                    <span className="text-xs sm:text-sm leading-[1.6] font-normal text-neutral-700 dark:text-gray-400">
                      {item.title}
                    </span>
                  </span>
                </div>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>

      {/* Control Button - positioned below the cards on the left side */}
      <div className="flex justify-start mt-4  sm:pl-10">
        <button
          onClick={handlePauseToggle}
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-100 transition-colors "
          aria-label={paused ? "Play animation" : "Pause animation"}
        >
          {paused ? (
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
