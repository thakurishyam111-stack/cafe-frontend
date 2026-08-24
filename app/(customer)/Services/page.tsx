"use client";

import React from "react";
import Footer from "@/components/Footer";

// Senior Tip: Move static data outside the component to prevent re-renders and keep code clean.
const SERVICES = [
  { icon: "☕", title: "Premium Coffee", desc: "Freshly brewed coffee crafted from handpicked, premium beans." },
  { icon: "🍔", title: "Delicious Food", desc: "Artisanal pizzas, gourmet burgers, fresh sandwiches, and authentic momos." },
  { icon: "🚚", title: "Fast Delivery", desc: "Quick, reliable, and freshly packed delivery straight to your doorstep." },
];

const FACILITIES = [
  { icon: "📶", label: "Free High-Speed WiFi" },
  { icon: "🚗", label: "Spacious Parking Area" },
  { icon: "🔌", label: "Power Stations" },
  { icon: "❄️", label: "Air Conditioned" },
  { icon: "🎮", label: "Indoor Games Zone" },
  { icon: "💻", label: "Work & Study Friendly" },
  { icon: "👨‍👩‍👧", label: "Family Friendly Spaces" },
  { icon: "📸", label: "Instagrammable Corners" },
];

const EVENTS = [
  { icon: "🎵", title: "Live Music Night", desc: "Unwind with acoustics and local talents every Friday evening." },
  { icon: "🎂", title: "Private Celebrations", desc: "Custom decorations and curated menus for your special milestones." },
  { icon: "☕", title: "Coffee Brewing Workshops", desc: "Master the art of premium coffee extraction with our expert baristas." },
];



export default function HomePage() {
  return (
    <main className="bg-stone-50 text-stone-800 antialiased selection:bg-amber-200">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative h-[90vh] md:h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93')",
        }}
      >
        {/* Subtle, premium gradient overlay instead of heavy flat black */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <span className="text-amber-400 font-semibold tracking-widest text-xs md:text-sm uppercase mb-3 block">
            Welcome to Craft Coffee culture
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 balance">
            Deurali Cafe
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-stone-200 mb-8 max-w-xl mx-auto font-light">
            Where premium coffee meets a cozy atmosphere and unforgettable culinary memories.
          </p>
          <button className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white px-8 py-3.5 rounded-full font-medium tracking-wide shadow-lg hover:shadow-amber-900/30 transition-all duration-200">
            Explore Our Menu
          </button>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-16 md:py-28 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative group overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24"
              alt="Cozy interior of Deurali Cafe"
              className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          <div className="space-y-6">
            <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              A Sanctuary for Coffee Lovers & Creatives
            </h2>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed">
              Deurali Cafe is the quintessential neighborhood hub for food enthusiasts, remote professionals, students, and families. We are proud to source single-origin premium beans alongside an inspired dynamic menu, serving it all up within an environment tailored for connection, productivity, and rest.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Premium Roasts", "High-Speed WiFi", "Family Welcoming"].map((tag) => (
                <span 
                  key={tag} 
                  className="bg-amber-50 text-amber-800 text-xs md:text-sm font-medium px-4 py-2 rounded-full border border-amber-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="bg-stone-100 py-16 md:py-24 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Specialty Services</h2>
            <p className="text-stone-600">We take pride in bringing excellence to every dynamic of your dining and caffeine experiences.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((srv, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/60 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-3xl mb-4 bg-amber-50 w-12 h-12 flex items-center justify-center rounded-xl">{srv.icon}</div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{srv.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FACILITIES SECTION */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Modern Amenities</h2>
          <p className="text-stone-600">Equipped with everything required to maximize your comfort, production, or leisure window.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FACILITIES.map((fac, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 rounded-xl border border-stone-200/80 flex items-center gap-3 hover:border-amber-400/60 transition-colors duration-200 shadow-sm"
            >
              <span className="text-xl">{fac.icon}</span>
              <span className="font-medium text-stone-700 text-sm sm:text-base">{fac.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EVENTS SECTION */}
      <section className="bg-stone-900 text-stone-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Events & Social Activities</h2>
            <p className="text-stone-400">There is always something brewing at Deurali. Check out our recurring community gatherings.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENTS.map((evt, idx) => (
              <div 
                key={idx} 
                className="bg-stone-800/50 backdrop-blur border border-stone-800 p-8 rounded-2xl hover:border-stone-700 transition-colors duration-300"
              >
                <div className="text-2xl mb-4">{evt.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{evt.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{evt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STATS SECTION (Uncommented & Premium Style) */}
    
      <Footer />
    </main>
  );
}