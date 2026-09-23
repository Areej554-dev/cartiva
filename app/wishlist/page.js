"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";

function HeartIcon({ filled = false, className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.3-8.8 10.3S3.2 14.3 3.2 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function BagIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
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

function TrashIcon({ className = "h-4 w-4" }) {
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
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m8 7 .7 13h6.6L16 7" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState(null);
  const [removingProduct, setRemovingProduct] = useState(null);

  // =========================================
  // LOAD WISHLIST
  // =========================================

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/wishlist", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load wishlist."
          );
        }

        if (!cancelled) {
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error("WISHLIST LOAD ERROR:", error);

        if (!cancelled) {
          setWishlist([]);
          setError(
            error.message || "Failed to load wishlist."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [status]);

  // =========================================
  // REMOVE FROM WISHLIST
  // =========================================

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingProduct(productId);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/wishlist?productId=${encodeURIComponent(
          String(productId)
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove product."
        );
      }

      setWishlist(data.wishlist || []);
      setMessage("Product removed from wishlist.");
    } catch (error) {
      console.error(
        "REMOVE WISHLIST ERROR:",
        error
      );

      setError(
        error.message || "Failed to remove product."
      );
    } finally {
      setRemovingProduct(null);
    }
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = (product) => {
    try {
      setAddingProduct(product.productId);
      setError("");
      setMessage("");

      addToCart({
        _id: product.productId,
        id: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });

      setMessage(`${product.name} added to cart.`);
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to add product to cart."
      );
    } finally {
      setAddingProduct(null);
    }
  };

  // =========================================
  // AUTH LOADING
  // =========================================

  if (status === "loading") {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 sm:px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E9DED6] border-t-[#E98B50]" />

          <p className="text-base text-[#756C65]">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // =========================================
  // LOGIN REQUIRED
  // =========================================

  if (!session?.user) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <HeartIcon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Login Required
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Please login to view and manage your wishlist.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#E98B50] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            Login
          </Link>

        </div>
      </main>
    );
  }

  // =========================================
  // WISHLIST LOADING
  // =========================================

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 sm:px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#E9DED6] border-t-[#E98B50]" />

          <p className="text-base text-[#756C65]">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-[#FFF9F5] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
              Saved for later
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2D2723] sm:text-4xl lg:text-5xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-base text-[#756C65]">
              Products you&apos;ve saved for later.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#E9DED6] bg-white px-5 py-3 text-base font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8]"
          >
            Continue Shopping
            <ArrowIcon />
          </Link>

        </div>

        {/* =====================================
            MESSAGES
        ====================================== */}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-base text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-base text-red-600">
            {error}
          </div>
        )}

        {/* =====================================
            EMPTY WISHLIST
        ====================================== */}

        {wishlist.length === 0 ? (
          <div className="rounded-3xl border border-[#E9DED6] bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
              <HeartIcon className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#2D2723] sm:text-3xl">
              Your Wishlist is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-base leading-6 text-[#756C65]">
              Save products you love and they&apos;ll be
              waiting for you here.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
            >
              Browse Products
              <ArrowIcon />
            </Link>

          </div>
        ) : (
          <>
            {/* =====================================
                WISHLIST COUNT
            ====================================== */}

            <div className="mb-5">
              <p className="text-base text-[#756C65]">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"}{" "}
                saved
              </p>
            </div>

            {/* =====================================
                WISHLIST GRID
            ====================================== */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {wishlist.map((product) => (
                <article
                  key={product.productId}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E98B50] hover:shadow-lg"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-square w-full overflow-hidden bg-[#FFF1E8]">

                    <Link
                      href={`/products/${product.productId}`}
                      className="flex h-full w-full items-center justify-center p-5 sm:p-6"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#E98B50]">
                          <BagIcon className="h-12 w-12" />
                        </div>
                      )}
                    </Link>

                    <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#E98B50] shadow-sm backdrop-blur sm:right-4 sm:top-4">
                      <HeartIcon
                        filled
                        className="h-5 w-5"
                      />
                    </div>

                  </div>

                  {/* INFORMATION */}

                  <div className="flex flex-1 flex-col p-4 sm:p-5">

                    <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-[#C96C35]">
                      {product.category || "Product"}
                    </p>

                    <Link
                      href={`/products/${product.productId}`}
                    >
                      <h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-6 text-[#2D2723] transition-colors hover:text-[#C96C35]">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="mt-3 text-xl font-bold text-[#C96C35]">
                      $
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </p>

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-col gap-2.5">

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                        disabled={
                          addingProduct ===
                          product.productId
                        }
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {addingProduct ===
                        product.productId ? (
                          <>
                            <Spinner />
                            Adding...
                          </>
                        ) : (
                          <>
                            <BagIcon className="h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </button>

                      <Link
                        href={`/products/${product.productId}`}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#E9DED6] px-4 py-3 text-base font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF9F5]"
                      >
                        View Product
                        <ArrowIcon />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.productId
                          )
                        }
                        disabled={
                          removingProduct ===
                          product.productId
                        }
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <TrashIcon />
                        {removingProduct ===
                        product.productId
                          ? "Removing..."
                          : "Remove from Wishlist"}
                      </button>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          </>
        )}

      </div>
    </main>
  );
}