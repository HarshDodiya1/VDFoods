"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { NavbarDemo } from "../components/navbar";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import CartPanel from "../components/CartPanel";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import Footer from "components/footer";
import { LoadingProvider } from "../context/LoadingContext";
import GlobalLoader from "../components/GlobalLoader/GlobalLoader";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactNode {
  const pathname = usePathname();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/register", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <GlobalLoader />
          <AuthProvider>
            <CartProvider>
              {shouldShowNavbar && <NavbarDemo />}

              <main>
                {children}
                <ScrollToTopButton />
              </main>

              <Footer />

              {/* Cart Panel */}
              <CartPanel />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4aed88",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#ff6b6b",
                      secondary: "#fff",
                    },
                  },
                  loading: {
                    iconTheme: {
                      primary: "#2563eb",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
