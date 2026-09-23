"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

// =========================================
// SVG ICONS
// =========================================

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

// =========================================
// SEARCH BAR
// =========================================

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") || "";

  const [search, setSearch] =
    useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    const value = search.trim();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    // Start a fresh search from all products
    params.delete("category");

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  const handleClear = () => {
    setSearch("");

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("search");
    params.delete("category");

    router.push(
      `${pathname}?${params.toString()}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex flex-col gap-3 sm:flex-row">

        {/* Search Input */}
        <div className="relative flex-1">

          {/* Search SVG */}
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#756C65]">
            <SearchIcon className="h-5 w-5" />
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-xl border border-[#E9DED6] bg-white py-3.5 pl-11 pr-11 text-base text-[#2D2723] outline-none transition placeholder:text-[#756C65] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
          />

          {/* Clear Button */}
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#756C65] transition hover:bg-[#FFF1E8] hover:text-[#C96C35]"
              aria-label="Clear search"
            >
              <XIcon />
            </button>
          )}

        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35]"
        >
          <SearchIcon className="h-5 w-5" />
          Search
        </button>

      </div>
    </form>
  );
}