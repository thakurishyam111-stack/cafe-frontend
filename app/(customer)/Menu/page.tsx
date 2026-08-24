"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const Page = () => {
  const router = useRouter();
  const [menus, setMenus] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchMenus = async () => {
    try {
      const { data } = await api.get("/api/menus");
      const items = data?.menus || [];
      setMenus(items);
      setApiError(
        data?.success === false
          ? data?.message || "Failed to load menus."
          : null,
      );
    } catch (error) {
      console.error("Error fetching menus:", error);
      setApiError("Unable to fetch menu items. Please try again later.");
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(menus.map((item) => item.category).filter(Boolean)),
    );
    return ["All", ...unique];
  }, [menus]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menus;
    return menus.filter((item) => item.category === selectedCategory);
  }, [menus, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-100 flex items-center justify-center px-4">
        <div className="rounded-[2rem] border border-amber-300/30 bg-slate-900/95 px-8 py-10 text-center shadow-2xl shadow-amber-500/10">
          <p className="text-xl font-semibold">Loading our cafe menu...</p>
          <p className="mt-2 text-sm text-slate-400">Fresh specials are on their way.</p>
        </div>
      </div>
    );
  }

  if (!menus.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-100 flex items-center justify-center px-4">
        <div className="rounded-[2rem] border border-amber-300/30 bg-slate-900/95 px-8 py-10 text-center shadow-2xl shadow-amber-500/10">
          <p className="text-xl font-semibold">{apiError || "No menu items found."}</p>
          <p className="mt-2 text-sm text-slate-400">Try refreshing or check back in a few moments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.15),_transparent_45%),_linear-gradient(to_bottom,_#fff7ed,_#fbf1e0)] text-slate-900 ">
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
       
       
        <section className="mt-10 rounded-[2rem] bg-white/90 p-6 shadow-xl ring-1 ring-slate-200/70 shadow-slate-200/40 backdrop-blur-sm sm:p-8">
         <div className="text-center">
        <i className="text-xl  text-center">Deurali cafe all menu items </i>
       </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Menu categories</p>
              <i className="mt-2 text-3xl font-bold text-slate-950">Find your favorite flavor</i>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? "border-amber-500 bg-amber-500 text-slate-950 shadow-sm"
                      : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={item._id || item.id}
                className="group overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_30px_90px_-60px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-50px_rgba(251,191,36,0.3)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title || item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-amber-500/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-lg">
                    {item.category || "Special"}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="max-w-[calc(100%-5rem)]">
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title || item.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-200 w-25 text-center text-lg font-bold text-amber-800 shadow-sm">
                      Rs .{item.price}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-[1.75rem] bg-slate-900/90 p-4 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Fresh
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Fast serve
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => router.push("/Order")}
                      className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                    >
                      Order now
                    </button>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.18em] text-white-300">
                      {item.category || "Cafe"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
