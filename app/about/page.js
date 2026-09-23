import Link from "next/link";

// =========================================
// SVG ICONS
// =========================================

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

function HeartIcon({ className = "h-7 w-7" }) {
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

function ShieldIcon({ className = "h-7 w-7" }) {
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

function UsersIcon({ className = "h-7 w-7" }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
// PAGE
// =========================================

export default function AboutPage() {
  return (
    <main className="bg-white text-[#2D2723]">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">

          <span className="inline-flex rounded-full bg-[#FFF1E8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#C96C35]">
            About Cartiva
          </span>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Shopping should feel
            <span className="block text-[#E98B50]">
              simple and personal.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#756C65] sm:text-lg">
            Cartiva is a modern online shopping platform created to bring
            everyday products, thoughtful design, and a smooth shopping
            experience together in one place.
          </p>

        </div>
      </section>

      {/* =====================================
          OUR STORY
      ====================================== */}

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">

          {/* Visual */}
          <div className="rounded-3xl bg-[#FFF1E8] p-6 sm:p-10">
            <div className="flex min-h-[360px] items-center justify-center rounded-2xl bg-white">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF1E8] text-[#E98B50]">
                  <BagIcon className="h-10 w-10" />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  The Cartiva idea
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#756C65]">
                  Bringing everyday shopping into a cleaner, easier,
                  more enjoyable experience.
                </p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
              Our story
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Built around better everyday shopping
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-[#756C65] sm:text-base">
              <p>
                Cartiva was created with one simple idea: online shopping
                should be convenient without feeling complicated.
              </p>

              <p>
                We bring together a growing selection of clothing, shoes,
                bags, watches, accessories, and beauty essentials so you can
                discover different products from one place.
              </p>

              <p>
                From browsing to checkout and order tracking, every part of
                Cartiva is designed to make the experience easier and more
                enjoyable.
              </p>
            </div>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#E98B50] px-6 py-3.5 font-semibold text-white transition hover:bg-[#C96C35]"
            >
              Explore Products
              <ArrowIcon />
            </Link>
          </div>

        </div>
      </section>

      {/* =====================================
          VALUES
      ====================================== */}

      <section className="bg-[#FFF9F5] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
              What matters to us
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Our values
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#756C65] sm:text-base">
              The principles behind the Cartiva experience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <ValueCard
              icon={<HeartIcon />}
              title="Customer first"
              description="We focus on creating a shopping experience that feels useful, clear, and convenient."
            />

            <ValueCard
              icon={<ShieldIcon />}
              title="Trust"
              description="We aim to provide a reliable experience throughout account management and ordering."
            />

            <ValueCard
              icon={<SparkleIcon />}
              title="Thoughtful selection"
              description="Our collection brings together products across different categories for everyday needs."
            />

            <ValueCard
              icon={<UsersIcon />}
              title="Community"
              description="Cartiva is designed to grow with the people who shop, explore, and return to it."
            />

          </div>
        </div>
      </section>

      {/* =====================================
          CATEGORIES
      ====================================== */}

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
                Discover
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Something for every style
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756C65] sm:text-base">
                Explore the categories that make up the Cartiva collection.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C96C35] transition hover:text-[#E98B50]"
            >
              Browse all
              <ArrowIcon />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <CategoryCard
              title="Clothing"
              description="Everyday styles made for different moments."
              href="/products?category=Clothing"
              icon={<SparkleIcon />}
            />

            <CategoryCard
              title="Shoes"
              description="Footwear for casual days and active lifestyles."
              href="/products?category=Shoes"
              icon={<BagIcon />}
            />

            <CategoryCard
              title="Bags"
              description="Practical pieces designed to carry your essentials."
              href="/products?category=Bags"
              icon={<BagIcon />}
            />

            <CategoryCard
              title="Watches"
              description="Timeless details that complete your look."
              href="/products?category=Watches"
              icon={<HeartIcon />}
            />

            <CategoryCard
              title="Accessories"
              description="Small details that make a big difference."
              href="/products?category=Accessories"
              icon={<SparkleIcon />}
            />

            <CategoryCard
              title="Beauty"
              description="Everyday beauty and personal care essentials."
              href="/products?category=Beauty"
              icon={<HeartIcon />}
            />

          </div>
        </div>
      </section>

      {/* =====================================
          CTA
      ====================================== */}

      <section className="px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#E98B50] px-6 py-14 text-center text-white sm:px-10 lg:py-16">

          <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/80">
            Start shopping
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold sm:text-5xl">
            Ready to explore Cartiva?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Discover your next favorite product from our growing collection.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[#C96C35] transition hover:bg-[#FFF9F5]"
          >
            Shop Now
            <ArrowIcon />
          </Link>

        </div>
      </section>

    </main>
  );
}

// =========================================
// VALUE CARD
// =========================================

function ValueCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#2D2723]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#756C65]">
        {description}
      </p>
    </div>
  );
}

// =========================================
// CATEGORY CARD
// =========================================

function CategoryCard({
  title,
  description,
  href,
  icon,
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E9DED6] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#E98B50] hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF1E8] text-[#E98B50] transition group-hover:bg-[#E98B50] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#756C65]">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C96C35] transition group-hover:text-[#E98B50]">
        Explore
        <ArrowIcon />
      </span>
    </Link>
  );
}