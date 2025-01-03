"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import PistahIcon from "@/icons/pistahIcon";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!result?.error) {
      router.push("/inventory");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-[#001464] shadow-md">
        <div className="flex items-center gap-4">
          <PistahIcon />
        </div>
        <button
          onClick={() => router.push("/register")}
          className="rounded-md px-3 py-2 bg-[#1A73E8] text-white font-medium hover:bg-[#314dbb] hover:text-white"
        >
          Create account
        </button>
      </header>

      {/* Login Page */}
      <div className="flex-grow flex justify-center items-center bg-[#001464] px-4">
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800 text-center">
            Sign in
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-800"
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-800"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => router.push("/register")}
                className="transition flex max-w-xs px-6 py-4 bg-white text-[#001464] font-medium rounded-md hover:bg-[#1A73E8] hover:text-white border-2 border-gray-200 hover:border-white"
              >
                Create account
              </button>
              <button
                type="submit"
                className="rounded-md px-5 py-3 bg-[#1A73E8] text-white font-medium hover:bg-[#314dbb] hover:text-white"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
