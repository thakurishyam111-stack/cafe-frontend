import React from "react";
import Link from "next/link";
import About from "@/components/About";
import Dashbord from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Today from "@/components/Today";
import Map from "@/components/Map";
import { Clock, Wifi } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen  text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
        <img
          src="https://pub-ba1a74be17d7442a9f2541946eb9510e.r2.dev/shops/1f9d454c-3294-4b26-9606-97ca603ce304/2.jpg"
          alt="Cafe background"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center rounded-[2rem] bg-gray-200 p-8 shadow-xl shadow-orange-100 backdrop-blur transition-colors duration-500">
          <div>
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
              Open daily · Fresh coffee
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Welcome to Cafe Deurali
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              Enjoy café-style coffee, seasonal brunch dishes, and a relaxed
              atmosphere for friends, work, and everyday moments.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/TodaySpacial"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View Today's Specials
              </Link>
              <Link
                href="/Order"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Order Now
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md">
                <Wifi className="h-8 w-8 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">Free Wi-Fi</h4>
                  <p className="text-sm text-slate-600">Stay Connected</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">Open Daily</h4>
                  <p className="text-sm text-slate-600">7:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-orange-50 p-6 shadow-inner shadow-orange-100">
            <div className="overflow-hidden rounded-[1.75rem] border border-amber-100 bg-white shadow-xl">
              <img
                src="https://sdg-migration-id.s3.amazonaws.com/interior-design-devocion-LOT-office-for-architecture-brooklyn_Brooke-Holm_9.jpg"
                alt="Cafe interior with coffee and pastries"
                className="h-80 w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
                      Featured
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      Bakery Brunch Pairing
                    </h2>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                    Fresh
                  </span>
                </div>
                <p className="text-slate-600">
                  House-made pastries paired with a velvety latte are our
                  best-selling brunch combination.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Map />
        <section className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Fresh coffee
            </p>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Espresso Bar
            </h3>
            <p className="mt-4 text-slate-600">
              House espresso, lattes, cappuccinos, and seasonal pours made with
              care.
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Bakery fresh
            </p>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Artisan Bakes
            </h3>
            <p className="mt-4 text-slate-600">
              Scones, croissants, muffins, and breakfast bowls baked every
              morning.
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Every visit
            </p>
            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              Cozy Seating
            </h3>
            <p className="mt-4 text-slate-600">
              A calm, inviting space for meetings, laptop work, or relaxing with
              friends.
            </p>
          </article>
        </section>

        <section className="mt-12 rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-800/30">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <h2 className="text-3xl font-bold">A real cafe experience.</h2>
              <p className="mt-4 max-w-xl text-slate-200">
                From handcrafted coffee to seasonal brunch plates, Cafe Deurali
                delivers a warm, polished cafe atmosphere with friendly service
                and memorable flavors.
              </p>
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
              <div className="rounded-3xl bg-orange-500/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-200">
                  House roasted beans
                </p>
                <p className="mt-2 text-slate-100">
                  Our coffee is roasted weekly to preserve its rich, aromatic
                  flavor.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100/10 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
                  Daily fresh food
                </p>
                <p className="mt-2 text-slate-100">
                  A rotating menu of baked goods and brunch specials is prepared
                  fresh every day.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Today />
        <section className="mt-12 rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">
              Customer Reviews
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-slate-600">
                "The coffee is amazing and the atmosphere is very relaxing. My
                favorite cafe in town."
              </p>
              <h4 className="mt-4 font-semibold text-slate-900">Sarah M.</h4>
              <p className="text-amber-500">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-slate-600">
                "Excellent service and delicious pastries. Highly recommended!"
              </p>
              <h4 className="mt-4 font-semibold text-slate-900">David K.</h4>
              <p className="text-amber-500">★★★★★</p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-slate-600">
                "Perfect place for work meetings and enjoying a quality cup of
                coffee."
              </p>
              <h4 className="mt-4 font-semibold text-slate-900">Emma R.</h4>
              <p className="text-amber-500">★★★★★</p>
            </div>
          </div>
        </section>
        <About />
      </main>
      <Footer />
    </div>
  );
}
