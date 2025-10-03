"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CTASection = () => {
  const router = useRouter();
  const handleTalkToUs = () => {
    router.push("/products");
  };

  return (
    <section className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 lg:ml-16 mb-8 lg:mr-16 ml-4 mr-4  mt-20 border-2  border-dashed border-gray-400">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-3xl  sm:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-600 leading-tight">
                Looking for{" "}
                <span className="font-semibold text-black">
                  premium spices & oils
                </span>{" "}
                to transform your cooking?{" "}
                <span className="font-semibold text-black">Get in touch</span>
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                We’ve helped{" "}
                <span className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
                  countless home chefs, restaurants, and food lovers
                </span>{" "}
                bring richer flavors and authentic taste to their dishes with
                our pure, high-quality spices and cold-pressed oils and we can
                help you too.
              </p>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                From farm-fresh sourcing to careful packaging, every product
                from vd foods is made to deliver{" "}
                <span className="font-medium text-teal-600">
                  freshness, aroma, and health benefits{" "}
                </span>
                straight to your kitchen.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                onClick={handleTalkToUs}
                className="px-6 py-2 bg-gray-600 text-white font-medium text-base rounded-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
              >
                Shop Now
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Testimonial Card */}
            <div className="bg-white m-2 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl shadow-gray-100 border border-gray-100 relative ">
              {/* Quote Icon or Decoration */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-teal-500 rounded-full opacity-10"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-orange-500 rounded-full opacity-10"></div>

              {/* Testimonial Text */}
              <div className="space-y-6">
                <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed italic">
                  "VD Foods took our vision and turned it into reality. If
                  you’re reading this I can’t recommend them enough. Quality,
                  flavor, and care will exceed every single expectation you
                  have."
                </blockquote>

                {/* Author Info */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="font-bold text-xl text-gray-900">
                      Vishnu Chaudhary
                    </div>
                    <div className="text-gray-500 font-medium">
                      Founder - VD FOODS.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 transform translate-x-4 translate-y-4">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
