"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orderId, setOrderId] = useState("");

  // --------------------------------------------------
  // FETCH ORDER + PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { id } = await params;

        setOrderId(id);

        const [orderResponse, productsResponse] =
          await Promise.all([
            fetch(`/api/admin/orders/${id}`, {
              cache: "no-store",
            }),
            fetch(`/api/products`, {
              cache: "no-store",
            }),
          ]);

        const orderData = await orderResponse.json();
        const productsData = await productsResponse.json();

        if (!orderResponse.ok) {
          throw new Error(
            orderData.message || "Failed to load order."
          );
        }

        setOrder(orderData.order);

        const productList = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        setProducts(productList);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params]);

  // --------------------------------------------------
  // GET CURRENT PRODUCT IMAGE
  // --------------------------------------------------

  const getProductImage = (item) => {
    const product = products.find(
      (product) =>
        String(product._id) === String(item.productId) ||
        String(product.id) === String(item.productId) ||
        product.name?.trim().toLowerCase() ===
          item.name?.trim().toLowerCase()
    );

    return product?.image || item.image || "";
  };

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const updateStatus = async (status) => {
    if (!order || updating) return;

    if (order.status === "Cancelled") {
      alert("A cancelled order cannot be reopened.");
      return;
    }

    if (order.status === status) return;

    if (status === "Cancelled") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? Stock will be restored."
      );

      if (!confirmed) return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setOrder(data.order);

      alert(`Order status changed to ${status}.`);
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F3B183] border-t-[#E98B50] rounded-full animate-spin mx-auto" />

          <p className="text-[#756C65] mt-4 font-medium">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ORDER NOT FOUND
  // --------------------------------------------------

  if (!order) {
    return (
      <main className="min-h-screen bg-[#FFF9F5] flex items-center justify-center px-6">
        <div className="bg-white border border-[#E9DED6] rounded-2xl p-8 text-center max-w-md w-full shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.5M12 16h.01M10.3 3.7 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3l-7.5-13.3a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#2D2723] mt-4">
            Order Not Found
          </h2>

          <p className="text-[#756C65] mt-2">
            The requested order could not be found.
          </p>

          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[#E98B50] text-white font-semibold hover:bg-[#C96C35] transition"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18 9 12l6-6"
              />
            </svg>

            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // VALUES
  // --------------------------------------------------

  const itemCount =
    order.items?.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    ) || 0;

  const statusClasses = {
    Pending: "bg-amber-50 text-amber-700",
    Shipped: "bg-[#F3B183]/30 text-[#C96C35]",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-600",
  };

  const statusButtons = [
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <main className="min-h-screen bg-[#FFF9F5]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#756C65] mb-2">
              <Link
                href="/admin"
                className="hover:text-[#E98B50] transition"
              >
                Dashboard
              </Link>

              <span>/</span>

              <Link
                href="/admin/orders"
                className="hover:text-[#E98B50] transition"
              >
                Orders
              </Link>

              <span>/</span>

              <span className="text-[#2D2723]">
                Order Details
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2723]">
              Order Details
            </h1>

            <p className="text-[#756C65] mt-2">
              Order #{String(order._id).slice(-8)}
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#E9DED6] text-[#2D2723] font-semibold hover:border-[#E98B50] hover:text-[#E98B50] transition shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18 9 12l6-6"
              />
            </svg>

            Back to Orders
          </Link>
        </div>
      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        {/* STATUS */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Status
              </p>

              <span
                className={`inline-flex mt-3 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  statusClasses[order.status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7v5l3 2"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* ITEMS */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Items
              </p>

              <h2 className="text-3xl font-bold text-[#2D2723] mt-2">
                {itemCount}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12l1 13H5L6 7Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V6a3 3 0 0 1 6 0v3"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* TOTAL */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Total
              </p>

              <h2 className="text-3xl font-bold text-[#2D2723] mt-2">
                ${Number(order.total || 0).toFixed(2)}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 18h10M8 14h8M9 10h6M6 21h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V8a3 3 0 0 0-6 0v2H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2Z"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* DATE */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Order Date
              </p>

              <p className="font-bold text-[#2D2723] mt-3">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="2"
                />

                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>

          </div>
        </div>

      </section>

      {/* ==================================================
          UPDATE STATUS
      ================================================== */}

      <section className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-xl font-bold text-[#2D2723]">
              Update Order Status
            </h2>

            <p className="text-sm text-[#756C65] mt-1">
              Change the current order status.
            </p>
          </div>

          {order.status === "Cancelled" && (
            <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              Cancelled orders cannot be reopened.
            </span>
          )}

        </div>

        <div className="flex flex-wrap gap-3">

          {statusButtons.map((status) => {
            const isCurrent =
              order.status === status;

            const disabled =
              updating ||
              isCurrent ||
              order.status === "Cancelled";

            return (
              <button
                key={status}
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateStatus(status)
                }
                className={`px-5 py-2.5 rounded-xl border font-semibold transition ${
                  isCurrent
                    ? "bg-[#E98B50] text-white border-[#E98B50]"
                    : status === "Cancelled"
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-[#E9DED6] text-[#2D2723] hover:border-[#E98B50] hover:text-[#E98B50] hover:bg-[#FFF9F5]"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {updating && !isCurrent
                  ? "Updating..."
                  : status}
              </button>
            );
          })}

        </div>
      </section>

      {/* ==================================================
          CUSTOMER + SHIPPING
      ================================================== */}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        {/* CUSTOMER */}

        <section className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold text-[#2D2723] mb-6">
            Customer Information
          </h2>

          <div className="space-y-5">

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Name
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {order.customer?.firstName ||
                order.customer?.lastName
                  ? `${order.customer?.firstName || ""} ${
                      order.customer?.lastName || ""
                    }`.trim()
                  : "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Email
              </p>

              <p className="font-semibold text-[#2D2723] mt-2 break-all">
                {order.customer?.email ||
                  "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Phone
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {order.customer?.phone ||
                  "Not provided"}
              </p>
            </div>

          </div>
        </section>

        {/* SHIPPING */}

        <section className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold text-[#2D2723] mb-6">
            Shipping Address
          </h2>

          <div className="space-y-5">

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Address
              </p>

              <p className="font-semibold text-[#2D2723] mt-2 break-words">
                {order.shippingAddress?.address ||
                  "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                City
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {order.shippingAddress?.city ||
                  "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Postal Code
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {order.shippingAddress?.postalCode ||
                  "Not provided"}
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <section className="bg-white border border-[#E9DED6] rounded-2xl shadow-sm overflow-hidden mb-8">

        <div className="px-6 sm:px-8 py-6 border-b border-[#E9DED6]">
          <h2 className="text-xl font-bold text-[#2D2723]">
            Ordered Products
          </h2>

          <p className="text-sm text-[#756C65] mt-1">
            Products included in this order.
          </p>
        </div>

        <div className="divide-y divide-[#E9DED6]">

          {order.items?.map((item, index) => {
            const productImage =
              getProductImage(item);

            return (
              <div
                key={`${item.productId}-${index}`}
                className="p-5 sm:p-6 hover:bg-[#FFF9F5]/60 transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                  {/* IMAGE */}

                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-[#E9DED6] bg-[#FFF9F5] flex items-center justify-center overflow-hidden shrink-0">

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={item.name || "Product"}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center px-2">

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-7 h-7 mx-auto text-[#C9BDB5]"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="16"
                            rx="2"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m7 16 3-3 2 2 3-4 3 5"
                          />
                        </svg>

                        <span className="block text-xs text-[#756C65] mt-1">
                          No image
                        </span>

                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1 min-w-0">

                    <h3 className="text-lg font-bold text-[#2D2723]">
                      {item.name}
                    </h3>

                    <p className="text-sm text-[#756C65] mt-1 break-all">
                      Product ID: {item.productId}
                    </p>

                  </div>

                  {/* PRODUCT VALUES */}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-5 lg:gap-8">

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                        Quantity
                      </p>

                      <p className="font-semibold text-[#2D2723] mt-1">
                        {item.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                        Price
                      </p>

                      <p className="font-semibold text-[#2D2723] mt-1">
                        ${Number(
                          item.price || 0
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                        Total
                      </p>

                      <p className="font-bold text-[#2D2723] mt-1">
                        $
                        {(
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.quantity || 0
                          )
                        ).toFixed(2)}
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ==================================================
          PAYMENT + ORDER SUMMARY
      ================================================== */}

      <section className="grid lg:grid-cols-2 gap-8 pb-4">

        {/* PAYMENT */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold text-[#2D2723] mb-6">
            Payment Information
          </h2>

          <div className="bg-[#FFF9F5] rounded-xl p-4">

            <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
              Payment Method
            </p>

            <p className="font-semibold text-[#2D2723] mt-2">
              {order.paymentMethod ||
                "Cash on Delivery"}
            </p>

          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold text-[#2D2723] mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#756C65]">
                Subtotal
              </span>

              <span className="font-semibold text-[#2D2723]">
                ${Number(
                  order.subtotal || 0
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-[#756C65]">
                Shipping
              </span>

              <span className="font-semibold text-[#2D2723]">
                ${Number(
                  order.shipping || 0
                ).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-[#E9DED6] pt-4 flex items-center justify-between gap-4">

              <span className="font-bold text-[#2D2723]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#E98B50]">
                ${Number(
                  order.total || 0
                ).toFixed(2)}
              </span>

            </div>

          </div>
        </div>

      </section>
    </main>
  );
}