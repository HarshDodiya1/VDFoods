"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Star,
  MessageSquare,
  User,
  Building,
  Zap,
  Award,
  CheckCircle2,
} from "lucide-react";
import apiService, { type ContactFormData } from "../../utils/api";

export const dynamic = "force-dynamic";

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  details: string[];
  color: string;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    inquiryType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: "Speak with Team",
      details: ["+91 9104029941", "Available 9AM - 8PM"],
      color: "text-emerald-600",
    },
    {
      icon: Mail,
      title: "Email Inquiries",
      details: ["vdfoods77@gmail.com", "Quick 24hr Response"],
      color: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "Visit Our Shop",
      details: [
        "Tharad Hwy, Krishna Nagar, Dama, Deesa, Gujarat",
        "Premium Tasting Available",
      ],
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: ["Mon-Sat: 9AM-8PM", "Sun: 10AM-6PM"],
      color: "text-orange-600",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData: ContactFormData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        inquiryType: formData.inquiryType,
        message: formData.message,
      };

      const response = await apiService.submitContactForm(contactData);
      
      if (response.success) {
        alert(response.message || "Thank you! Your message has been sent successfully.");
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          inquiryType: "",
          message: "",
        });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            className="absolute inset-0"
          >
            <defs>
              <pattern
                id="spice-dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1" fill="#ea580c" />
                <circle cx="5" cy="5" r="0.5" fill="#dc2626" />
                <circle cx="15" cy="5" r="0.5" fill="#f59e0b" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spice-dots)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-300 to-red-300 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                x: [-10, 10],
                scale: [0.5, 1.2, 0.5],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-medium mb-4"
          >
            <Award className="w-5 h-5" />
            Premium Spice Consultants
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-3 leading-tight"
          >
            <span className="text-gray-600">Get In</span>{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-transparent bg-clip-text">
              Touch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Ready to transform your cooking with premium spices? Our expert team
            is here to guide you through our extensive collection and create
            custom solutions.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-4  text-sm text-gray-600 font-semibold"
          >
            <div className="flex items-center gap-2 bg-green-100 py-1 px-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-green-500 " />
              24/7 Support
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 py-1 px-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-500" />
              4.9 Star Rated
            </div>
            <div className="flex items-center gap-2 bg-blue-100 py-1 px-2 rounded-full">
              <Zap className="w-4 h-4 text-blue-500" />
              Quick Response
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info - Left Side */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  <span className="text-orange-500 mx-2">
                    Connect With Our Team
                  </span>
                </h2>
                <p className="mx-2 text-lg text-gray-600 leading-relaxed text-justify">
                  Whether you're a home chef or restaurant owner, we're
                  passionate about helping you discover the perfect spices for
                  your culinary creations.
                </p>
              </motion.div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onHoverStart={() => setActiveCard(index)}
                      onHoverEnd={() => setActiveCard(null)}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        activeCard === index
                          ? "border-orange-300 bg-orange-50/50 shadow-lg"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center group-hover:border-orange-300 transition-all duration-300`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${info.color} group-hover:scale-110 transition-transform duration-300`}
                          />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-gray-900">
                            {info.title}
                          </h3>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className="text-gray-600 text-sm group-hover:text-gray-700"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Customer Reviews Preview */}
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3  ">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Form Container */}
                <div className="bg-white rounded-3xl border-2 border-gray-100  p-6 md:p-12 relative overflow-hidden">
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-red-100/30 rounded-full blur-3xl"></div>

                  <div className="relative">
                    <div className="text-center mb-10">
                      <h3 className="text-3xl font-bold text-gray-800 mb-3">
                        Start Your Flavor Journey
                      </h3>
                      <p className="text-gray-600">
                        Share your culinary vision and let us recommend the
                        perfect spices for you
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-gray-700"
                          />
                        </div>
                      </motion.div>

                      {/* Email & Phone Row */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="relative group"
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              required
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-gray-700"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="relative group"
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              placeholder="+91 9104029941"
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-gray-700"
                            />
                          </div>
                        </motion.div>
                      </div>

                      {/* Subject Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative group"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What can we help you with? *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                          <select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-gray-700 appearance-none cursor-pointer"
                          >
                            <option value="">Choose your inquiry type</option>
                            <option value="Product Information">
                              Product Information
                            </option>
                            <option value="Bulk & Wholesale Orders">
                              Bulk & Wholesale Orders
                            </option>
                            <option value="Custom Spice Blends">
                              Custom Spice Blends
                            </option>
                            <option value="Restaurant Supply">
                              Restaurant Supply
                            </option>
                            <option value="Quality Concern">
                              Quality Concern
                            </option>
                            <option value="Business Partnership">
                              Business Partnership
                            </option>
                            <option value="General Questions">General Questions</option>
                          </select>
                        </div>
                      </motion.div>

                      {/* Message Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative group"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your spice requirements, favorite cuisines, or any specific questions..."
                          rows={5}
                          required
                          className="w-full p-4 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-gray-700 resize-none"
                        />
                      </motion.div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending Your Message...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            Send Message
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-xl"
                            ></motion.div>
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Visit Our{" "}
                <span className="text-orange-500">Spice Emporium</span>
              </h3>

              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-4">
                <div className="">
                  <div className="w-full h-96 rounded-xl overflow-hidden ">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.049222112902!2d72.190316!3d24.268986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c6b7b1234567%3A0xabcdef123456789!2sDeesa%20-%20Tharad%20Hwy%2C%20Krishna%20Nagar%2C%20Dama%2C%20Deesa%2C%20Gujarat%20385535!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-white/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0.5, 1.5, 0.5],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 3 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">
                    4.9/5
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  "Exceptional quality and amazing customer service!"
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  - Based on 2,500+ verified reviews
                </p>
              </motion.div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              // transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Frequently <span className="text-orange-500">Asked</span>
              </h3>

              <div className="space-y-4">
                {[
                  {
                    q: "What makes your spices special?",
                    a: "We source directly from farmers, ensuring maximum freshness and authentic flavors in every package.",
                  },
                  {
                    q: "Do you offer same-day delivery?",
                    a: "Yes! For local Deesa orders placed before 2PM, we offer same-day delivery.",
                  },
                  {
                    q: "Can I return products if not satisfied?",
                    a: "Absolutely! We offer a 30-day satisfaction guarantee on all our premium spices.",
                  },
                  {
                    q: "Do you supply to restaurants?",
                    a: "Yes! We're trusted suppliers to 100+ restaurants with special wholesale pricing.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ x: 0 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 pl-6">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
