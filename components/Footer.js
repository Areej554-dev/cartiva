export default function Footer() {
  return (
    <footer className="border-t border-[#E9DED6] bg-[#2D2723] text-white">

      {/* =====================================
          NEWSLETTER
      ====================================== */}

      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-9 sm:px-6 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8">

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F3B183] sm:tracking-[0.18em]">
              Stay connected
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Get Cartiva updates
            </h2>

            <p className="mt-2 max-w-xl text-base leading-6 text-white/65">
              Stay updated with new products, special offers,
              and the latest from Cartiva.
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">

            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/45 focus:border-[#E98B50] focus:ring-4 focus:ring-[#E98B50]/15"
            />

            <button
              type="button"
              className="min-h-12 w-full rounded-xl bg-[#E98B50] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35] focus:outline-none focus:ring-4 focus:ring-[#E98B50]/20 sm:w-auto"
            >
              Subscribe
            </button>

          </div>
        </div>
      </div>

      {/* =====================================
          MAIN FOOTER
      ====================================== */}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-9 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-8">

        {/* BRAND */}

        <div className="min-w-0 md:col-span-2 lg:col-span-1">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E98B50]">
              <svg
                className="h-[23px] w-[23px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h18" />
                <path d="M5 8v11h14V8" />
                <path d="M4 8 6 3h12l2 5" />
                <path d="M9 12h6" />
              </svg>
            </div>

            <span className="text-2xl font-bold">
              Cartiva
            </span>

          </div>

          <p className="mt-5 max-w-sm text-base leading-7 text-white/60">
            A modern shopping experience designed to make
            discovering your favorite products simple and enjoyable.
          </p>

          {/* SOCIAL */}

          <div className="mt-6 flex items-center gap-3">

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[#E98B50] hover:bg-[#E98B50] hover:text-white"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.8"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[#E98B50] hover:bg-[#E98B50] hover:text-white"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V10H7v3h2.6v8h3.9Z" />
              </svg>
            </a>

            <a
              href="mailto:hello@cartiva.com"
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-[#E98B50] hover:bg-[#E98B50] hover:text-white"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>

          </div>
        </div>

        {/* SHOP */}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#F3B183]">
            Shop
          </h3>

          <div className="mt-5 flex flex-col gap-1">

            <FooterLink
              href="/products"
              label="All Products"
            />

            <FooterLink
              href="/products?category=Clothing"
              label="Clothing"
            />

            <FooterLink
              href="/products?category=Shoes"
              label="Shoes"
            />

            <FooterLink
              href="/products?category=Bags"
              label="Bags"
            />

            <FooterLink
              href="/products?category=Watches"
              label="Watches"
            />

            <FooterLink
              href="/products?category=Beauty"
              label="Beauty"
            />

          </div>
        </div>

        {/* CUSTOMER CARE */}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#F3B183]">
            Customer Care
          </h3>

          <div className="mt-5 flex flex-col gap-1">

            <FooterLink
              href="/account"
              label="My Account"
            />

            <FooterLink
              href="/orders"
              label="My Orders"
            />

            <FooterLink
              href="/wishlist"
              label="Wishlist"
            />

            <FooterLink
              href="/cart"
              label="Shopping Cart"
            />

            <FooterLink
              href="/contact"
              label="Contact Us"
            />

          </div>
        </div>

        {/* CONTACT */}

        <div className="min-w-0">

          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#F3B183]">
            Contact
          </h3>

          <div className="mt-5 space-y-4">

            {/* LOCATION */}

            <div className="flex min-w-0 items-start gap-3">

              <svg
                className="mt-0.5 h-[19px] w-[19px] shrink-0 text-[#E98B50]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                />
              </svg>

              <p className="text-base leading-6 text-white/65">
                Chakwal, Punjab
                <br />
                Pakistan
              </p>

            </div>

            {/* EMAIL */}

            <div className="flex min-w-0 items-start gap-3">

              <svg
                className="mt-0.5 h-[19px] w-[19px] shrink-0 text-[#E98B50]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                />
                <path d="m3 7 9 6 9-6" />
              </svg>

              <a
                href="mailto:hello@cartiva.com"
                className="min-w-0 break-all text-base text-white/65 transition hover:text-[#E98B50]"
              >
                hello@cartiva.com
              </a>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================
          BOTTOM
      ====================================== */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">

          <p className="text-sm leading-5 text-white/45">
            © {new Date().getFullYear()} Cartiva.
            All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end">

            <a
              href="#"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Terms & Conditions
            </a>

          </div>

        </div>
      </div>

    </footer>
  );
}

// =========================================
// FOOTER LINK
// =========================================

function FooterLink({
  href,
  label,
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-10 items-center py-1 text-base text-white/65 transition hover:text-[#E98B50]"
    >
      {label}
    </a>
  );
}