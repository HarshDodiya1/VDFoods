"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, Leaf, Crown, Shield, Heart } from "lucide-react";

interface Reason {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

export default function ReasonsToBuySpices(): React.ReactElement {
  const reasons: Reason[] = [
    {
      icon: Leaf,
      title: "Freshness",
      description:
        "Experience the vibrant essence of handpicked spices, carefully sourced from organic farms and delivered at peak freshness.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: Crown,
      title: "Artisan Craftsmanship",
      description:
        "Master blenders using time-honored techniques to create exceptional spice profiles that elevate your cooking to new heights.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Rigorous testing and careful selection ensure every spice meets our exceptional standards for purity and potency.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Heart,
      title: "Community",
      description:
        "Building lasting relationships with local farmers while bringing you authentic flavors that support sustainable agriculture.",
      gradient: "from-rose-500 to-pink-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="relative py-8 bg-white overflow-hidden">
      {/* Elegant White Background with Subtle Patterns */}
      <div className="absolute inset-0">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="spice-pattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="2" fill="#ea580c" opacity="0.3" />
                <circle cx="20" cy="20" r="1.5" fill="#dc2626" opacity="0.2" />
                <circle cx="60" cy="20" r="1" fill="#f59e0b" opacity="0.2" />
                <circle cx="20" cy="60" r="1" fill="#f59e0b" opacity="0.2" />
                <circle cx="60" cy="60" r="1.5" fill="#dc2626" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spice-pattern)" />
          </svg>
        </div>

        {/* Subtle Floating Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-100/25 to-yellow-100/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-red-100/20 to-orange-100/25 rounded-full blur-3xl"></div>
      </div>

      {/* Delicate Floating Spice Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 15, top: 20 },
          { left: 80, top: 35 },
          { left: 25, top: 70 },
          { left: 65, top: 15 },
          { left: 45, top: 85 },
          { left: 90, top: 60 },
          { left: 10, top: 45 },
          { left: 70, top: 75 }
        ].map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-orange-300/60 to-red-300/60 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [-15, 15],
              x: [-8, 8],
              scale: [0.6, 1, 0.6],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + (i * 0.3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            World-Class Spice Collection
            <Award className="w-4 h-4" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 text-transparent bg-clip-text">
              Why Choose Our
            </span>
            <span className="text-gray-600"> Spices & Oils?</span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the difference that authentic, premium-quality spices and
            oils can make in your culinary journey.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1,
            },
          }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay: index * 0.2,
                  },
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.0,
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className="group relative"
              >
                <div
                  className={`absolute inset-0 bg-white rounded-3xl backdrop-blur-sm border border-gray-100 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200`}
                ></div>

                {/* Gradient Background (default) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-10 rounded-3xl group-hover:opacity-0 transition-opacity duration-300`}
                ></div>

                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <motion.div
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed text-sm group-hover:text-slate-700 transition-colors">
                    {reason.description}
                  </p>

                  {/* Bottom Accent Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                    className={`h-1 bg-gradient-to-r ${reason.gradient} mx-auto mt-6 rounded-full`}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
