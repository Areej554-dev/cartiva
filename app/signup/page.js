"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function UserIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  );
}

function PersonIcon() {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon() {
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
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PasswordIcon({ confirm = false }) {
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
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      {confirm && <path d="m9 15 2 2 4-4" />}
    </svg>
  );
}

function EyeIcon({ hidden = false }) {
  if (hidden) {
    return (
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.8 3.5 10 8a10.8 10.8 0 0 1-3.1 5" />
        <path d="M6.1 6.1C3.8 7.4 2.5 9.8 2 12c1.2 4.5 5 8 10 8 1.5 0 2.9-.3 4.1-.8" />
      </svg>
    );
  }

  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-[17px] w-[17px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function AlertIcon({ success = false }) {
  if (success) {
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
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (
      !name ||
      !email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create account."
        );
        return;
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#FFF9F5] px-4 py-8 sm:px-6 sm:py-12">

      <div className="w-full max-w-md">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-7 text-center sm:mb-8">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#E98B50]">
            <UserIcon />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl">
            Create Account
          </h1>

          <p className="mt-2 text-base leading-6 text-[#756C65]">
            Join Cartiva and start shopping.
          </p>

        </div>

        {/* =====================================
            CARD
        ====================================== */}

        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-7 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-base font-semibold text-[#2D2723]"
              >
                Full Name
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                  <PersonIcon />
                </div>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />

              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-semibold text-[#2D2723]"
              >
                Email Address
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                  <MailIcon />
                </div>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-4 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-semibold text-[#2D2723]"
              >
                Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                  <PasswordIcon />
                </div>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-12 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#8D8179] transition hover:bg-[#FFF1E8] hover:text-[#E98B50]"
                >
                  <EyeIcon
                    hidden={showPassword}
                  />
                </button>

              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-base font-semibold text-[#2D2723]"
              >
                Confirm Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8E85]">
                  <PasswordIcon confirm />
                </div>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] py-3.5 pl-11 pr-12 text-base text-[#2D2723] outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#8D8179] transition hover:bg-[#FFF1E8] hover:text-[#E98B50]"
                >
                  <EyeIcon
                    hidden={
                      showConfirmPassword
                    }
                  />
                </button>

              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-600">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-5 text-green-700">
                <AlertIcon success />
                <span>{success}</span>
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#C96C35] focus:outline-none focus:ring-4 focus:ring-[#E98B50]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowIcon />
                </>
              )}
            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-6 border-t border-[#E9DED6] pt-6 text-center">

            <p className="text-sm leading-6 text-[#756C65] sm:text-base">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#E98B50] transition hover:text-[#C96C35] hover:underline"
              >
                Login
              </Link>
            </p>

          </div>

        </div>

        {/* BOTTOM NOTE */}

        <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-5 text-[#9A8E85]">
          By creating an account, you can manage your
          profile, orders, and shopping preferences from
          one place.
        </p>

      </div>
    </main>
  );
}