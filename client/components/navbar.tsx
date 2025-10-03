"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaInfoCircle,
  FaBox,
  FaPhoneAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaArrowRightToBracket, FaCartShopping } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import CartIcon from "./CartIcon";

interface NavItem {
  name: string;
  link: string;
  icon: ReactNode;
}

export function NavbarDemo(): ReactNode {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      name: "Home",
      link: "/",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "About Us",
      link: "/about",
      icon: <MdOutlinePeopleAlt className="w-5 h-5" />,
    },
    {
      name: "Products",
      link: "/products",
      icon: <FaBox className="w-4 h-4" />,
    },
    {
      name: "Contact Us",
      link: "/contact",
      icon: <FaPhoneAlt className="w-4 h-4" />,
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavItemClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = (
    link: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (link.startsWith("#")) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(link);
    }
  };

  const handleLogout = (): void => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = (): void => {
    router.push("/profile");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="relative w-full">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} onItemClick={handleNavItemClick} />
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none border border-gray-500 rounded-lg">
                      <FaUser className="w-4 h-4" />
                      <span className="hidden sm:block">
                        {user?.name?.split(" ")[0] || "Profile"}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaUser className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>

                  <CartIcon />
                </>
              ) : (
                <>
                  <NavbarButton
                    className="bg-gray-100 border border-gray-300 flex items-center gap-x-2"
                    variant="secondary"
                    href="/auth"
                  >
                    Login
                    <FaArrowRightToBracket className="text-sm" />
                  </NavbarButton>
                </>
              )}
            </div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <div className="flex items-center gap-2">
                {/* Cart Button in Mobile Header */}
                {/* <NavbarButton
                  variant="primary"
                  href="/cart"
                  className="flex items-center justify-center w-10 h-10 p-0"
                  onClick={() => router.push("/cart")}
                >
                  <FaCartShopping className="h-5 w-5" />
                </NavbarButton> */}
                <CartIcon />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={(e) => handleMobileNavClick(item.link, e)}
                  className="relative text-neutral-600 hover:text-neutral-900 transition-colors py-2 w-full dark:text-neutral-300 dark:hover:text-neutral-100"
                >
                  <span className="flex items-center gap-2 text-lg font-medium">
                    {item.icon}
                    {item.name}
                  </span>
                </a>
              ))}

              <div className="flex w-full flex-col gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Welcome, {user?.name}!
                    </div>

                    <NavbarButton
                      onClick={handleProfileClick}
                      variant="secondary"
                      className="w-full justify-center bg-gray-100 border border-gray-400 flex items-center gap-2"
                    >
                      Profile
                      <FaUser />
                    </NavbarButton>

                    <button
                      onClick={handleLogout}
                      className="w-full justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      Logout
                      <FaSignOutAlt />
                    </button>
                  </>
                ) : (
                  <>
                    <NavbarButton
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="secondary"
                      className="w-full justify-center bg-gray-100 border border-gray-400 flex items-center gap-2"
                      href="/auth"
                    >
                      Login
                      <FaArrowRightToBracket />
                    </NavbarButton>
                  </>
                )}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
    </>
  );
}
