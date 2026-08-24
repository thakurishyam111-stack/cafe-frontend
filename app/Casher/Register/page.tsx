"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const RegisterPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) =>
    /^[0-9]{10,}$/.test(value.replace(/\D/g, ""));

  const checkPasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (value.length >= 12) strength++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 3) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Invalid email address");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Invalid phone number");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("Please accept terms and conditions");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/Casher");
        }, 1000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-8"
      style={{
        backgroundImage: "linear-gradient(135deg, #353f68 0%, #71883b 100%)",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-6 py-10 text-white">
            <h1 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h1>
            <p className="text-center text-blue-100 text-lg">
              Mero Deurali Cafe
            </p>
          </div>

          <div className="px-6 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 text-sm font-semibold">
                  {success}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  👤 Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  📧 Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  📱 Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+977 ******"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    🔒 Password
                  </label>
                  {formData.password && (
                    <span
                      className={`text-xs font-bold ${
                        passwordStrength < 2
                          ? "text-red-600"
                          : passwordStrength < 3
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-gray-600 hover:text-green-600 disabled:opacity-50 transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full w-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  🔒 Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3 text-gray-600 hover:text-green-600 disabled:opacity-50 transition"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && (
                  <p
                    className={`text-xs mt-2 font-semibold ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-600"}`}
                  >
                    {formData.password === formData.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer disabled:opacity-50 mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-800 font-semibold"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-800 font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-blue-600 to-blue-600 hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">
                already registered?
              </span>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <p className="text-center text-gray-700 font-medium">
              Have an account?{" "}
              <Link
                href="/Casher/Login"
                className="text-blue-600 hover:text-blue-800 font-bold transition"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-gray-600 text-xs">
              © 2026 Mero Deurali Cafe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
