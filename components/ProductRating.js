"use client";

import { useEffect, useState } from "react";

export default function ProductRating({ productId }) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadRating = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/reviews?productId=${encodeURIComponent(
            String(productId)
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (!cancelled) {
            setAverageRating(0);
            setReviewCount(0);
          }

          return;
        }

        const data = await response.json();

        if (cancelled) return;

        setAverageRating(
          Number(data.averageRating || 0)
        );

        setReviewCount(
          Number(data.reviewCount || 0)
        );
      } catch {
        // Reviews are optional. Never break the product page
        // when the reviews API is unavailable.
        if (!cancelled) {
          setAverageRating(0);
          setReviewCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRating();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return <div className="h-6 mt-2" />;
  }

  const roundedRating = Math.min(
    5,
    Math.max(0, Math.round(averageRating))
  );

  return (
    <div className="flex items-center gap-2 mt-2 min-h-6">
      <div
        className="text-yellow-400 text-lg leading-none tracking-wide"
        aria-label={`Rating ${averageRating.toFixed(1)} out of 5`}
      >
        {"★".repeat(roundedRating)}

        <span className="text-gray-300">
          {"★".repeat(5 - roundedRating)}
        </span>
      </div>

      {reviewCount > 0 ? (
        <span className="text-sm text-gray-600">
          {averageRating.toFixed(1)} ({reviewCount})
        </span>
      ) : (
        <span className="text-sm text-gray-500">
          No reviews
        </span>
      )}
    </div>
  );
}