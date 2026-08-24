import React from "react";
import Link from "next/link";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Today from "@/components/Today";
import { Clock, Wifi } from "lucide-react";
import Banner from "@/components/Banner";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-300 text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero Banner Section with fixed image scoping */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white shadow-xl transition-all duration-300">
          {/* Background Image scoped inside the section container */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="https://pub-ba1a74be17d7442a9f2541946eb9510e.r2.dev/shops/1f9d454c-3294-4b26-9606-97ca603ce304/2.jpg"
              alt="Cafe background"
              className="h-full w-full object-cover opacity-30 transform scale-105"
            />
            {/* Gradient Overlay for high text-readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/40" />
          </div>

          {/* Grid Content Layout */}
          <div className="relative z-10 grid gap-12 p-6 sm:p-10 md:p-14 lg:grid-cols-12 lg:items-center">
            {/* Left Column Content */}
            <div className="flex flex-col items-start lg:col-span-7">
              <span className="inline-flex rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                Open daily · Fresh coffee
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                Welcome to Cafe Deurali
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Enjoy café-style coffee, seasonal brunch dishes, and a relaxed
                atmosphere for friends, work, and everyday moments.
              </p>

              {/* Call To Action Buttons (Stack on mobile, row on desktop) */}
              <div className="mt-6 flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                <Link
                  href="/TodaySpecial"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-amber-600 px-6 text-sm font-semibold text-white shadow-md hover:bg-amber-500 active:scale-98 transition-all"
                >
                  View Today's Specials
                </Link>
                <Link
                  href="/Order"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-900 shadow-md hover:bg-slate-100 active:scale-98 transition-all"
                >
                  Order Now
                </Link>
              </div>

              {/* Cafe Amenities Grid */}
              <div className="mt-8 grid grid-cols-1 gap-3 w-full sm:grid-cols-2 max-w-md">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/5">
                  <Wifi className="h-6 w-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      Free Wi-Fi
                    </h4>
                    <p className="text-xs text-slate-300">Stay Connected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/5">
                  <Clock className="h-6 w-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      Open Daily
                    </h4>
                    <p className="text-xs text-slate-300">7:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Card Container */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                <img
                  src="https://sdg-migration-id.s3.amazonaws.com/interior-design-devocion-LOT-office-for-architecture-brooklyn_Brooke-Holm_9.jpg"
                  alt="Cafe interior with coffee and pastries"
                  className="h-48 sm:h-64 lg:h-56 w-full object-cover"
                />
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                        Featured
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-white">
                        Bakery Brunch Pairing
                      </h2>
                    </div>
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                      Fresh
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    House-made pastries paired with a velvety latte are our
                    best-selling brunch combination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Banner />
        {/* Triple Features Grid */}
        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
              Fresh coffee
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Espresso Bar
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              House espresso, lattes, cappuccinos, and seasonal pours made with
              care.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
              Bakery fresh
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Artisan Bakes
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Scones, croissants, muffins, and breakfast bowls baked every
              morning.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm hover:shadow-md transition sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
              Every visit
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Cozy Seating
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              A calm, inviting space for meetings, laptop work, or relaxing with
              friends.
            </p>
          </article>
        </section>

        {/* Experience Section */}
        <section className="mt-12 rounded-[2rem] bg-slate-900 p-6 sm:p-10 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                A real cafe experience.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                From handcrafted coffee to seasonal brunch plates, Cafe Deurali
                delivers a warm, polished cafe atmosphere with friendly service
                and memorable flavors.
              </p>
            </div>

            <div className="space-y-3 lg:col-span-5">
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
                  House roasted beans
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Our coffee is roasted weekly to preserve its rich, aromatic
                  flavor.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400">
                  Daily fresh food
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  A rotating menu of baked goods and brunch specials is prepared
                  fresh every day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic components */}
        <Today />

        {/* Testimonials Review Block */}
        <section className="mt-12 rounded-[2rem] bg-white border border-slate-100 p-6 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Customer Reviews
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-950">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic">
                "The coffee is amazing and the atmosphere is very relaxing. My
                favorite cafe in town."
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-900">Sarah M.</h4>
                <p className="text-xs text-amber-500 mt-0.5">★★★★★</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic">
                "Excellent service and delicious pastries. Highly recommended!"
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-900">David K.</h4>
                <p className="text-xs text-amber-500 mt-0.5">★★★★★</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic">
                "Perfect place for work meetings and enjoying a quality cup of
                coffee."
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-bold text-slate-900">Emma R.</h4>
                <p className="text-xs text-amber-500 mt-0.5">★★★★★</p>
              </div>
            </div>
          </div>
        </section>

        <About />
      </main>
      <Footer />
    </div>
  );
}
