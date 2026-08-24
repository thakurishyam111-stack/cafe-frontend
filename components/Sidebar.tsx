"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, IndianRupee, Menu, User } from "lucide-react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  // Hide global navbar on admin routes (admin pages use AdminSidebar)
  if (pathname && pathname.startsWith("/Admin")) return null;

  return (
    <header className="sticky top-0 z-30 bg-gray-100 text-gray-950  rounded-xl shadow-lg">
      <div className="mx-auto flex flex-wrap items-center justify-between  px-6 py-4 sm:px-8">
        <div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQPxFu6LJIesS0epmaYAoG5xsfhzOkkucRxg&s"
            alt="Logo"
            className="h-20 w-20 rounded-full mr-2 flex-shrink-0 p-1"
          />
          <i className="text-l"> The Royal Cafe</i>
        </div>

        {/* <h2 className="mt-2 text-3xl font-cursive text-gray-400 font-semibold ">
          <i> The Royal Cafe</i>
        </h2> */}

        <nav className="flex items-center gap-5 text-sm font-medium text-gray-950 pr-7">
          <Link
            href="/Home"
            className="text-xl transition hover:text-blue-400 border-black "
          >
            Home
          </Link>
          <Link
            href="/TodaySpacial"
            className="transition hover:text-blue-400 text-xl"
          >
            Today&apos;s Special
          </Link>
          <Link
            href="/Order"
            className="transition hover:text-blue-400 text-xl "
          >
            Order
          </Link>
          <Link
            href="/Services"
            className="transition hover:text-blue-400 text-xl"
          >
            Services
          </Link>
          <Link href="/Menu" className="transition hover:text-blue-400 text-xl">
            Menu
          </Link>
          <Link
            href="/#about"
            className="transition hover:text-blue-400 text-xl"
          >
            About
          </Link>

          <form
            action="#"
            className="flex flex-1 min-w-[220px] max-w-sm items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2"
          >
            <input
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />

            <button
              type="submit"
              className="rounded-full bg-slate-400 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go
            </button>
          </form>

          <Link
            href="/Notification"
            className="flex items-center gap-3 transition hower:text-slate-950 text-white bg-gray-500 rounded-full px-3 py-3 "
          >
            <Bell className="h-6 w-6 text-white text-whit" />
          </Link>

          {/* <Link
            href="/Login"
            className="flex items-center transition hower:text-slate-950 "
          >
            <User className="h-6 w-6 text-slate-700 text-gray-950" />
          </Link> */}

          <Link
            href="/Bill"
            className="flex items-center gap-3 transition hower:text-slate-950 text-white bg-blue-600 rounded-full px-3 py-3 "
          >
            <IndianRupee className="h-6 w-6 text-white text-whit" />
            Bill
          </Link>
        </nav>
      </div>
    </header>
  );
}
