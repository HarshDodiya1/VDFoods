"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaHeadset,
  FaSeedling,
  FaHandsHelping,
  FaLeaf,
  FaAward,
} from "react-icons/fa";
import { GiCoolSpices, GiPolarStar } from "react-icons/gi";
import { Move } from "./ui/moving-border";
import ShinyText from "./ui/shinytext";
import { TbTruckDelivery } from "react-icons/tb";
import { SparklesIcon } from "lucide-react";

const badges = [
  {
    label: "Premium Spices ",
    icon: <GiCoolSpices className="text-blue-500 text-sm" />,
  },
  {
    label: "Cold Pressed Oils",
    icon: <FaSeedling className="text-blue-500 text-sm" />,
  },
  {
    label: "authentic taste",
    icon: <FaLeaf className="text-blue-500 text-sm" />,
  },
];

const stats = [
  {
    label: "Trusted By Customers",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-600",
    icon: <FaUsers className="text-2xl mx-auto" />,
  },
  {
    label: "24/7 Support",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-600",
    icon: <FaHeadset className="text-2xl mx-auto" />,
  },
  {
    label: "Fast Delivery",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-600",
    icon: <TbTruckDelivery className="text-3xl mx-auto" />,
  },
];

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white w-full py-6 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {/* Left Content */}
        <motion.div
          className="flex-1 max-w-xl order-2 md:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Move
            className="px-1 py-0 bg-gray-100 border border-gray-500 text-gray-500 rounded-full text-sm font-medium inline-flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800 text-base h-5 w-5" />{" "}
            Welcome to VD FOODS
          </Move>

          <motion.h1
            className="text-4xl  leading-tight md:text-5xl lg:text-6xl font-bold relative z-2 font-sans mb-4 lg:mb-2 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ShinyText
              text="Flavours That Truly touch Your Soul"
              disabled={false} // Changed to false to enable the animation
              speed={3} // Adjusted speed
              className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700"
            />
          </motion.h1>

          <p className="text-gray-600 mt-1 text-lg text-justify mb-2">
            At VD FOODS, we don't just sell spices and oils we deliver the
            essence of tradition, purity, and rich aroma. Every pinch of spice
            and every drop of oil carries the warmth of home and the taste of
            authenticity.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 border border-blue-500 rounded-sm bg-gray-50 "
              >
                {badge.icon}
                <span className="text-gray-600 text-sm font-medium">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${stat.bg} flex flex-col items-center justify-center backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-all duration-300 border ${stat.border}`} // Added border color class
              >
                <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                <p className={`text-xl font-bold ${stat.color} text-center`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          className="flex-1 w-full md:w-auto order-1 md:order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-white p-1"
              transition={{ duration: 0.3 }}
            >
              <video
                className="w-full h-[400px] md:h-[600px] object-cover rounded-xl"
                autoPlay
                loop
                muted
                playsInline
                style={{ clipPath: "inset(1px)" }}
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
