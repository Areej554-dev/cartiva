"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrder({ orderId }) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?\n\nThe ordered items will be returned to stock."
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            console.log(
                "CANCELLING ORDER:",
                orderId
            );

            const response = await fetch(
                `/api/orders/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            console.log(
                "CANCEL RESPONSE:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to cancel order."
                );
            }

            setSuccess(
                data.message ||
                "Order cancelled and stock restored successfully."
            );

            // Refresh the current order page
            router.refresh();

        } catch (error) {
            console.error(
                "CANCEL ERROR:",
                error
            );

            setError(
                error.message ||
                "Something went wrong while cancelling the order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">

            <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full border border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50"
            >
                {loading
                    ? "Cancelling..."
                    : "Cancel Order"}
            </button>

            {success && (
                <p className="text-green-600 text-sm mt-2">
                    {success}
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}

        </div>
    );
}