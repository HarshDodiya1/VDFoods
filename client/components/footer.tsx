import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  Truck,
  Shield,
  Award,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white"
      style={{
        backgroundColor: "#008B8B",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.343 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97-1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23006241' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <img
                  src="/logo.png"
                  alt="VD Foods Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                VD FOODS
              </h3>
            </div>
            <p className="text-white leading-relaxed text-justify">
              Premium quality spices and authentic flavors delivered fresh to
              your doorstep. Experience the taste of tradition with our
              carefully sourced natural spices.
            </p>
            <div className="flex space-x-3">
              <div className="flex items-center space-x-2 text-white font-bold bg-teal-800 p-2 rounded-full">
                <Award className="w-5 h-5 font-bold" />
                <span className="text-sm">100% Natural</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex  space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Youtube, href: "#", label: "YouTube" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-teal-800 rounded-full flex items-center justify-center hover:text-teal-600 transform hover:scale-110 transition-all duration-300 "
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6 text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white border-b-2 border-teal-500 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Contact Us", href: "/contact" },
                { name: "Login", href: "/auth" },
                { name: "Profile", href: "/profile" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-teal-300 transition-colors duration-300 hover:translate-x-2 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nature's Promise */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white border-b-2 border-teal-500 pb-2">
              Nature's Promise
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-teal-400 flex-shrink-0">🌿</div>
                <div>
                  <p className="text-white font-medium">Organic Sourcing</p>
                  <p className="text-teal-200 text-sm">
                    Directly from nature's bounty
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-teal-400 flex-shrink-0">🌱</div>
                <div>
                  <p className="text-white font-medium">Eco-Friendly</p>
                  <p className="text-teal-200 text-sm">
                    Sustainable packaging & practices
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-teal-400 flex-shrink-0">🍃</div>
                <div>
                  <p className="text-white font-medium">Farm Fresh</p>
                  <p className="text-teal-200 text-sm">
                    From farm to your kitchen
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 text-teal-400 flex-shrink-0">🌳</div>
                <div>
                  <p className="text-white font-medium">Pure & Natural</p>
                  <p className="text-teal-200 text-sm">
                    No artificial additives
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white border-b-2 border-teal-500 pb-2">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Visit Our Store</p>
                  <p className="text-teal-200 text-sm">
                    Tharad Hwy, Krishna Nagar, Dama
                    <br />
                    Deesa, Gujarat, India - 385535
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <a
                    href="tel:+919876543210"
                    className="text-teal-200 hover:text-teal-300 transition-colors"
                  >
                    +91 9104029941
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email Us</p>
                  <a
                    href="mailto:info@vdfoods.com"
                    className="text-teal-200 hover:text-teal-300 transition-colors"
                  >
                    vdfoods77@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Store Hours</p>
                  <p className="text-teal-200 text-sm">
                    Mon-Sat: 9:00 AM - 8:00 PM
                    <br />
                    Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t-3 border-teal-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-teal-800 rounded-lg p-4">
              <Truck className="w-8 h-8 text-white" />
              <div>
                <h5 className="font-semibold text-white">Free Shipping</h5>
                <p className="text-teal-300 text-sm">On orders above ₹200</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-teal-800 rounded-lg p-4">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <h5 className="font-semibold text-white">Fresh Guarantee</h5>
                <p className="text-teal-300 text-sm">100% fresh & natural</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-teal-800 rounded-lg p-4">
              <Award className="w-8 h-8 text-white" />
              <div>
                <h5 className="font-semibold text-white">Organic Quality</h5>
                <p className="text-teal-300 text-sm">Pure & sustainable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-teal-800 border-t border-teal-700 lg:px-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white">
                © {currentYear} VD FOODS. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm">
                <Link
                  href="/privacy"
                  className="text-white hover:text-teal-100 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-white hover:text-teal-100 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/privacy"
                  className="text-white hover:text-teal-100 transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-1 text-white">
              {/* Designed & Developed Line */}
              <div className="flex items-center space-x-2">
                <span>Designed & Developed by</span>
                <a
                  href="https://krishprajapati13.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-teal-100 font-semibold transition-colors hover:underline"
                >
                  KRISH
                </a>
                <span>&</span>
                <a
                  href="https://harshdodiya.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 hover:text-teal-100 font-semibold transition-colors hover:underline"
                >
                  HARSH
                </a>
                <Heart className="w-4 h-4 text-red-400 ml-1" />
              </div>

              {/* Phone Numbers */}
              <div className="flex flex-row items-center text-sm gap-4 text-white">
                <span>📞 +91 9157431551</span>
                <span>📞 +91 99794 88188</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
