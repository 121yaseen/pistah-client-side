"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProfileIcon from "@/icons/profileIcon";
import CreateAdModal from "../modals/CreateAdModal";
import DarkModeToggle from "./DarkModeToggleButton";
import InventoryIcon from "@/icons/inventoryIcon";
import DashboardIcon from "@/icons/dashboardIcon";
import { signOut, useSession } from "next-auth/react";
import CreateAdIcon from "@/icons/createAdIcon";
import PistahIcon from "@/icons/pistahIcon";

type HeaderProps = {
  navLinks?: { href: string; label: string }[];
};
type User = {
  id: string;
  name: string;
  email: string;
  profilePicUrl?: string;
};

export default function Header({ navLinks = [] }: HeaderProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profilePicRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profilePicRef.current &&
        !profilePicRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            console.error("Failed to fetch user details");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login", // Redirect to login page after sign out
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup when the component is unmounted
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-[#001464] text-white shadow-md relative">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <PistahIcon />
        </Link>
      </div>

      {/* Right Section: Nav Links & Profile */}
      <div className="flex items-center gap-6 relative">
        {/* Create Ad Button */}
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal on click
          className="h-8 px-2 bg-white text-[#001464] dark:bg-gray-800 dark:text-gray-200 font-semibold text-lg rounded-full 
          border border-gray-300 dark:border-gray-700 transition flex items-center justify-center gap-2
          dark:hover:ring-2 hover:ring-4 hover:ring-blue-600"
        >
          <span className="flex items-center">
            <CreateAdIcon />
          </span>
          <span className="flex items-center text-xs">Add Creative</span>
        </button>

        {/* Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${
              pathname === link.href ? "underline underline-offset-4" : ""
            } font-medium`}
          >
            {link.label}
          </Link>
        ))}

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Dashboard Icon */}
          <Link
            className={`flex flex-col items-center group ${
              pathname === "/dashboard"
                ? "text-white border-b-2"
                : "text-gray-500"
            }`}
            href="/dashboard"
          >
            <span
              className={`text-xs mt-1 group-hover:text-white ${
                pathname === "/dashboard" ? "text-white" : "text-gray-500"
              }`}
            >
              <DashboardIcon />
            </span>
            <span
              className={`text-xs mt-1 group-hover:text-white ${
                pathname === "/dashboard" ? "text-white" : "text-gray-400"
              }`}
            >
              Dashboard
            </span>
          </Link>

          {/* Inventory Icon */}
          <Link
            className={`flex flex-col items-center group ${
              pathname === "/inventory"
                ? "text-white border-b-2"
                : "text-gray-500"
            }`}
            href="/inventory"
          >
            <span
              className={`text-xs mt-1 group-hover:text-white ${
                pathname === "/creative" ? "text-white" : "text-gray-500"
              }`}
            >
              <InventoryIcon />
            </span>
            <span
              className={`text-xs mt-1 group-hover:text-white ${
                pathname === "/creative" ? "text-white" : "text-gray-400"
              }`}
            >
              My Creatives
            </span>
          </Link>

          {/* Profile Picture */}
          <div
            ref={profilePicRef}
            className="flex flex-col items-center relative group"
          >
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              {user?.profilePicUrl ? (
                <Image
                  src={user.profilePicUrl}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <ProfileIcon />
              )}
            </button>
            <div className="flex items-center mt-1 space-x-1">
              <span className="text-gray-400 text-xs group-hover:text-white">
                {user?.name || "\u00A0"}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-[60%] w-48 bg-white shadow-lg rounded-md text-gray-800 z-50 dark:bg-gray-800 dark:text-white"
          >
            <ul className="py-2">
              {/* My Profile */}
              <li>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  My Profile
                </Link>
              </li>

              {/* Dark Mode Toggle */}
              <li>
                <div className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                  <DarkModeToggle />
                </div>
              </li>

              {/* Log Out */}
              <li>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      {/* Create Ad Modal */}
      {isModalOpen && <CreateAdModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
