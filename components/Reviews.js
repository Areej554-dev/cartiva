"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Reviews({ productId }) {
    const { data: session } = useSession();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/reviews?productId=${productId}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load reviews."
                    );
                }

                setReviews(data.reviews || []);
            } catch (error) {
                console.error("LOAD REVIEWS ERROR:", error);

                setError(
                    error.message || "Failed to load reviews."
                );
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [productId]);

    // Submit review
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!session?.user) {
            setError("Please login to write a review.");
            return;
        }

        if (comment.trim().length < 3) {
            setError(
                "Your review must contain at least 3 characters."
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment: comment.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit review."
                );
            }

            setReviews((current) => [
                data.review,
                ...current,
            ]);

            setComment("");
            setRating(5);
            setMessage("Review submitted successfully.");
        } catch (error) {
            console.error("SUBMIT REVIEW ERROR:", error);

            setError(
                error.message || "Failed to submit review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate average rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                (sum, review) =>
                    sum + Number(review.rating || 0),
                0
            ) / reviews.length
            : 0;

    return (
        <section className="mt-16 border-t pt-12">

            {/* Heading */}
            <div className="mb-8">

                <h2 className="text-3xl font-bold">
                    Customer Reviews
                </h2>

                <div className="flex items-center gap-3 mt-3">

                    <div className="text-xl">
                        {averageRating > 0
                            ? "★".repeat(
                                Math.round(averageRating)
                            )
                            : "★★★★★"}
                    </div>

                    <p className="text-gray-500">
                        {reviews.length === 0
                            ? "No reviews yet"
                            : `${averageRating.toFixed(
                                1
                            )} / 5 (${reviews.length} ${reviews.length === 1
                                ? "review"
                                : "reviews"
                            })`}
                    </p>

                </div>

            </div>

            {/* Write Review */}
            {session?.user ? (
                <div className="border rounded-2xl p-6 mb-10">

                    <h3 className="text-2xl font-bold mb-6">
                        Write a Review
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Rating */}
                        <div>

                            <label className="block font-medium mb-2">
                                Your Rating
                            </label>

                            <div className="flex gap-2">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition ${star <= rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                        aria-label={`${star} star`}
                                    >
                                        ★
                                    </button>

                                ))}

                            </div>

                        </div>

                        {/* Comment */}
                        <div>

                            <label
                                htmlFor="comment"
                                className="block font-medium mb-2"
                            >
                                Your Review
                            </label>

                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.target.value)
                                }
                                placeholder="Share your experience with this product..."
                                rows={5}
                                maxLength={500}
                                required
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-black resize-none"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                {comment.length}/500
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg p-3">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {message && (
                            <div className="border border-green-200 bg-green-50 text-green-700 rounded-lg p-3">
                                {message}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>

                    </form>

                </div>
            ) : (
                <div className="border rounded-2xl p-6 mb-10 bg-gray-50">

                    <h3 className="text-xl font-bold">
                        Want to review this product?
                    </h3>

                    <p className="text-gray-500 mt-2 mb-5">
                        Login to share your experience.
                    </p>

                    <a
                        href="/login"
                        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Login
                    </a>

                </div>
            )}

            {/* Reviews List */}
            <div>

                <h3 className="text-2xl font-bold mb-6">
                    Reviews
                </h3>

                {loading ? (
                    <p className="text-gray-500">
                        Loading reviews...
                    </p>
                ) : reviews.length === 0 ? (
                    <div className="border rounded-xl p-8 text-center">
                        <p className="text-gray-500">
                            No reviews yet. Be the first to review
                            this product!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {reviews.map((review) => (

                            <div
                                key={review._id}
                                className="border rounded-xl p-6"
                            >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                    <div>

                                        <div className="flex items-center gap-3 flex-wrap">

                                            <p className="font-bold">
                                                {review.userName}
                                            </p>

                                            {review.verifiedPurchase && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                    ✓ Verified Purchase
                                                </span>
                                            )}

                                        </div>

                                        <div className="text-yellow-400 mt-1">
                                            {"★".repeat(
                                                Number(review.rating)
                                            )}
                                            <span className="text-gray-300">
                                                {"★".repeat(
                                                    5 - Number(review.rating)
                                                )}
                                            </span>
                                        </div>

                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {review.createdAt
                                            ? new Date(
                                                review.createdAt
                                            ).toLocaleDateString()
                                            : ""}
                                    </p>

                                </div>

                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </section>
    );
}