import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";

import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderTracker from "@/components/OrderTracker";
import CancelOrder from "@/components/CancelOrder";

// =========================================
// SVG ICONS
// =========================================

function PackageIcon({ className = "h-8 w-8" }) {
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

function UserIcon({ className = "h-5 w-5" }) {
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

function ImageIcon({ className = "h-6 w-6" }) {
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
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m7 16 3-3 2 2 3-4 4 5" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }) {
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
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
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

function LockIcon({ className = "h-5 w-5" }) {
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
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

// =========================================
// STATUS STYLES
// =========================================

const statusStyles = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700",
  Shipped:
    "border-[#F3B183] bg-[#FFF1E8] text-[#C96C35]",
  Delivered:
    "border-green-200 bg-green-50 text-green-700",
  Cancelled:
    "border-red-200 bg-red-50 text-red-600",
};

// =========================================
// ORDER DETAILS
// =========================================

export default async function OrderDetails({
  params,
}) {
  const { id } = await params;

  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // =======================================
  // VALIDATE ORDER ID
  // =======================================

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <PackageIcon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Invalid Order
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            The order ID is invalid.
          </p>

          <Link
            href="/orders"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            <ArrowLeftIcon />
            Back to Orders
          </Link>

        </div>
      </main>
    );
  }

  let order = null;

  // =======================================
  // LOAD ORDER
  // =======================================

  try {
    await connectDB();

    order = await Order.findOne({
      _id: id,
      userId: String(session.user.id),
    }).lean();
  } catch (error) {
    console.error(
      "ORDER DETAILS ERROR:",
      error
    );

    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <PackageIcon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723]">
            Unable to Load Order
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Something went wrong while loading this order.
          </p>

          <Link
            href="/orders"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            <ArrowLeftIcon />
            Back to Orders
          </Link>

        </div>
      </main>
    );
  }

  // =======================================
  // ORDER NOT FOUND
  // =======================================

  if (!order) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <PackageIcon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Order Not Found
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            We could not find this order.
          </p>

          <Link
            href="/orders"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            <ArrowLeftIcon />
            Back to Orders
          </Link>

        </div>
      </main>
    );
  }

  const orderId =
    order._id.toString();

  const itemCount =
    order.items?.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 1),
      0
    ) || 0;

  const statusStyle =
    statusStyles[order.status] ||
    "border-[#E9DED6] bg-[#FFF9F5] text-[#756C65]";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF9F5] px-4 py-7 text-[#2D2723] sm:px-6 sm:py-10 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-6 sm:mb-8">

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#756C65] transition hover:text-[#C96C35] sm:text-base"
          >
            <ArrowLeftIcon />
            Back to Orders
          </Link>

          <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                Order information
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl lg:text-5xl">
                Order Details
              </h1>

              <p className="mt-2 break-all text-sm leading-5 text-[#756C65] sm:text-base">
                Order ID: {orderId}
              </p>

            </div>

            <span
              className={`w-fit shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle}`}
            >
              {order.status}
            </span>

          </div>

        </div>

        {/* =====================================
            TRACKER
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#E9DED6] bg-white p-4 shadow-sm sm:p-6">
          <OrderTracker status={order.status} />
        </div>

        {/* =====================================
            MAIN CONTENT
        ====================================== */}

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3 lg:gap-8">

          {/* ===================================
              LEFT CONTENT
          ==================================== */}

          <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2">

            {/* CUSTOMER INFORMATION */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
                  <UserIcon />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Customer Information
                  </h2>
                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <InfoItem
                  label="First Name"
                  value={order.customer?.firstName}
                />

                <InfoItem
                  label="Last Name"
                  value={order.customer?.lastName}
                />

                <InfoItem
                  label="Email"
                  value={order.customer?.email}
                  breakValue
                />

                <InfoItem
                  label="Phone"
                  value={order.customer?.phone}
                />

              </div>

            </section>

            {/* SHIPPING ADDRESS */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
                  <MapPinIcon />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Shipping Address
                  </h2>
                </div>

              </div>

              <div className="rounded-xl bg-[#FFF9F5] p-4">

                <p className="break-words text-base font-semibold leading-6 text-[#2D2723]">
                  {order.shippingAddress?.address ||
                    "No address provided"}
                </p>

                <p className="mt-2 break-words text-base text-[#756C65]">
                  {order.shippingAddress?.city ||
                    "No city provided"}
                </p>

                <p className="mt-1 break-words text-sm text-[#756C65]">
                  Postal Code:{" "}
                  {order.shippingAddress?.postalCode ||
                    "N/A"}
                </p>

              </div>

            </section>

            {/* ORDERED ITEMS */}

            <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center justify-between gap-3">

                <div className="min-w-0">

                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Ordered Items
                  </h2>

                  <p className="mt-1 text-sm text-[#756C65] sm:text-base">
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "item"
                      : "items"}
                  </p>

                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
                  <PackageIcon className="h-5 w-5" />
                </div>

              </div>

              <div className="space-y-4">

                {order.items?.map(
                  (item, index) => {

                    const itemTotal =
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity || 1
                      );

                    return (
                      <div
                        key={`${item.productId}-${index}`}
                        className="flex min-w-0 flex-col gap-4 border-b border-[#E9DED6] pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                      >

                        {/* IMAGE */}

                        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF1E8] sm:h-24 sm:w-24">

                          {item.image ? (
                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-[#C9BDB5]" />
                          )}

                        </div>

                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                          <h3 className="break-words text-lg font-bold leading-6 text-[#2D2723] sm:text-xl">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-[#756C65] sm:text-base">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#C96C35] sm:text-base">
                            $
                            {Number(
                              item.price || 0
                            ).toFixed(2)}{" "}
                            each
                          </p>

                        </div>

                        {/* TOTAL */}

                        <p className="shrink-0 text-xl font-bold text-[#C96C35]">
                          ${itemTotal.toFixed(2)}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

          </div>

          {/* ===================================
              ORDER SUMMARY
          ==================================== */}

          <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit">

            <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
                  <PackageIcon className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                  Order Summary
                </h2>

              </div>

              <div className="mt-6 space-y-4">

                <SummaryRow
                  label="Subtotal"
                  value={`$${Number(
                    order.subtotal || 0
                  ).toFixed(2)}`}
                />

                <SummaryRow
                  label="Shipping"
                  value={`$${Number(
                    order.shipping || 0
                  ).toFixed(2)}`}
                />

                <div className="border-t border-[#E9DED6] pt-4">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-lg font-bold text-[#2D2723]">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#C96C35]">
                      ${Number(
                        order.total || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              {/* PAYMENT */}

              <div className="mt-6 border-t border-[#E9DED6] pt-6">

                <p className="text-sm font-medium text-[#756C65]">
                  Payment Method
                </p>

                <p className="mt-1 break-words text-base font-semibold text-[#2D2723]">
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </p>

              </div>

              {/* DATE */}

              <div className="mt-6 border-t border-[#E9DED6] pt-6">

                <p className="text-sm font-medium text-[#756C65]">
                  Order Date
                </p>

                <p className="mt-1 text-base font-semibold text-[#2D2723]">
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

              </div>

              {/* CANCEL */}

              {order.status === "Pending" && (
                <div className="mt-6 border-t border-[#E9DED6] pt-6">
                  <CancelOrder
                    orderId={orderId}
                  />
                </div>
              )}

              {/* BACK TO ORDERS */}

              <Link
                href="/orders"
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35]"
              >
                <ArrowLeftIcon />
                Back to Orders
              </Link>

              {/* SECURITY NOTE */}

              <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#E9DED6] pt-4 text-sm text-[#756C65]">
                <LockIcon />
                Secure order information
              </div>

            </div>

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
  breakValue = false,
}) {
  return (
    <div className="min-w-0">

      <p className="text-sm font-medium text-[#756C65]">
        {label}
      </p>

      <p
        className={`mt-1 text-base font-semibold leading-6 text-[#2D2723] ${
          breakValue
            ? "break-all"
            : "break-words"
        }`}
      >
        {value || "Not provided"}
      </p>

    </div>
  );
}

// =========================================
// SUMMARY ROW
// =========================================

function SummaryRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-base text-[#756C65]">
        {label}
      </span>

      <span className="shrink-0 text-base font-semibold text-[#2D2723]">
        {value}
      </span>

    </div>
  );
}