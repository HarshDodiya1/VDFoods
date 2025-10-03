import React from "react";
import {
  MapPin,
  Thermometer,
  Warehouse,
  Shield,
  Truck,
  Clock,
} from "lucide-react";

const ColdStoreSection: React.FC = () => {
  return (
    <section className="bg-white py-0 mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 border border-amber-700 rounded-full mb-6">
            <Warehouse className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">OUR INFRASTRUCTURE</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-600 mb-6">
            <span className="text-amber-600">Jay Dwarkadhish Cold Store</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            State-of-the-art cold storage facility ensuring premium quality
            preservation of potatoes and agricultural produce with advanced
            temperature control systems.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Image & Visual */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Cold storage facility"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

              {/* Temperature Indicator */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      2-4°C
                    </div>
                    <div className="text-sm text-gray-600">Optimal Storage</div>
                  </div>
                </div>
              </div>

              {/* Capacity Badge */}
              <div className="absolute bottom-6 right-6 bg-amber-600 text-white rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">7000+</div>
                  <div className="text-sm opacity-90">Tons Capacity</div>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-8 -left-4 bg-green-50 rounded-2xl shadow-xl p-3 border border-green-600">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">99.8%</div>
                  <div className="text-sm text-gray-600">Quality Retention</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-purple-50 rounded-2xl shadow-xl p-4 border border-purple-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-bold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Temperature Control
                </h3>
                <p className="text-gray-600 text-sm">
                  Advanced climate control systems maintaining optimal storage
                  conditions
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Warehouse className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Large Capacity</h3>
                <p className="text-gray-600 text-sm">
                  Spacious storage facility accommodating bulk agricultural
                  produce
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Quality Assurance
                </h3>
                <p className="text-gray-600 text-sm">
                  Rigorous quality control ensuring product freshness and safety
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Easy Access</h3>
                <p className="text-gray-600 text-sm">
                  Strategic location with excellent connectivity for efficient
                  logistics
                </p>
              </div>
            </div>

            {/* Specialization */}

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Specialization
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">
                    Premium potato storage and preservation
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">
                    Agricultural produce cold chain management
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">
                    Temperature-controlled storage solutions
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-gray-700">
                    Bulk storage for wholesale distribution
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColdStoreSection;
