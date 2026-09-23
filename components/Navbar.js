"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";

// =========================================
// SVG ICONS
// =========================================

function SearchIcon({ className = "h-5 w-5" }) {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CartIcon({ className = "h-5 w-5" }) {
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
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M3 4h2l2.5 11h10L20 8H6" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }) {
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
      <path d="M20.8 8.8c0 5.5-8.8 10.3-8.8 10.3S3.2 14.3 3.2 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function PackageIcon({ className = "h-5 w-5" }) {
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
      <path d="m21 8-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v6c0 4.8-3.4 8.1-8 9-4.6-.9-8-4.2-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LogOutIcon({ className = "h-5 w-5" }) {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}

function MenuIcon({ className = "h-6 w-6" }) {
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
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function XIcon({ className = "h-6 w-6" }) {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

// =========================================
// NAVBAR
// =========================================

export default function Navbar() {
  const { data: session, status } = useSession();

  const {
    cart,
    cartCount: contextCartCount,
  } = useCart();

  const { wishlist } = useWishlist();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const wishlistCount = wishlist?.length || 0;

  const cartCount =
    typeof contextCartCount === "number"
      ? contextCartCount
      : cart.reduce(
          (total, item) =>
            total + Number(item.quantity || 1),
          0
        );

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMobileMenu();

    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E9DED6] bg-white text-[#2D2723] shadow-sm">

      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* =====================================
            LOGO
        ====================================== */}

        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group shrink-0"
        >
          <span className="text-2xl font-bold tracking-tight text-[#2D2723] sm:text-3xl">
            Cartiva
          </span>

          <span className="mx-auto mt-1 block h-0.5 w-0 rounded-full bg-[#E98B50] transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* =====================================
            DESKTOP NAVIGATION
            Starts at lg instead of md
        ====================================== */}

        <div className="hidden items-center gap-1 lg:flex">
          <NavLink
            href="/"
            active={isActive("/")}
          >
            Home
          </NavLink>

          <NavLink
            href="/products"
            active={isActive("/products")}
          >
            Products
          </NavLink>

          <NavLink
            href="/about"
            active={isActive("/about")}
          >
            About
          </NavLink>

          <NavLink
            href="/contact"
            active={isActive("/contact")}
          >
            Contact
          </NavLink>
        </div>

        {/* =====================================
            DESKTOP RIGHT
        ====================================== */}

        <div className="hidden items-center gap-2 lg:flex">

          <IconLink
            href="/products"
            label="Search products"
          >
            <SearchIcon />
          </IconLink>

          {session?.user && (
            <IconLink
              href="/wishlist"
              label="Wishlist"
              badge={wishlistCount}
            >
              <HeartIcon />
            </IconLink>
          )}

          <IconLink
            href="/cart"
            label="Shopping cart"
            badge={cartCount}
          >
            <CartIcon />
          </IconLink>

          <div className="mx-2 h-7 w-px bg-[#E9DED6]" />

          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-[#FFF1E8]" />
          ) : session?.user ? (
            <div className="flex items-center gap-1">

              {session.user.isAdmin && (
                <TextNavLink
                  href="/admin"
                  active={isActive("/admin")}
                  icon={<ShieldIcon />}
                >
                  Admin
                </TextNavLink>
              )}

              <TextNavLink
                href="/account"
                active={isActive("/account")}
                icon={<UserIcon />}
              >
                Account
              </TextNavLink>

              <TextNavLink
                href="/orders"
                active={isActive("/orders")}
                icon={<PackageIcon />}
              >
                Orders
              </TextNavLink>

              <div className="hidden max-w-28 truncate px-2 text-sm font-medium text-[#756C65] xl:block">
                Hi, {session.user.name}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 flex items-center gap-2 rounded-xl border border-[#E9DED6] px-3 py-2 text-sm font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8] hover:text-[#C96C35]"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-[#2D2723] transition hover:bg-[#FFF1E8] hover:text-[#C96C35]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-[#E98B50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#C96C35]"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

        {/* =====================================
            MOBILE / TABLET ACTIONS
            Visible below lg
        ====================================== */}

        <div className="flex items-center gap-1 lg:hidden">

          <IconLink
            href="/cart"
            label="Shopping cart"
            badge={cartCount}
            onClick={closeMobileMenu}
          >
            <CartIcon />
          </IconLink>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E9DED6] text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8] hover:text-[#C96C35]"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <XIcon />
            ) : (
              <MenuIcon />
            )}
          </button>

        </div>
      </div>

      {/* =====================================
          MOBILE / TABLET NAVIGATION
      ====================================== */}

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-[#E9DED6] bg-white transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[calc(100vh-72px)] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 pb-6 pt-3">

          {/* Main Links */}

          <div className="space-y-1">

            <MobileNavLink
              href="/"
              active={isActive("/")}
              onClick={closeMobileMenu}
            >
              Home
            </MobileNavLink>

            <MobileNavLink
              href="/products"
              active={isActive("/products")}
              onClick={closeMobileMenu}
              icon={<SearchIcon />}
            >
              Products
            </MobileNavLink>

            <MobileNavLink
              href="/about"
              active={isActive("/about")}
              onClick={closeMobileMenu}
            >
              About
            </MobileNavLink>

            <MobileNavLink
              href="/contact"
              active={isActive("/contact")}
              onClick={closeMobileMenu}
            >
              Contact
            </MobileNavLink>

          </div>

          {/* Shopping */}

          <div className="mt-5 border-t border-[#E9DED6] pt-4">

            <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#E98B50]">
              Shopping
            </p>

            <MobileNavLink
              href="/products"
              onClick={closeMobileMenu}
              icon={<SearchIcon />}
            >
              Search Products
            </MobileNavLink>

            {session?.user && (
              <MobileNavLink
                href="/wishlist"
                onClick={closeMobileMenu}
                icon={<HeartIcon />}
                badge={wishlistCount}
              >
                Wishlist
              </MobileNavLink>
            )}

            <MobileNavLink
              href="/cart"
              onClick={closeMobileMenu}
              icon={<CartIcon />}
              badge={cartCount}
            >
              Cart
            </MobileNavLink>

          </div>

          {/* Account */}

          <div className="mt-5 border-t border-[#E9DED6] pt-4">

            <p className="mb-2 px-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#E98B50]">
              Account
            </p>

            {session?.user ? (
              <>
                <div className="mb-2 rounded-xl bg-[#FFF9F5] px-4 py-3">

                  <p className="text-sm text-[#E98B50]">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-base font-semibold text-[#2D2723]">
                    {session.user.name}
                  </p>

                  <p className="mt-0.5 truncate text-sm text-[#756C65]">
                    {session.user.email}
                  </p>

                </div>

                {session.user.isAdmin && (
                  <MobileNavLink
                    href="/admin"
                    active={isActive("/admin")}
                    onClick={closeMobileMenu}
                    icon={<ShieldIcon />}
                  >
                    Admin Dashboard
                  </MobileNavLink>
                )}

                <MobileNavLink
                  href="/account"
                  active={isActive("/account")}
                  onClick={closeMobileMenu}
                  icon={<UserIcon />}
                >
                  Account
                </MobileNavLink>

                <MobileNavLink
                  href="/orders"
                  active={isActive("/orders")}
                  onClick={closeMobileMenu}
                  icon={<PackageIcon />}
                >
                  Orders
                </MobileNavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[#E9DED6] px-4 py-3 text-base font-medium text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8] hover:text-[#C96C35]"
                >
                  <LogOutIcon className="h-5 w-5 text-[#E98B50]" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">

                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-[#E9DED6] px-4 py-3 text-center text-base font-medium text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF1E8]"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-[#E98B50] px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-[#C96C35]"
                >
                  Sign Up
                </Link>

              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

// =========================================
// DESKTOP NAV LINK
// =========================================

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`relative rounded-xl px-3 py-2 text-base font-medium transition xl:px-4 ${
        active
          ? "bg-[#FFF1E8] text-[#C96C35]"
          : "text-[#2D2723] hover:bg-[#FFF9F5] hover:text-[#E98B50]"
      }`}
    >
      {children}

      {active && (
        <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#E98B50]" />
      )}
    </Link>
  );
}

// =========================================
// DESKTOP TEXT LINK
// =========================================

function TextNavLink({
  href,
  active,
  children,
  icon,
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition xl:px-3 xl:text-base ${
        active
          ? "bg-[#FFF1E8] text-[#C96C35]"
          : "text-[#2D2723] hover:bg-[#FFF9F5] hover:text-[#E98B50]"
      }`}
    >
      <span className="h-4 w-4">{icon}</span>
      {children}
    </Link>
  );
}

// =========================================
// DESKTOP ICON LINK
// =========================================

function IconLink({
  href,
  label,
  badge = 0,
  children,
  onClick,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#2D2723] transition hover:bg-[#FFF1E8] hover:text-[#E98B50]"
    >
      {children}

      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#E98B50] px-1 text-xs font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

// =========================================
// MOBILE NAV LINK
// =========================================

function MobileNavLink({
  href,
  active = false,
  onClick,
  children,
  icon,
  badge = 0,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base transition ${
        active
          ? "bg-[#FFF1E8] text-[#C96C35]"
          : "text-[#2D2723] hover:bg-[#FFF9F5] hover:text-[#E98B50]"
      }`}
    >
      <span className="flex items-center gap-3">
        {icon && (
          <span className="text-[#E98B50]">
            {icon}
          </span>
        )}

        {children}
      </span>

      {badge > 0 && (
        <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#E98B50] px-1 text-xs font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}