import Link from "next/link";
import ProductRating from "@/components/ProductRating";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }) {
  const productId = String(product._id || product.id);

  const productData = {
    ...product,
    _id: productId,
  };

  const stock = Number(product.stock ?? 0);

  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-[#E9DED6] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E98B50] hover:shadow-lg">

      {/* =====================================
          PRODUCT IMAGE
      ====================================== */}

      <div className="relative aspect-square w-full overflow-hidden bg-[#FFF1E8]">

        <Link
          href={`/products/${productId}`}
          className="flex h-full w-full items-center justify-center"
        >
          {product.image ? (
            <div className="flex h-full w-full items-center justify-center p-5 sm:p-7">
              <img
                src={product.image}
                onError={() => console.log("IMAGE FAILED:", product.name, product.image)}
                alt={product.name}
                className={`object-contain transition-transform duration-500 group-hover:scale-[1.03] ${product.category === "Watches"
                  ? "max-h-[72%] max-w-[72%]"
                  : product.category === "Bags"
                    ? "max-h-[76%] max-w-[84%]"
                    : product.category === "Shoes"
                      ? "max-h-[78%] max-w-[84%]"
                      : product.category === "Beauty"
                        ? "max-h-[78%] max-w-[72%]"
                        : product.category === "Accessories"
                          ? "max-h-[76%] max-w-[76%]"
                          : "max-h-[82%] max-w-[78%]"
                  }`}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#E98B50]">
              <svg
                className="h-12 w-12 sm:h-14 sm:w-14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 8h14l1 12H4L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </div>
          )}
        </Link>

        {/* Stock badge */}
        <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm sm:px-3 sm:py-1.5">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm sm:px-3 sm:py-1.5">
              Only {stock} left
            </span>
          ) : (
            <span className="rounded-full bg-[#FFF9F5] px-2.5 py-1 text-xs font-semibold text-[#C96C35] shadow-sm sm:px-3 sm:py-1.5">
              In Stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <div className="rounded-full bg-white/95 shadow-sm backdrop-blur">
            <WishlistButton product={productData} />
          </div>
        </div>
      </div>

      {/* =====================================
          PRODUCT INFORMATION
      ====================================== */}

      <div className="min-w-0 p-4 sm:p-5">

        {/* Category */}
        <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-[#C96C35]">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/products/${productId}`}>
          <h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-6 text-[#2D2723] transition-colors hover:text-[#C96C35] sm:text-xl">
            {product.name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="mt-2 min-h-[24px]">
          <ProductRating productId={productId} />
        </div>

        {/* Price + Stock */}
        <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">

          <p className="text-xl font-bold text-[#C96C35]">
            ${Number(product.price || 0).toFixed(2)}
          </p>

          {!isOutOfStock && (
            <p className="text-sm text-[#756C65]">
              {stock} available
            </p>
          )}
        </div>

        {/* View Product */}
        <Link
          href={`/products/${productId}`}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-[#C96C35] sm:mt-5"
        >
          View Product

          <svg
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
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
        </Link>

      </div>
    </article>
  );
}