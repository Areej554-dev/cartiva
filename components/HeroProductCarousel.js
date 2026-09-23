"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function BagIcon({ className = "h-16 w-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function HeroProductCarousel({
  products = [],
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // =========================================
  // CHANGE PRODUCT EVERY 4 SECONDS
  // =========================================

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((current) => {
        return (current + 1) % products.length;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [products.length]);

  // =========================================
  // NO PRODUCTS
  // =========================================

  if (!products.length) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center rounded-2xl bg-white sm:h-[500px] lg:h-[520px]">
        <div className="text-center">
          <BagIcon className="mx-auto h-14 w-14 text-[#E98B50]" />

          <p className="mt-4 text-base text-[#756C65]">
            Your collection starts here.
          </p>
        </div>
      </div>
    );
  }

  const product = products[currentIndex];

  // =========================================
  // DOT POSITION
  // =========================================

  const totalDots = Math.min(8, products.length);

  const activeDot =
    products.length <= 8
      ? currentIndex
      : Math.floor(
          (currentIndex / products.length) * totalDots
        );

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative block h-[460px] w-full overflow-hidden rounded-2xl bg-white sm:h-[500px] lg:h-[520px]"
    >
      {/* =====================================
          FIXED IMAGE AREA
      ====================================== */}

      <div className="absolute inset-x-0 top-0 bottom-[112px] flex items-center justify-center px-6 py-6 sm:px-10 sm:py-8">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="block max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#E98B50]">
            <BagIcon />

            <span className="mt-3 text-base text-[#756C65]">
              View collection
            </span>
          </div>
        )}
      </div>

      {/* =====================================
          PRODUCT INFORMATION
      ====================================== */}

      <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#E98B50]">
          Featured
        </p>

        <h2 className="mt-1 line-clamp-1 text-lg font-bold text-[#2D2723] sm:text-xl">
          {product.name}
        </h2>

        <p className="mt-1 text-base font-semibold text-[#C96C35]">
          ${Number(product.price || 0).toFixed(2)}
        </p>
      </div>

      {/* =====================================
          PRODUCT DOTS
      ====================================== */}

      {products.length > 1 && (
        <div className="absolute bottom-7 right-6 z-30 flex items-center gap-1.5 sm:right-7">
          {Array.from({ length: totalDots }).map(
            (_, index) => (
              <span
                key={index}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === activeDot
                    ? "w-5 bg-[#E98B50]"
                    : "w-1.5 bg-[#E9DED6]"
                }`}
              />
            )
          )}
        </div>
      )}
    </Link>
  );
}