"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="mt-16 w-full border-t border-slate-800 bg-slate-900 text-slate-300 rounded-t-[2rem] sm:rounded-t-[3rem]">
      {/* Main Grid Wrapper */}
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand & Social Column */}
        <div className="flex flex-col justify-between space-y-6 sm:col-span-2 lg:col-span-1">
          <div>
            <h2 className="font-serif text-2xl font-black tracking-wide text-white italic">
              Mero Deurali Cafe
            </h2>
            <p className="mt-3 max-w-xs text-sm text-slate-400 leading-relaxed">
              Crafting premium specialty coffee and seasonal brunch memories for
              our community daily.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
              Follow Our Journey
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700/50 transition-all hover:bg-amber-600 hover:text-white hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_de_Facebook.png"
                  height={35}
                  width={35}
                  alt="facebook"
                  className="rounded-full"
                />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700/50 transition-all hover:bg-amber-600 hover:text-white hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <img src="  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAfDHLEBApWX-CTjkTIzClXtIv-pFgjTbgHaKrqL-d-vjsHrqh78EW6r1w&s=10"
                height={35}
                width={35}
                alt="instagram" 
                className="rounded-full"
                />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700/50 transition-all hover:bg-amber-600 hover:text-white hover:-translate-y-0.5"
                aria-label="TikTok"
              >
                {/* Custom inline TikTok SVG replaces raw low-res Google URLs */}
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a73.07,73.07,0,1,0,52.2,71.18V0l88,0a121.18,121.18,0,0,0,18.66,68.69A119.55,119.55,0,0,0,407.67,121.3h40.33Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Timings Information Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-bold tracking-wide text-white">
              Opening Hours
            </h3>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
              <span>Monday – Friday</span>
              <span className="font-medium text-slate-200">
                8:00 AM – 10:00 PM
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
              <span>Saturday – Sunday</span>
              <span className="font-medium text-slate-200">
                8:00 AM – 11:00 PM
              </span>
            </div>
            <p className="text-xs text-amber-400/80 italic mt-2">
              * Holiday brunch service changes announced via social channels.
            </p>
          </div>
        </div>

        {/* Contacts Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Phone className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-bold tracking-wide text-white">
              Get In Touch
            </h3>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <a
              href="tel:+9779876543210"
              className="flex items-center gap-3 hover:text-white transition"
            >
              <span className="text-slate-500 text-xs font-semibold w-10 uppercase">
                Call
              </span>
              <span className="font-medium text-slate-200">
                +977 98765 43210
              </span>
            </a>
            <a
              href="mailto:deuralicafe@gmail.com"
              className="flex items-center gap-3 hover:text-white transition"
            >
              <span className="text-slate-500 text-xs font-semibold w-10 uppercase">
                Email
              </span>
              <span className="font-medium text-slate-200 break-all">
                deuralicafe@gmail.com
              </span>
            </a>
            <div className="flex items-start gap-3">
              <span className="text-slate-500 text-xs font-semibold w-10 uppercase pt-0.5">
                Social
              </span>
              <span className="font-medium text-slate-200">
                @MeroDeuraliCafe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subfooter Copyright Strip */}
      <div className="border-t border-slate-800 bg-slate-400 px-6 py-6 text-center text-xs text-slate-950">
        <p>© {currentYear} Mero Deurali Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
}
