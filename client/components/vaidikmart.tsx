"use client";
import React, { useState, useEffect } from "react";
import { Heart, Award, Leaf, Shield, Star, Truck, MapPin } from "lucide-react";

const images = ["/vaidik1.jpg", "/vaidik2.jpg", "/vaidik3.jpg", "/vaidik4.jpg"];

const VaidikmartSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 border border-green-700 rounded-full mb-4">
            <Heart className="w-5 h-5 mr-2" />
            <span className="font-semibold">PURE & TRADITIONAL</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-green-700 via-teal-700 to-teal-900 bg-clip-text text-transparent">
            Vaidikmart
          </h2>

          <p className="text-2xl text-gray-600 font-medium mb-4">
            A2 Vedic Bilona Ghee Excellence
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crafted with love using ancient Vedic methods, our pure desi cow
            bilona ghee brings traditional nutrition and authentic flavors to
            your kitchen.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Product Showcase */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-md border border-green-800">
              {/* Product Image */}
              <div className="text-center mb-6">
                <div className="w-60 h-auto  mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="/vaidikmartlogo.jpg"
                    alt="A2 Bilona Ghee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-green-900">
                  A2 Bilona Ghee
                </h3>
                <p className="text-gray-500 mt-1 text-sm">
                  Hand-churned perfection
                </p>
              </div>

              {/* Product Sizes & Prices */}
              <div className="space-y-2">
                {[
                  { size: "500ml", price: "₹999" },
                  { size: "1 Litre", price: "₹1,899" },
                  { size: "2 Litre", price: "₹3,700" },
                  { size: "5 Litre", price: "₹9,249" },
                ].map((item) => (
                  <div
                    key={item.size}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">{item.size}</span>
                    <span className="font-semibold text-green-600">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="https://www.vaidikmart.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 bg-green-800 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm text-center"
              >
                Visit Vaidikmart.com
              </a>
            </div>
          </div>

          {/* Center Column - Image & Process */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative">
              <img
                src={images[currentIndex]}
                alt="Traditional ghee making process"
                className="w-full h-80 object-cover rounded-3xl shadow-xl transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>

              {/* Quality Badge */}
              <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                FSSAI Approved
              </div>

              {/* Traditional Method Badge */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">Bilona</div>
                  <div className="text-xs text-gray-600">
                    Traditional Method
                  </div>
                </div>
              </div>
            </div>
            {/* Process Steps */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-800">
              <h4 className="text-xl font-bold text-gray-700 mb-4 text-center">
                Our Sacred Process
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Desi cow A2 milk collection
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Clay vessel fermentation
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Hand churning with bilona
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">4</span>
                  </div>
                  <span className="text-gray-700 text-sm">
                    Slow heating & purification
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits & Features */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Benefits */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-600">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      100% Pure & Natural
                    </h4>
                    <p className="text-gray-600 text-sm">
                      No chemicals or preservatives
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-600">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">FSSAI Approved</h4>
                    <p className="text-gray-600 text-sm">
                      Certified quality standards
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-600">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Desi Cow A2 Milk
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Premium quality source
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-600">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Traditional Process
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ancient Vedic methods
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl p-6 text-white">
              <h4 className="text-xl font-bold mb-4 text-center">
                Our Promise
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm">Free shipping all over India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">100% money back guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5" />
                  <span className="text-sm">Premium quality assurance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Made with love & care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-3xl p-8 lg:p-8 m-8 shadow-xl">
        <div className=" items-center">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-6 h-6" />
              <span className="font-semibold tracking-wide uppercase text-sm">
                Facility Location
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Strategically Located for Maximum Efficiency
            </h2>

            <p className="text-blue-100 text-lg mb-4">
              Our cold storage and Vaidikmart facility is perfectly positioned
              along the{" "}
              <span className="font-semibold">Deesa - Tharad Highway</span>,
              ensuring seamless logistics and accessibility for the agricultural
              community across Gujarat.
            </p>

            {/* Address */}
            <div className="flex items-start space-x-3 bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <MapPin className="w-6 h-6 text-white mt-1" />
              <div>
                <div className="font-semibold text-lg">
                  Jay Dwarkadhish Cold Store
                </div>
                <p className="text-blue-200">
                  Deesa - Tharad Hwy, Krishna Nagar, Dama, Deesa, Gujarat 385535
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default VaidikmartSection;
