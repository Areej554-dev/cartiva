import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

// =========================================
// SVG ICONS
// =========================================

function LockIcon({ className = "h-8 w-8" }) {
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
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function PackageIcon({ className = "h-8 w-8" }) {
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
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
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

function ArrowIcon({ className = "h-5 w-5" }) {
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

function CheckIcon({ className = "h-4 w-4" }) {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CancelIcon({ className = "h-5 w-5" }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

// =========================================
// STATUS STYLES
// =========================================

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-[#FFF1E8] text-[#C96C35] border-[#F3B183]",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

const statusSteps = [
  "Pending",
  "Shipped",
  "Delivered",
];

// =========================================
// ORDER PROGRESS
// =========================================

function OrderProgress({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 text-red-500">
            <CancelIcon />
          </div>

          <div className="min-w-0">
            <p className="text-base font-semibold text-red-700">
              Order Cancelled
            </p>

            <p className="mt-1 text-sm leading-6 text-red-600">
              This order has been cancelled and the ordered
              items have been returned to stock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = Math.max(
    0,
    statusSteps.indexOf(status)
  );

  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-[#E9DED6] bg-[#FFF9F5] p-4 sm:p-5">

      {/* Mobile tracker */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-2">
          {statusSteps.map((step, index) => {
            const completed =
              index <= currentIndex;

            return (
              <div
                key={step}
                className="flex min-w-0 flex-1 flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    completed
                      ? "bg-[#E98B50] text-white"
                      : "bg-[#E9DED6] text-[#756C65]"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : (
                    index + 1
                  )}
                </div>

                <p
                  className={`mt-2 text-center text-xs ${
                    completed
                      ? "font-semibold text-[#2D2723]"
                      : "text-[#756C65]"
                  }`}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center px-5">
          {statusSteps.slice(0, -1).map(
            (step, index) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full ${
                  index < currentIndex
                    ? "bg-[#E98B50]"
                    : "bg-[#E9DED6]"
                }`}
              />
            )
          )}
        </div>
      </div>

      {/* Tablet / Desktop tracker */}
      <div className="hidden sm:flex sm:items-start sm:justify-between">
        {statusSteps.map((step, index) => {
          const completed =
            index <= currentIndex;

          return (
            <div
              key={step}
              className="flex min-w-0 flex-1 items-start"
            >
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    completed
                      ? "bg-[#E98B50] text-white"
                      : "bg-[#E9DED6] text-[#756C65]"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : (
                    index + 1
                  )}
                </div>

                <p
                  className={`mt-2 text-sm ${
                    completed
                      ? "font-semibold text-[#2D2723]"
                      : "text-[#756C65]"
                  }`}
                >
                  {step}
                </p>
              </div>

              {index <
                statusSteps.length - 1 && (
                <div
                  className={`mx-2 mt-4 h-1 flex-1 rounded-full ${
                    index < currentIndex
                      ? "bg-[#E98B50]"
                      : "bg-[#E9DED6]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================
// ORDERS PAGE
// =========================================

export default async function OrdersPage() {
  const session =
    await getServerSession(authOptions);

  // =======================================
  // USER NOT LOGGED IN
  // =======================================

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <LockIcon />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Login Required
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Please login to view your orders.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35]"
          >
            Login
            <ArrowIcon className="h-4 w-4" />
          </Link>

        </div>
      </main>
    );
  }

  // =======================================
  // FETCH ORDERS + PRODUCTS
  // =======================================

  let orders = [];
  let products = [];

  try {
    await connectDB();

    [orders, products] =
      await Promise.all([
        Order.find({
          userId: String(
            session.user.id
          ),
        })
          .sort({
            createdAt: -1,
          })
          .lean(),

        Product.find({})
          .select(
            "_id id name image"
          )
          .lean(),
      ]);
  } catch (error) {
    console.error(
      "ORDERS PAGE ERROR:",
      error
    );
  }

  // =======================================
  // PRODUCT LOOKUP MAPS
  // =======================================

  const productByMongoId = new Map();
  const productByCustomId = new Map();
  const productByName = new Map();

  for (const product of products) {
    const mongoId = String(
      product._id
    );

    productByMongoId.set(
      mongoId,
      product
    );

    if (
      product.id !== undefined &&
      product.id !== null
    ) {
      productByCustomId.set(
        String(product.id),
        product
      );
    }

    if (product.name) {
      productByName.set(
        String(product.name)
          .trim()
          .toLowerCase(),
        product
      );
    }
  }

  // =======================================
  // FIX ORDER IMAGES
  // =======================================

  const ordersWithCurrentImages =
    orders.map((order) => {
      const updatedItems =
        (order.items || []).map(
          (item) => {
            const productId =
              String(
                item.productId || ""
              ).trim();

            const itemName =
              String(
                item.name || ""
              )
                .trim()
                .toLowerCase();

            const currentProduct =
              productByMongoId.get(
                productId
              ) ||
              productByCustomId.get(
                productId
              ) ||
              productByName.get(
                itemName
              );

            return {
              ...item,
              image:
                currentProduct?.image ||
                item.image ||
                "",
            };
          }
        );

      return {
        ...order,
        items: updatedItems,
      };
    });

  // =======================================
  // PAGE
  // =======================================

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-8 text-[#2D2723] sm:px-6 sm:py-10 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div className="min-w-0">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
              My Orders
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-6 text-[#756C65]">
              View your previous orders and track their
              progress.
            </p>

          </div>

          <Link
            href="/products"
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E9DED6] bg-white px-5 py-3 text-base font-semibold text-[#2D2723] shadow-sm transition hover:border-[#E98B50] hover:bg-[#FFF1E8] hover:text-[#C96C35]"
          >
            Continue Shopping
            <ArrowIcon className="h-4 w-4" />
          </Link>

        </div>

        {/* NO ORDERS */}

        {ordersWithCurrentImages.length === 0 ? (
          <div className="rounded-3xl border border-[#E9DED6] bg-white p-8 text-center shadow-sm sm:p-12 md:p-16">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
              <PackageIcon />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#2D2723] sm:text-3xl">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-base leading-6 text-[#756C65]">
              You haven&apos;t placed any orders yet.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35]"
            >
              Start Shopping
              <ArrowIcon className="h-4 w-4" />
            </Link>

          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">

            {ordersWithCurrentImages.map(
              (order) => {
                const orderId =
                  order._id.toString();

                const itemCount =
                  order.items?.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.quantity || 1
                      ),
                    0
                  ) || 0;

                return (
                  <article
                    key={orderId}
                    className="min-w-0 overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm transition hover:shadow-md"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-4 border-b border-[#E9DED6] p-4 sm:p-6 md:flex-row md:items-center md:justify-between">

                      <div className="min-w-0">

                        <p className="text-sm font-semibold uppercase tracking-wide text-[#756C65]">
                          Order ID
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold leading-5 text-[#2D2723] sm:text-base">
                          {orderId}
                        </p>

                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                          statusStyles[
                            order.status
                          ] ||
                          "border-[#E9DED6] bg-[#FFF9F5] text-[#756C65]"
                        }`}
                      >
                        {order.status}
                      </span>

                    </div>

                    {/* ORDER INFORMATION */}

                    <div className="grid gap-4 px-4 pt-5 sm:grid-cols-2 sm:px-6 sm:pt-6 lg:grid-cols-4">

                      <InfoItem
                        label="Date"
                        value={
                          order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "N/A"
                        }
                      />

                      <InfoItem
                        label="Items"
                        value={itemCount}
                      />

                      <InfoItem
                        label="Payment"
                        value={
                          order.paymentMethod ||
                          "Cash on Delivery"
                        }
                      />

                      <InfoItem
                        label="Total"
                        value={`$${Number(
                          order.total || 0
                        ).toFixed(2)}`}
                        highlight
                      />

                    </div>

                    {/* ORDER TRACKER */}

                    <div className="px-4 sm:px-6">
                      <OrderProgress
                        status={order.status}
                      />
                    </div>

                    {/* ORDERED ITEMS */}

                    <div className="mt-6 border-t border-[#E9DED6] px-4 pt-5 sm:px-6">

                      <p className="mb-4 text-base font-semibold text-[#2D2723]">
                        Ordered Items
                      </p>

                      <div className="space-y-3">

                        {order.items
                          ?.slice(0, 3)
                          .map(
                            (
                              item,
                              index
                            ) => (
                              <div
                                key={`${item.productId}-${index}`}
                                className="flex min-w-0 items-center gap-3 rounded-xl bg-[#FFF9F5] p-3 sm:gap-4"
                              >

                                {/* IMAGE */}

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E9DED6] bg-white sm:h-16 sm:w-16">

                                  {item.image ? (
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <ImageIcon className="text-[#C9BDB5]" />
                                  )}

                                </div>

                                {/* INFO */}

                                <div className="min-w-0 flex-1">

                                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#2D2723] sm:text-base">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-sm text-[#756C65]">
                                    Quantity:{" "}
                                    {item.quantity}
                                  </p>

                                </div>

                                {/* TOTAL */}

                                <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#C96C35] sm:text-base">
                                  $
                                  {(
                                    Number(
                                      item.price || 0
                                    ) *
                                    Number(
                                      item.quantity || 1
                                    )
                                  ).toFixed(
                                    2
                                  )}
                                </p>

                              </div>
                            )
                          )}

                      </div>

                      {order.items?.length >
                        3 && (
                        <p className="mt-4 text-sm text-[#756C65] sm:text-base">
                          +{" "}
                          {order.items.length -
                            3}{" "}
                          more item
                          {order.items.length -
                            3 !==
                          1
                            ? "s"
                            : ""}
                        </p>
                      )}

                    </div>

                    {/* ACTION */}

                    <div className="mt-6 border-t border-[#E9DED6] p-4 sm:p-6">

                      <div className="flex flex-col sm:flex-row sm:justify-end">

                        <Link
                          href={`/orders/${orderId}`}
                          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
                        >
                          View Order Details
                          <ArrowIcon className="h-4 w-4" />
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

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
  highlight = false,
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium text-[#756C65]">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-base font-semibold ${
          highlight
            ? "text-[#C96C35]"
            : "text-[#2D2723]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}