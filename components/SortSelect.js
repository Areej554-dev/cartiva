"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756C65]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function SortSelect({ sort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    const value = e.target.value;

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname
    );
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <label
        htmlFor="sort"
        className="whitespace-nowrap text-sm font-semibold text-[#2D2723] sm:text-base"
      >
        Sort by:
      </label>

      <div className="relative w-full sm:w-[220px]">
        <select
          id="sort"
          value={sort || ""}
          onChange={handleChange}
          className="min-h-12 w-full appearance-none rounded-xl border border-[#E9DED6] bg-white px-4 py-3 pr-10 text-base text-[#2D2723] outline-none transition focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
        >
          <option value="">
            Featured
          </option>

          <option value="price-asc">
            Price: Low → High
          </option>

          <option value="price-desc">
            Price: High → Low
          </option>

          <option value="name-asc">
            Name: A → Z
          </option>

          <option value="name-desc">
            Name: Z → A
          </option>
        </select>

        <ChevronIcon />
      </div>
    </div>
  );
}