"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("⚠️ Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("⚠️ Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "❌ Login failed");
        return;
      }

      setSuccess("✅ Login successful! Redirecting...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("casherUser", JSON.stringify(data.user || { fullName: email, email, phone: "" }));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setTimeout(() => {
        router.push("/Casher");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "linear-gradient(135deg, #c5c9d9 0%, #764ba2 100%)",
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold text-center mb-2">Mero Deurali Cafe</h1>
            <p className="text-center text-blue-100">Cashier login</p>
          </div>

          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 text-sm font-semibold">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-gray-700 cursor-pointer">
                    Remember Me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <p className="text-center text-gray-700">
              Don&apos;t have an account? {" "}
              <Link href="/Casher/Register" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
