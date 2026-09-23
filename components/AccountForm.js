"use client";

import { useState } from "react";

// =========================================
// ICONS
// =========================================

function HomeIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function CityIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h.01" />
      <path d="M12 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}

function PostalIcon() {
  return (
    <svg
      className="h-[19px] w-[19px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10" />
      <path d="M7 13h6" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-[18px] w-[18px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-[18px] w-[18px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-[18px] w-[18px] animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// =========================================
// ACCOUNT FORM
// =========================================

export default function AccountForm({ user }) {
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =======================================
  // HANDLE CHANGE
  // =======================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =======================================
  // HANDLE SUBMIT
  // =======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/account",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update account information."
        );
      }

      setMessage(
        "Your account information has been saved successfully."
      );
    } catch (error) {
      console.error(
        "ACCOUNT UPDATE ERROR:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while updating your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-w-0 rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 md:p-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-6 sm:mb-7">

        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
          <HomeIcon />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-[#2D2723] sm:text-2xl">
          Shipping Information
        </h2>

        <p className="mt-1 max-w-2xl text-base leading-6 text-[#756C65]">
          Keep your contact and delivery details up to date
          for faster checkout.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* ===================================
            PHONE
        ==================================== */}

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-base font-semibold text-[#2D2723]"
          >
            Phone Number
          </label>

          <div className="relative">

            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
              <PhoneIcon />
            </div>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="03XX XXXXXXX"
              className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
            />

          </div>
        </div>

        {/* ===================================
            ADDRESS
        ==================================== */}

        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-base font-semibold text-[#2D2723]"
          >
            Address
          </label>

          <div className="relative">

            <div className="pointer-events-none absolute left-3.5 top-4 text-[#9A8E85]">
              <svg
                className="h-[19px] w-[19px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              rows={4}
              className="w-full resize-none rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base leading-6 text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10 sm:rows-3"
            />

          </div>
        </div>

        {/* ===================================
            CITY + POSTAL CODE
        ==================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* CITY */}

          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-base font-semibold text-[#2D2723]"
            >
              City
            </label>

            <div className="relative">

              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                <CityIcon />
              </div>

              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
              />

            </div>
          </div>

          {/* POSTAL CODE */}

          <div>
            <label
              htmlFor="postalCode"
              className="mb-2 block text-base font-semibold text-[#2D2723]"
            >
              Postal Code
            </label>

            <div className="relative">

              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                <PostalIcon />
              </div>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal code"
                className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
              />

            </div>
          </div>

        </div>

        {/* ===================================
            SUCCESS
        ==================================== */}

        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-5 text-green-700">
            <CheckIcon />
            <span>{message}</span>
          </div>
        )}

        {/* ===================================
            ERROR
        ==================================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-600">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        {/* ===================================
            SAVE BUTTON
        ==================================== */}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#C96C35] focus:outline-none focus:ring-4 focus:ring-[#E98B50]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon />
              Save Information
            </>
          )}
        </button>

      </form>
    </section>
  );
}