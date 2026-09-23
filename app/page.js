import Link from "next/link";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import HeroProductCarousel from "@/components/HeroProductCarousel";

// =========================================
// SVG ICONS
// =========================================

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

function ShirtIcon({ className = "h-7 w-7" }) {
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
      <path d="M8 4 4 6l-2 4 4 2v8h12v-8l4-2-2-4-4-2" />
      <path d="M8 4c.6 2 7.4 2 8 0" />
    </svg>
  );
}

function ShoeIcon({ className = "h-7 w-7" }) {
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
      <path d="M3 17c3.5 0 5.2-1.6 6.5-4.5L11 9l4 5h3c2 0 3 1 3 3v1H3v-1Z" />
      <path d="M7 17h3" />
      <path d="M13 14h4" />
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

function WatchIcon({ className = "h-7 w-7" }) {
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
      <rect x="7" y="5" width="10" height="14" rx="4" />
      <path d="M9 2h6" />
      <path d="M9 22h6" />
      <path d="M12 9v3l2 1" />
    </svg>
  );
}

function BeautyIcon({ className = "h-7 w-7" }) {
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
      <path d="M9 3h6" />
      <path d="M10 3v5l-4 9a3 3 0 0 0 2.8 4h6.4A3 3 0 0 0 18 17l-4-9V3" />
      <path d="M9 13h6" />
    </svg>
  );
}

function SparkleIcon({ className = "h-7 w-7" }) {
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
      <path d="M12 3l1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-6 w-6"
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

function HeartIcon() {
  return (
    <svg
      className="h-6 w-6"
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

// =========================================
// GET PRODUCTS
// =========================================

async function getProducts() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));
  } catch (error) {
    console.error(
      "HOMEPAGE PRODUCT ERROR:",
      error
    );

    return [];
  }
}

// =========================================
// CATEGORY DATA
// =========================================

const categories = [
  {
    name: "Clothing",
    description: "Everyday styles",
    href: "/products?category=Clothing",
    icon: <ShirtIcon />,
  },
  {
    name: "Shoes",
    description: "Modern footwear",
    href: "/products?category=Shoes",
    icon: <ShoeIcon />,
  },
  {
    name: "Bags",
    description: "Carry in style",
    href: "/products?category=Bags",
    icon: <BagIcon />,
  },
  {
    name: "Watches",
    description: "Timeless details",
    href: "/products?category=Watches",
    icon: <WatchIcon />,
  },
  {
    name: "Accessories",
    description: "Finishing touches",
    href: "/products?category=Accessories",
    icon: <SparkleIcon />,
  },
  {
    name: "Beauty",
    description: "Daily essentials",
    href: "/products?category=Beauty",
    icon: <BeautyIcon />,
  },
];

// =========================================
// HOME
// =========================================

export default async function Home() {
  const products = await getProducts();

  const featuredProducts = products.slice(0, 8);

  const beautyProducts = products
    .filter(
      (product) =>
        product.category?.toLowerCase() === "beauty"
    )
    .slice(0, 4);

  const accessoryProducts = products
    .filter(
      (product) =>
        product.category?.toLowerCase() === "accessories"
    )
    .slice(0, 4);

  return (
    <main className="bg-white text-[#2D2723]">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="bg-[#FFF9F5] px-3 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm sm:rounded-3xl lg:grid-cols-2">

          {/* Content */}
          <div className="flex min-w-0 flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">

            <span className="mb-4 w-fit rounded-full bg-[#FFF1E8] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#C96C35] sm:mb-5 sm:px-4 sm:text-sm sm:tracking-[0.18em]">
              Welcome to Cartiva
            </span>

            <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Style that feels
              <span className="block text-[#E98B50]">
                like you.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#756C65] sm:mt-6 sm:text-lg">
              Discover clothing, shoes, bags, watches,
              accessories, and beauty essentials carefully
              selected for everyday life.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">

              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
              >
                Shop Collection
                <ArrowIcon />
              </Link>

              <Link
                href="/products?category=Beauty"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#E9DED6] px-6 py-3.5 text-base font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF9F5] sm:w-auto"
              >
                Explore Beauty
              </Link>

            </div>
          </div>

          {/* Hero Product */}
          <div className="min-w-0 bg-[#FFF1E8] p-3 sm:p-6 lg:p-8">
            <HeroProductCarousel products={products} />
          </div>

        </div>
      </section>

      {/* =====================================
          SHOP BY CATEGORY
      ====================================== */}

      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">

            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                Explore
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-2 max-w-xl text-base text-[#756C65]">
                Find exactly what fits your style and everyday
                needs.
              </p>
            </div>

            <Link
              href="/products"
              className="hidden shrink-0 items-center gap-2 text-base font-semibold text-[#C96C35] transition hover:text-[#E98B50] sm:inline-flex"
            >
              View all
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group min-w-0 rounded-2xl border border-[#E9DED6] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#E98B50] hover:shadow-md sm:p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50] transition group-hover:bg-[#E98B50] group-hover:text-white sm:h-12 sm:w-12">
                  {category.icon}
                </div>

                <h3 className="mt-4 truncate text-base font-semibold text-[#2D2723] sm:mt-5">
                  {category.name}
                </h3>

                <p className="mt-1 line-clamp-1 text-sm text-[#756C65]">
                  {category.description}
                </p>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================
          FEATURED PRODUCTS
      ====================================== */}

      {featuredProducts.length > 0 && (
        <section className="bg-[#FFF9F5] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-7xl">

            <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
                  Featured
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
                  Popular picks
                </h2>

                <p className="mt-2 text-base text-[#756C65]">
                  Explore some of the latest products in Cartiva.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex w-fit items-center gap-2 text-base font-semibold text-[#C96C35] transition hover:text-[#E98B50]"
              >
                View all products
                <ArrowIcon />
              </Link>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =====================================
          BEAUTY + ACCESSORIES
      ====================================== */}

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 sm:mb-8">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
              Discover more
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
              Beauty & Accessories
            </h2>

            <p className="mt-2 max-w-2xl text-base leading-6 text-[#756C65]">
              Complete your look with everyday beauty essentials
              and thoughtful finishing touches.
            </p>

          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">

            {/* Beauty */}

            <div className="min-w-0 rounded-2xl border border-[#E9DED6] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">

              <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50] sm:h-11 sm:w-11">
                    <BeautyIcon />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#2D2723]">
                      Beauty
                    </h3>

                    <p className="text-sm text-[#756C65] sm:text-base">
                      Everyday essentials
                    </p>
                  </div>

                </div>

                <Link
                  href="/products?category=Beauty"
                  className="shrink-0 text-sm font-semibold text-[#C96C35] hover:text-[#E98B50] sm:text-base"
                >
                  Shop
                </Link>

              </div>

              {beautyProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {beautyProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <CategoryEmpty
                  title="Beauty collection"
                  description="Explore our beauty and personal care products."
                  href="/products?category=Beauty"
                  icon={<BeautyIcon />}
                />
              )}

            </div>

            {/* Accessories */}

            <div className="min-w-0 rounded-2xl border border-[#E9DED6] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">

              <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50] sm:h-11 sm:w-11">
                    <SparkleIcon />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#2D2723]">
                      Accessories
                    </h3>

                    <p className="text-sm text-[#756C65] sm:text-base">
                      Finishing touches
                    </p>
                  </div>

                </div>

                <Link
                  href="/products?category=Accessories"
                  className="shrink-0 text-sm font-semibold text-[#C96C35] hover:text-[#E98B50] sm:text-base"
                >
                  Shop
                </Link>

              </div>

              {accessoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {accessoryProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <CategoryEmpty
                  title="Accessories collection"
                  description="Explore pieces that complete your everyday look."
                  href="/products?category=Accessories"
                  icon={<SparkleIcon />}
                />
              )}

            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          WHY CARTIVA
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 text-center sm:mb-8">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
              Why Cartiva
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
              Shopping made simple
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-6 text-[#756C65]">
              Everything you need for a smoother and more convenient
              shopping experience.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-5">

            <Feature
              icon={<TruckIcon />}
              title="Simple delivery"
              description="A straightforward ordering and delivery experience from start to finish."
            />

            <Feature
              icon={<ShieldIcon />}
              title="Secure shopping"
              description="Your account and order experience are designed with security in mind."
            />

            <Feature
              icon={<HeartIcon />}
              title="Easy shopping"
              description="Browse products, save favorites, manage your cart, and track orders with ease."
            />

          </div>
        </div>
      </section>

      {/* =====================================
          FINAL CTA
      ====================================== */}

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#E98B50] px-5 py-12 text-center text-white sm:rounded-3xl sm:px-10 sm:py-14">

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">
            Start exploring
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-5xl">
            Find something you&apos;ll love.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-6 text-white/80">
            Explore the full Cartiva collection and discover
            products for every part of your everyday life.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-[#C96C35] transition hover:bg-[#FFF9F5] sm:mt-8 sm:w-auto"
          >
            Shop Cartiva
            <ArrowIcon />
          </Link>

        </div>
      </section>

    </main>
  );
}

// =========================================
// FEATURE
// =========================================

function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 text-center shadow-sm sm:p-6">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#2D2723]">
        {title}
      </h3>

      <p className="mt-2 text-base leading-6 text-[#756C65]">
        {description}
      </p>

    </div>
  );
}

// =========================================
// EMPTY CATEGORY
// =========================================

function CategoryEmpty({
  title,
  description,
  href,
  icon,
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl bg-[#FFF9F5] p-6 text-center transition hover:bg-[#FFF1E8] sm:min-h-[250px] sm:p-8"
    >

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#E98B50] shadow-sm">
        {icon}
      </div>

      <h4 className="mt-5 text-base font-bold text-[#2D2723]">
        {title}
      </h4>

      <p className="mt-2 max-w-xs text-base leading-6 text-[#756C65]">
        {description}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-[#C96C35]">
        Explore collection
        <ArrowIcon />
      </span>

    </Link>
  );
}