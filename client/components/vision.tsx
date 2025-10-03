"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Globe,
  Users,
  Leaf,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface VisionMissionItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
}

interface CoreValue {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

export default function VisionMissionSection(): React.ReactElement {
  const visionMission: VisionMissionItem[] = [
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become the world's most trusted premium spice brand, bringing authentic flavors from global farms to every kitchen while preserving culinary traditions for future generations.",
      highlights: [
        "Global spice heritage preservation",
        "Premium quality standards worldwide",
        "Sustainable farming partnerships",
        "Culinary education & inspiration",
      ],
      gradient: "from-amber-400 to-orange-600",
    },
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Delivering exceptional, farm-fresh spices that transform ordinary meals into extraordinary culinary experiences while supporting sustainable farming communities across the globe.",
      highlights: [
        "Direct farmer partnerships",
        "Zero compromise on quality",
        "Innovative spice blending",
        "Customer culinary success",
      ],
      gradient: "from-red-400 to-rose-600",
    },
  ];

  const coreValues: CoreValue[] = [
    {
      icon: Heart,
      title: "Passion",
      description:
        "Deep love for authentic flavors and culinary excellence drives everything we do.",
      color: "text-rose-500",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "Committed to eco-friendly and supporting sustainable farming communities.",
      color: "text-emerald-500",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Building lasting relationships with farmers, chefs, and food enthusiasts worldwide.",
      color: "text-blue-500",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Uncompromising standards in quality, purity, and customer satisfaction.",
      color: "text-amber-500",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700 mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Our Purpose & Direction
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
            Driven by Purpose
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            Every spice tells a story. Every blend carries tradition. Every
            customer becomes part of our mission to bring authentic flavors and
            sustainable practices to kitchens worldwide.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16  px-1">
          {visionMission.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group"
              >
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                  <div
                    className="h-2 bg-gradient-to-r w-full rounded-t-2xl"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}
                  />

                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-md`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold ml-4 text-gray-800">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                      {item.description}
                    </p>

                    <div className="space-y-3">
                      {item.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle2
                            className={`w-5 h-5 flex-shrink-0 ${
                              item.gradient.includes("orange")
                                ? "text-orange-500"
                                : "text-rose-500"
                            }`}
                          />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Core Values Section */}
        <div className="text-center mb-4">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Our Core Values
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            The fundamental principles that guide our every decision and shape
            our relationships with customers, farmers, and communities.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="mb-4 relative">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gray-50 flex items-center justify-center">
                        <IconComponent className={`w-7 h-7 ${value.color}`} />
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
