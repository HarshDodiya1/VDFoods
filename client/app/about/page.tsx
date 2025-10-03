import React from "react";
import { HiMiniArrowTurnRightDown } from "react-icons/hi2";
import { TimelineDemo } from "components/process";
import ColdStoreSection from "components/coldstore";
import VaidikmartSection from "components/vaidikmart";

export const dynamic = "force-dynamic";

const AboutHeroSection: React.FC = () => {
  return (
    <section className="bg-white min-h-screen py-20 mt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-5">
            {/* Section Label */}
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <span className="flex items-center gap-2 text-gray-500 font-medium tracking-wider uppercase text-sm">
                OUR STORY
                <HiMiniArrowTurnRightDown className="text-xl font-bold mt-3" />{" "}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 leading-tight">
                Your Flavor Our Expertise Your Kitchen Get Noticed Generate
                <span className="text-red-500"> Taste Dominate.</span>
              </h1>
            </div>

            {/* Large Main Image */}
            <div className="w-full">
              <img
                src="/heroimg.jpg"
                alt="Spice grinding process"
                className="w-full h-105 object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {/* Top Row Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <img
                  src="/spice.jpg"
                  alt="Spice img"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="px-2 py-1 text-white bg-opacity-70 bg-gray-800 text-xs rounded-full">
                    Tech Blog
                  </span>
                  <span className="px-2 py-1 text-white bg-opacity-70 bg-gray-800 text-xs rounded-full">
                    Trends
                  </span>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/spice2.jpg"
                  alt="Premium spices"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="px-2 py-1 bg-gray-800 bg-opacity-70 text-white text-xs rounded-full">
                    Tech Blog
                  </span>
                  <span className="px-2 py-1 bg-gray-800 bg-opacity-70 text-white text-xs rounded-full">
                    Trends
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed text-justify">
              "Discover the essence of authentic flavors with our premium spice
              collection. Handpicked from trusted farms, our spices bring aroma,
              taste, and health benefits straight to your kitchen. From everyday
              essentials to rare finds, every blend is crafted to enhance your
              cooking and elevate every meal into an unforgettable experience."
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
              <div className="bg-red-500 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">
                  10+
                </div>
                <div className="text-white text-xs sm:text-sm font-medium text-center">
                  Completed Projects
                </div>
              </div>

              <div className="bg-red-500 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">
                  5k+
                </div>
                <div className="text-white text-xs sm:text-sm font-medium text-center">
                  Satisfied Customer
                </div>
              </div>

              <div className="bg-red-500 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">
                  1+
                </div>
                <div className="text-white text-xs sm:text-sm font-medium text-center">
                  Years Of Success
                </div>
              </div>

              <div className="bg-red-500 p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-white text-center">
                  45+
                </div>
                <div className="text-white text-xs sm:text-sm font-medium text-center">
                  Worldwide Delivery
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
              {/* Title */}
              <button className="flex items-center justify-center group">
                <span className="text-gray-400 font-serif font-medium text-3xl text-center">
                  MEET THE TEAM
                </span>
              </button>

              {/* Images with tooltips */}
              <div className="flex -space-x-2 justify-center">
                {/* Founder */}
                <div className="relative group">
                  <img
                    className="w-24 h-24 rounded-full border-2 border-white cursor-pointer"
                    src="/founder.jpg"
                    alt="Founder"
                  />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap">
                    VD Chaudhary
                  </span>
                </div>

                {/* Co-Founder */}
                <div className="relative group">
                  <img
                    className="w-24 h-24 rounded-full border-2 border-white cursor-pointer"
                    src="/fndr2.png"
                    alt="Co-Founder"
                  />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap">
                    DB Chaudhary
                  </span>
                </div>

                {/* Partner */}
                <div className="relative group">
                  <img
                    className="w-24 h-24 rounded-full border-2 border-white cursor-pointer"
                    src="/yspl.png"
                    alt="Partner"
                  />
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap">
                    Yaspal Chaudhary
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TimelineDemo />
      <ColdStoreSection />
      <VaidikmartSection />
    </section>
  );
};

export default AboutHeroSection;
