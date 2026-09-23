import ProductQuantity from "@/components/ProductQuantity";
import Reviews from "@/components/Reviews";
import WishlistButton from "@/components/WishlistButton";
import ProductRating from "@/components/ProductRating";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// =========================================
// SVG ICONS
// =========================================

function PackageIcon({ className = "h-20 w-20" }) {
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

function ShieldIcon({ className = "h-5 w-5" }) {
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
      <path d="M12 3 20 6v6c0 4.8-3.4 8.1-8 9-4.6-.9-8-4.2-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function BagIcon({ className = "h-5 w-5" }) {
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

function CheckIcon({ className = "h-5 w-5" }) {
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
      <path d="m5 12 4 4L19 6" />
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
// PRODUCT DETAILS PAGE
// =========================================

export default async function ProductDetails({
  params,
}) {
  const { id } = await params;

  await connectDB();

  const product =
    await Product.findById(id).lean();

  // =======================================
  // PRODUCT NOT FOUND
  // =======================================

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFF9F5] px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <PackageIcon className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Product not found
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            The product you&apos;re looking for doesn&apos;t
            exist or has been removed.
          </p>

        </div>
      </main>
    );
  }

  // =======================================
  // PREPARE PRODUCT
  // =======================================

  const productId =
    product._id.toString();

  const productData = {
    ...product,
    _id: productId,
  };

  const stock =
    Number(product.stock ?? 0);

  const isOutOfStock =
    stock <= 0;

  const isLowStock =
    stock > 0 && stock <= 5;

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-6 sm:px-6 sm:py-9 lg:px-8 lg:py-12">

      <div className="mx-auto max-w-[1500px]">

        {/* =================================
            BREADCRUMB
        ================================== */}

        <div className="mb-6 overflow-x-auto whitespace-nowrap text-sm text-[#756C65] sm:mb-8">
          <span>Home</span>

          <span className="mx-2 text-[#B9AEA7]">
            /
          </span>

          <span>Products</span>

          <span className="mx-2 text-[#B9AEA7]">
            /
          </span>

          <span className="font-medium text-[#2D2723]">
            {product.name}
          </span>
        </div>

        {/* =================================
            MAIN PRODUCT AREA
        ================================== */}

        <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">

          {/* =================================
              PRODUCT IMAGE
          ================================== */}

          <div className="min-w-0">

            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#E9DED6] bg-[#FFF1E8] sm:rounded-3xl">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-5 sm:p-10 lg:p-12"
                />
              ) : (
                <div className="text-[#E98B50]">
                  <PackageIcon className="h-16 w-16 sm:h-20 sm:w-20" />
                </div>
              )}

              {/* Stock badge */}

              <div className="absolute left-3 top-3 sm:left-5 sm:top-5">

                {isOutOfStock ? (
                  <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                    Only {stock} left
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FFF9F5] px-3 py-1.5 text-xs font-semibold text-[#C96C35] shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                    In Stock
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* =================================
              PRODUCT INFORMATION
          ================================== */}

          <div className="flex min-w-0 flex-col justify-center">

            {/* Category */}

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C96C35]">
              {product.category}
            </p>

            {/* Product Name */}

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#2D2723] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-4">
              <ProductRating
                productId={productId}
              />
            </div>

            {/* Price */}

            <p className="mt-5 text-3xl font-bold text-[#C96C35] sm:text-4xl">
              $
              {Number(
                product.price || 0
              ).toFixed(2)}
            </p>

            {/* Description */}

            <div className="mt-6 border-t border-[#E9DED6] pt-6">

              <h2 className="text-lg font-bold text-[#2D2723] sm:text-xl">
                Description
              </h2>

              <p className="mt-3 text-base leading-7 text-[#756C65]">
                {product.description ||
                  `Discover the ${product.name} from the Cartiva collection. Designed to complement your everyday style and needs.`}
              </p>

            </div>

            {/* Stock information */}

            <div className="mt-6">

              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-base font-semibold text-red-600">
                  <CheckIcon className="h-5 w-5" />
                  This product is currently unavailable.
                </div>
              ) : (
                <p className="flex items-center gap-2 text-base font-semibold text-[#2D2723]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>

                  {stock}{" "}
                  {stock === 1
                    ? "item"
                    : "items"}{" "}
                  available
                </p>
              )}

            </div>

            {/* Quantity + Wishlist */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">

              {!isOutOfStock && (
                <div className="min-w-0 flex-1 sm:flex-none">
                  <ProductQuantity
                    product={productData}
                  />
                </div>
              )}

              <div className="shrink-0">
                <WishlistButton
                  product={productData}
                />
              </div>

            </div>

            {/* =================================
                PRODUCT BENEFITS
            ================================== */}

            <div className="mt-8 grid gap-3 border-t border-[#E9DED6] pt-7 sm:grid-cols-3">

              <Benefit
                icon={<ShieldIcon />}
                title="Secure checkout"
                text="Protected ordering experience"
              />

              <Benefit
                icon={<BagIcon />}
                title="Easy shopping"
                text="Simple cart and checkout"
              />

              <Benefit
                icon={<CheckIcon />}
                title="Stock verified"
                text="Availability checked before purchase"
              />

            </div>

          </div>

        </div>

        {/* =================================
            REVIEWS
        ================================== */}

        <section className="mt-12 border-t border-[#E9DED6] pt-10 sm:mt-16 sm:pt-12">

          <Reviews
            productId={productId}
          />

        </section>

      </div>

    </main>
  );
}

// =========================================
// BENEFIT
// =========================================

function Benefit({
  icon,
  title,
  text,
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E9DED6] bg-white p-4 shadow-sm sm:p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
        {icon}
      </div>

      <h3 className="mt-4 text-base font-bold text-[#2D2723]">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-[#756C65]">
        {text}
      </p>

    </div>
  );
}