import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import AccountForm from "@/components/AccountForm";

// =========================================
// ICONS
// =========================================

function UserIcon({ className = "h-6 w-6" }) {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon({ className = "h-5 w-5" }) {
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

function PhoneIcon({ className = "h-5 w-5" }) {
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
      <path d="M6 2h3l2 5-2 2a16 16 0 0 0 6 6l2-2 5 2v3c0 1.1-.9 2-2 2C10 19 5 14 3 6c0-1.1.9-2 2-2Z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-5 w-5" }) {
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

function PackageIcon({ className = "h-6 w-6" }) {
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
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function HeartIcon({ className = "h-6 w-6" }) {
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
      <path d="M20.8 8.8c0 5.5-8.8 10.3-8.8 10.3S3.2 14.3 3.2 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function CartIcon({ className = "h-6 w-6" }) {
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
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.5 11h10L20 8H6" />
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
// ACCOUNT PAGE
// =========================================

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  let user = null;
  let orderCount = 0;

  try {
    await connectDB();

    user =
      await User.findById(
        session.user.id
      )
        .select(
          "name email phone address city postalCode isAdmin isActive createdAt"
        )
        .lean();

    orderCount =
      await Order.countDocuments({
        userId: String(
          session.user.id
        ),
      });
  } catch (error) {
    console.error(
      "ACCOUNT PAGE ERROR:",
      error
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <UserIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Account Not Found
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            We couldn&apos;t find your Cartiva account.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            Back to Home
            <ArrowIcon />
          </Link>

        </div>
      </main>
    );
  }

  const memberSince = user.createdAt
    ? new Date(
        user.createdAt
      ).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "N/A";

  const initials =
    user.name
      ?.split(/\s+/)
      .filter(Boolean)
      .map((part) =>
        part.charAt(0)
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const isActive =
    user.isActive !== false;

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

      <div className="mx-auto max-w-[1500px]">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-7 sm:mb-8">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
            Your Cartiva account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl lg:text-5xl">
            My Account
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-6 text-[#756C65]">
            Manage your profile, saved shipping
            information, and shopping activity.
          </p>

        </div>

        {/* =====================================
            ACCOUNT STATUS
        ====================================== */}

        {!isActive && (
          <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-700 sm:mb-8 sm:px-5">

            <p className="text-base font-semibold">
              Your account is currently deactivated.
            </p>

            <p className="mt-1 text-sm leading-5">
              Some account functions may be unavailable.
            </p>

          </div>
        )}

        {/* =====================================
            MAIN GRID
        ====================================== */}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.7fr_1fr] lg:gap-8">

          {/* ===================================
              LEFT COLUMN
          ==================================== */}

          <div className="min-w-0 space-y-6 sm:space-y-8">

            {/* PROFILE */}

            <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm sm:rounded-3xl">

              <div className="bg-[#2D2723] px-5 py-7 text-white sm:px-8 sm:py-8">

                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">

                  {/* Avatar */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E98B50] text-xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-2xl">
                    {initials}
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F3B183] sm:tracking-[0.18em]">
                      Customer profile
                    </p>

                    <h2 className="mt-1 break-words text-xl font-bold sm:text-3xl">
                      {user.name}
                    </h2>

                    <p className="mt-1 break-all text-sm leading-5 text-white/60">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">

                <InfoItem
                  label="Full Name"
                  value={user.name}
                />

                <InfoItem
                  label="Email Address"
                  value={user.email}
                />

                <InfoItem
                  label="Member Since"
                  value={memberSince}
                />

              </div>

            </section>

            {/* ACCOUNT FORM */}

            <div className="min-w-0">
              <AccountForm
                user={{
                  name:
                    user.name || "",
                  email:
                    user.email || "",
                  phone:
                    user.phone || "",
                  address:
                    user.address || "",
                  city:
                    user.city || "",
                  postalCode:
                    user.postalCode || "",
                }}
              />
            </div>

          </div>

          {/* ===================================
              RIGHT COLUMN
          ==================================== */}

          <aside className="min-w-0 space-y-5 sm:space-y-6">

            {/* ORDER STATISTICS */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#756C65]">
                    Your activity
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Account Overview
                  </h2>

                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50] sm:h-12 sm:w-12 sm:rounded-2xl">
                  <PackageIcon />
                </div>

              </div>

              <div className="mt-6 rounded-2xl bg-[#FFF9F5] p-5">

                <p className="text-sm text-[#756C65]">
                  Total Orders
                </p>

                <p className="mt-1 text-4xl font-bold text-[#2D2723]">
                  {orderCount}
                </p>

              </div>

              <Link
                href="/orders"
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35]"
              >
                View My Orders
                <ArrowIcon />
              </Link>

            </section>

            {/* SAVED CONTACT */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#756C65]">
                Saved information
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#2D2723] sm:text-2xl">
                Contact & Shipping
              </h2>

              <div className="mt-6 space-y-4">

                <ContactRow
                  icon={<MailIcon />}
                  label="Email"
                  value={user.email}
                />

                <ContactRow
                  icon={<PhoneIcon />}
                  label="Phone"
                  value={
                    user.phone ||
                    "Not provided"
                  }
                />

                <ContactRow
                  icon={<MapPinIcon />}
                  label="Address"
                  value={
                    user.address ||
                    "No address saved"
                  }
                />

              </div>

              {(user.city ||
                user.postalCode) && (
                <div className="mt-4 rounded-xl bg-[#FFF9F5] px-4 py-3.5 text-sm leading-5 text-[#756C65]">

                  {user.city && (
                    <p className="break-words">
                      {user.city}
                    </p>
                  )}

                  {user.postalCode && (
                    <p className="break-words">
                      {user.postalCode}
                    </p>
                  )}

                </div>
              )}

            </section>

            {/* QUICK LINKS */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#756C65]">
                Quick access
              </p>

              <div className="mt-4 space-y-2">

                <QuickLink
                  href="/orders"
                  icon={<PackageIcon />}
                  label="My Orders"
                />

                <QuickLink
                  href="/wishlist"
                  icon={<HeartIcon />}
                  label="My Wishlist"
                />

                <QuickLink
                  href="/cart"
                  icon={<CartIcon />}
                  label="Shopping Cart"
                />

                <QuickLink
                  href="/products"
                  icon={<ArrowIcon />}
                  label="Continue Shopping"
                />

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}

// =========================================
// INFO ITEM
// =========================================

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#756C65]">
        {label}
      </p>

      <p className="mt-2 break-words text-base font-semibold leading-6 text-[#2D2723]">
        {value || "Not provided"}
      </p>
    </div>
  );
}

// =========================================
// CONTACT ROW
// =========================================

function ContactRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9F5] text-[#E98B50]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#756C65]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium leading-5 text-[#2D2723]">
          {value}
        </p>

      </div>

    </div>
  );
}

// =========================================
// QUICK LINK
// =========================================

function QuickLink({
  href,
  icon,
  label,
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#E9DED6] px-4 py-3 transition hover:border-[#E98B50] hover:bg-[#FFF9F5]"
    >

      <span className="flex min-w-0 items-center gap-3">

        <span className="shrink-0 text-[#E98B50]">
          {icon}
        </span>

        <span className="truncate text-base font-semibold text-[#2D2723]">
          {label}
        </span>

      </span>

      <ArrowIcon className="shrink-0" />

    </Link>
  );
}