"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

function BagIcon({ className = "h-8 w-8" }) {
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

function PackageIcon({ className = "h-10 w-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }) {
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

function MinusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function Cart() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = Number(cartSubtotal || 0);
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <BagIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Looks like you haven&apos;t added anything to
            your cart yet.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            Continue Shopping
            <ArrowIcon />
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8 sm:mb-10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
            Your selection
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl lg:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-base text-[#756C65]">
            {cartCount}{" "}
            {cartCount === 1 ? "item" : "items"} in your
            cart.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

          {/* =====================================
              CART ITEMS
          ====================================== */}

          <div className="min-w-0 space-y-4 lg:col-span-2">

            {cart.map((product) => {
              const productId = String(
                product._id || product.id
              );

              const quantity = Math.max(
                1,
                Number(product.quantity || 1)
              );

              const price = Number(product.price || 0);

              const stock = Number(product.stock);

              const hasStockValue =
                Number.isFinite(stock) && stock >= 0;

              const isOutOfStock =
                product.unavailable ||
                (hasStockValue && stock <= 0);

              const reachedStockLimit =
                hasStockValue && quantity >= stock;

              const itemTotal = price * quantity;

              return (
                <article
                  key={productId}
                  className={`overflow-hidden rounded-2xl border transition sm:p-1 ${
                    isOutOfStock
                      ? "border-red-200 bg-red-50/50"
                      : "border-[#E9DED6] bg-white hover:border-[#F3B183] hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-4">

                    {/* PRODUCT IMAGE */}

                    <Link
                      href={`/products/${productId}`}
                      className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF1E8] sm:h-32 sm:w-32"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-[#E98B50]">
                          <PackageIcon />
                        </div>
                      )}
                    </Link>

                    {/* PRODUCT INFORMATION */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

                        <div className="min-w-0">

                          <Link
                            href={`/products/${productId}`}
                            className="block"
                          >
                            <h2 className="line-clamp-2 text-lg font-bold leading-6 text-[#2D2723] transition hover:text-[#C96C35] sm:text-xl">
                              {product.name}
                            </h2>
                          </Link>

                          <p className="mt-1 truncate text-sm text-[#C96C35]">
                            {product.category || "Product"}
                          </p>

                          <p className="mt-2 text-base font-semibold text-[#756C65]">
                            ${price.toFixed(2)} each
                          </p>

                        </div>

                        <p className="shrink-0 text-xl font-bold text-[#C96C35]">
                          ${itemTotal.toFixed(2)}
                        </p>

                      </div>

                      {/* OUT OF STOCK */}

                      {isOutOfStock && (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium leading-5 text-red-600">
                          This product is currently out of
                          stock. Please remove it before
                          checkout.
                        </div>
                      )}

                      {/* LOW STOCK */}

                      {!isOutOfStock &&
                        hasStockValue &&
                        stock <= 5 && (
                          <p className="mt-3 text-sm font-medium text-amber-600">
                            Only {stock} available
                          </p>
                        )}

                      {/* STOCK LIMIT */}

                      {!isOutOfStock &&
                        hasStockValue &&
                        reachedStockLimit && (
                          <p className="mt-3 text-sm text-[#756C65]">
                            Maximum available quantity
                            reached.
                          </p>
                        )}

                      {/* QUANTITY + REMOVE */}

                      <div className="mt-4 flex flex-wrap items-center gap-3">

                        <div className="flex items-center overflow-hidden rounded-xl border border-[#E9DED6] bg-white">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                productId,
                                quantity - 1
                              )
                            }
                            disabled={isOutOfStock}
                            className="flex h-11 w-11 items-center justify-center text-[#756C65] transition hover:bg-[#FFF9F5] hover:text-[#C96C35] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease ${product.name} quantity`}
                          >
                            <MinusIcon />
                          </button>

                          <span className="flex h-11 w-12 items-center justify-center border-x border-[#E9DED6] text-base font-semibold text-[#2D2723]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                productId,
                                quantity + 1
                              )
                            }
                            disabled={
                              isOutOfStock ||
                              reachedStockLimit
                            }
                            className="flex h-11 w-11 items-center justify-center text-[#756C65] transition hover:bg-[#FFF9F5] hover:text-[#C96C35] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            <PlusIcon />
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(productId)
                          }
                          className="rounded-lg px-2 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  </div>
                </article>
              );
            })}

            {/* CONTINUE SHOPPING */}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 pt-2 text-base font-semibold text-[#C96C35] transition hover:text-[#E98B50]"
            >
              <span aria-hidden="true">←</span>
              Continue Shopping
            </Link>

          </div>

          {/* =====================================
              ORDER SUMMARY
          ====================================== */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
                  <BagIcon className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                  Order Summary
                </h2>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between gap-4">
                  <span className="text-base text-[#756C65]">
                    Items
                  </span>

                  <span className="text-base font-medium text-[#2D2723]">
                    {cartCount}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-base text-[#756C65]">
                    Subtotal
                  </span>

                  <span className="text-base font-semibold text-[#2D2723]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-base text-[#756C65]">
                    Shipping
                  </span>

                  <span className="text-base font-semibold text-[#2D2723]">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-[#E9DED6] pt-4">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-lg font-bold text-[#2D2723]">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#C96C35]">
                      ${total.toFixed(2)}
                    </span>

                  </div>

                </div>
              </div>

              {/* CHECKOUT */}

              <Link
                href="/checkout"
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35]"
              >
                Proceed to Checkout
                <ArrowIcon />
              </Link>

              {/* SECURITY NOTE */}

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#E9DED6] pt-5 text-sm text-[#756C65]">
                <LockIcon />
                Secure checkout
              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}