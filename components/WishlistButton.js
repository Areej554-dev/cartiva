"use client";

import { useWishlist } from "@/components/WishlistContext";

function HeartIcon({ filled = false }) {
  return (
    <svg
      className="h-5 w-5"
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

export default function WishlistButton({ product }) {
  const {
    isInWishlist,
    toggleWishlist,
    loading,
  } = useWishlist();

  const productId = String(
    product._id || product.id
  );

  const saved = isInWishlist(productId);

  const handleWishlist = async () => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      alert(
        error.message ||
          "Something went wrong."
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-label={
        saved
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      aria-pressed={saved}
      aria-busy={loading}
      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 sm:h-12 sm:w-12 ${
        saved
          ? "border-[#F3B183] bg-[#FFF1E8] text-[#E98B50]"
          : "border-[#E9DED6] bg-white text-[#756C65] hover:border-[#F3B183] hover:bg-[#FFF9F5] hover:text-[#E98B50]"
      } ${
        loading
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}