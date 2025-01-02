import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the theme from localStorage on initial render
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  // Toggle the theme and save it to localStorage
  const toggleDarkMode = () => {
    const root = document.documentElement;
    const newTheme = !isDarkMode ? "dark" : "light";
    root.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sun Icon */}
      <FiSun
        className={`transition-transform text-2xl ${
          isDarkMode ? "text-gray-400" : "text-yellow-500"
        }`}
      />

      {/* Slider */}
      <button
        onClick={toggleDarkMode}
        className={`relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center transition-colors`}
      >
        <span
          className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
            isDarkMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      {/* Moon Icon */}
      <FiMoon
        className={`transition-transform text-2xl ${
          isDarkMode ? "text-purple-500" : "text-gray-400"
        }`}
      />
    </div>
  );
};

export default DarkModeToggle;
