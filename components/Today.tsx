"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sparkles, Star, Clock3, Heart, ShoppingCart } from "lucide-react";
import { Router } from "next/router";
import Link from "next/link";

export default function TodaySpecialPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaySpecial();
  }, []);

  const fetchTodaySpecial = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/Today");
      const data = response.data;

      // safe mapping
      setItems(Array.isArray(data) ? data : data?.today || []);

      setError(null);
    } catch (err: any) {
      console.log(err);
      setError("Failed to load today special items.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl m-3 min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white text-slate-900">

      <main className="mx-auto max-w-7xl px-5 py-10">

        {/* 🔥 HERO SECTION (Premium UI) */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">

          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-orange-900/80" />

          <div className="relative z-10 px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-5 py-2 text-sm text-orange-200">
              <Sparkles size={16} />
              Today’s Fresh Specials
            </div>

            <h1 className="mt-6 text-4xl font-black sm:text-5xl">
              Discover Today’s Best Flavors
            </h1>

            <p className="mt-4 text-orange-100/80">
              Freshly prepared meals directly from our kitchen 🍽️
            </p>
          </div>
        </section>

        {/* ❌ ERROR */}
        {error && (
          <div className="mt-6 text-center text-red-500">
            {error}
          </div>
        )}

        {/* ⏳ LOADING */}
        {loading ? (
          <div className="mt-10 text-center text-gray-500">
            Loading delicious items...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            No special items available 😔
          </div>
        ) : (

          /* 🍽️ CARDS GRID (Premium UX like your first design) */
          <section className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {items.map((item, index) => (
              <article
                key={index}
                className="group overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl transition hover:-translate-y-2"
              >

                {/* IMAGE */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* BADGE */}
                  <div className="absolute left-4 top-4 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold">
                    Today Special
                  </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-4 p-6">

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-300">
                        {item.description}
                      </p>
                    </div>

                    <div className="rounded-full bg-orange-100 px-4 py-2 text-lg font-bold text-orange-700">
                      Rs. {item.price}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-400" />
                      {item.rating || 4.5}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-orange-300" />
                      30 min
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between">
                    <Link href="/TodaySpecial">
                    <button 
                      className="flex items-center gap-2 rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-300">
                      <ShoppingCart size={16} />
                      Order Now
                    </button>
                    </Link>

                    <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-900 hover:bg-slate-800">
                      <Heart size={18} />
                    </button>
                  </div>

                </div>
              </article>
            ))}

          </section>
        )}

      </main>
    </div>
  );
}