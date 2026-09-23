"use client";

import { useState } from "react";
import Link from "next/link";
// =========================================
// SVG ICONS
// =========================================

function MailIcon({ className = "h-6 w-6" }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ className = "h-6 w-6" }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-6 w-6" }) {
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
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon({ className = "h-6 w-6" }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowIcon({ className = "h-4 w-4" }) {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

// =========================================
// CONTACT INFO CARD
// =========================================

function ContactInfo({
  icon,
  title,
  children,
  href,
}) {
  const content = (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-[#2D2723]">
          {title}
        </h3>

        <div className="mt-1 text-sm leading-6 text-[#756C65]">
          {children}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-2xl border border-[#E9DED6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#E98B50] hover:shadow-sm"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E9DED6] bg-white p-5">
      {content}
    </div>
  );
}

// =========================================
// PAGE
// =========================================

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send your message."
        );
      }

      setSuccess(
        "Your message has been sent successfully. We'll get back to you soon."
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);

      setError(
        error.message ||
          "Something went wrong while sending your message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-[#2D2723]">

      {/* HERO */}
      <section className="bg-[#FFF9F5] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-[#FFF1E8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C96C35]">
            Contact Cartiva
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            We&apos;re here to
            <span className="block text-[#E98B50]">
              help.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#756C65] sm:text-lg">
            Have a question about your order, account, products, or
            shopping experience? Get in touch with the Cartiva team.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">

          {/* INFORMATION */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
              Get in touch
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Contact information
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#756C65] sm:text-base">
              Reach out through any of the options below. We&apos;ll do
              our best to help with your questions.
            </p>

            <div className="mt-8 space-y-4">

              <ContactInfo
                icon={<MailIcon />}
                title="Email"
                href="mailto:hello@cartiva.com"
              >
                hello@cartiva.com
              </ContactInfo>

              <ContactInfo
                icon={<PhoneIcon />}
                title="Phone"
                href="tel:+923000000000"
              >
                +92 300 0000000
              </ContactInfo>

              <ContactInfo
                icon={<MapPinIcon />}
                title="Location"
              >
                Chakwal, Punjab
                <br />
                Pakistan
              </ContactInfo>

              <ContactInfo
                icon={<ClockIcon />}
                title="Support Hours"
              >
                Monday – Saturday
                <br />
                9:00 AM – 6:00 PM
              </ContactInfo>

            </div>
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-7 md:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#756C65]">
                Fill out the form and our team will receive your message.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-semibold"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What can we help with?"
                  className="w-full rounded-xl border border-[#E9DED6] bg-[#FFFDFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-[#E9DED6] bg-[#FFFDFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A69A92] focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/10"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#C96C35] focus:outline-none focus:ring-4 focus:ring-[#E98B50]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}

                {!loading && <ArrowIcon />}
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* QUICK HELP */}
      <section className="bg-[#FFF9F5] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
              Need something else?
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Quick links
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <QuickLink
              href="/orders"
              title="Track an order"
              description="View your recent orders and check their current status."
            />

            <QuickLink
              href="/account"
              title="Manage your account"
              description="Update your contact and shipping information."
            />

            <QuickLink
              href="/products"
              title="Continue shopping"
              description="Browse the latest Cartiva products and collections."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// =========================================
// QUICK LINK
// =========================================

function QuickLink({
  href,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E9DED6] bg-white p-6 transition hover:-translate-y-1 hover:border-[#E98B50] hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-[#2D2723]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#756C65]">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C96C35] transition group-hover:text-[#E98B50]">
        Open
        <ArrowIcon />
      </span>
    </Link>
  );
}