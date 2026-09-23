"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LockIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
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
      <path d="M12 14v3" />
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

function PasswordIcon() {
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
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim();

    if (!email || !form.password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password: form.password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
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
            <LockIcon />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-base leading-6 text-[#756C65]">
            Login to your Cartiva account.
          </p>

        </div>

        {/* =====================================
            LOGIN CARD
        ====================================== */}

        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-7 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  inputMode="email"
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
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-600">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#C96C35] focus:outline-none focus:ring-4 focus:ring-[#E98B50]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowIcon />
                </>
              )}
            </button>

          </form>

          {/* SIGNUP */}

          <div className="mt-6 border-t border-[#E9DED6] pt-6 text-center">

            <p className="text-sm leading-6 text-[#756C65] sm:text-base">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#E98B50] transition hover:text-[#C96C35] hover:underline"
              >
                Create Account
              </Link>
            </p>

          </div>

        </div>

        {/* BOTTOM NOTE */}

        <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-5 text-[#9A8E85]">
          Sign in to manage your account, track orders,
          and continue shopping with Cartiva.
        </p>

      </div>
    </main>
  );
}