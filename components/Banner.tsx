"use client";

import React, { useEffect, useState } from "react";

const Banner = () => {
  const images = [
    "/logo/banner1.png",
    "/logo/banner2.png",
    "/logo/banner4.png",
    "/logo/banner5.png",
    "/logo/banner6.png",
    "/logo/banner7.png",
    "/logo/banner8.png",
    "/logo/banner9.png",
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section>
      <div className="p-5 my-5 bg-gray-300 relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl aspect-video">
        <video
          src="/logo/coffee-maker.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls
          className="w-full h-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative rounded-2xl my-10 shadow-xl overflow-hidden ">
        <img
          src={images[current]}
          alt="Banner"
          className="w-full h-[450px] object-cover rounded-2xl transition-all duration-700"
        />

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
        >
          ❯
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
