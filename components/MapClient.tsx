"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="m-10 flex h-[600px] items-center justify-center rounded-[3rem] bg-slate-900 text-white">
      Loading map...
    </div>
  ),
});

export default function MapClient() {
  return <Map />;
}