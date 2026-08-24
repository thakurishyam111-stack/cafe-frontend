"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminRegister() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await apiFetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // IMPORTANT
      const data = await res.json();

      // error check
      if (!res.ok) {
        setError(data.message);
        return;
      }

      // save token
      localStorage.setItem("adminToken", data.token);

      // redirect
      router.push("/Admin/Dashboard");
    } catch (err) {
      console.log(err);

      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 px-4">
      <div className="w-full max-w-md bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 p-4 rounded-xl">
            <Shield size={35} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1">
          Create Admin Account
        </h1>
        <p className="text-center text-sm text-gray-400 mb-4">
          Register admin to manage the cafe dashboard
        </p>

        {error && (
          <p className="bg-red-500/20 border border-red-500 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative rounded">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name"
              onChange={handleChange}
              placeholder="Full name"
              className="w-full pl-10 p-3 rounded-lg bg-transparent border border-white/10 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              name="email"
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full pl-10 p-3 rounded-lg bg-transparent border border-white/10 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-transparent border border-white/10 focus:ring-2 focus:ring-green-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
              aria-label="toggle password visibility"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="text-sm text-gray-400">
            Password must be at least 6 characters.
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-3"
          >
            {loading && (
              <div className="h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
            )}
            <span>{loading ? "Creating..." : "Create Admin"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
