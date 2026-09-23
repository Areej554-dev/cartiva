"use client";

import { useState } from "react";

export default function OrderStatus({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    const newStatus = e.target.value;

    setStatus(newStatus);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status."
        );
      }

      setMessage("Updated successfully.");

      // Refresh server-rendered order data
      window.location.reload();
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      setStatus(currentStatus);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">

      <label className="text-sm font-medium">
        Update Status:
      </label>

      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className="border rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
      >
        <option value="Pending">
          Pending
        </option>

        <option value="Shipped">
          Shipped
        </option>

        <option value="Delivered">
          Delivered
        </option>

        <option value="Cancelled">
          Cancelled
        </option>
      </select>

      {loading && (
        <span className="text-sm text-gray-500">
          Updating...
        </span>
      )}

      {message && !loading && (
        <span className="text-sm text-gray-500">
          {message}
        </span>
      )}

    </div>
  );
}