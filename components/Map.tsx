"use client";

import dynamic from "next/dynamic";

const CafeMapContent = dynamic(
  () => import("./CafeMapContent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-[2rem] bg-slate-900 text-white sm:h-[500px] lg:h-[560px]">
        Loading map...
      </div>
    ),
  }
);

export default function Map() {
  return <CafeMapContent />;
}