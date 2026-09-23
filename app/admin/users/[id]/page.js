"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDetailsPage({ params }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const { id } = await params;

        const response = await fetch(`/api/admin/users/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load customer."
          );
        }

        setUser(data.user);
        setOrders(data.orders || []);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-[#FFF9F5]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F3B183] border-t-[#E98B50] rounded-full animate-spin mx-auto" />
          <p className="text-[#756C65] mt-4 font-medium">
            Loading customer...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-[#FFF9F5]">
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
            Customer Not Found
          </h2>

          <p className="text-[#756C65] mt-2">
            The requested customer could not be found.
          </p>

          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-xl bg-[#E98B50] text-white font-semibold hover:bg-[#C96C35] transition"
          >
            Back to Customers
          </Link>
        </div>
      </main>
    );
  }

  const totalSpent = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-[#FFF9F5]">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 text-sm text-[#756C65] mb-2">
              <Link
                href="/admin"
                className="hover:text-[#E98B50] transition"
              >
                Dashboard
              </Link>

              <span>/</span>

              <Link
                href="/admin/users"
                className="hover:text-[#E98B50] transition"
              >
                Customers
              </Link>

              <span>/</span>

              <span className="text-[#2D2723]">
                Customer Details
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2723]">
              Customer Details
            </h1>

            <p className="text-[#756C65] mt-2">
              View customer information and order history.
            </p>
          </div>

          <Link
            href="/admin/users"
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

            Back to Customers
          </Link>
        </div>
      </div>

      {/* PROFILE */}
      <section className="bg-white border border-[#E9DED6] rounded-2xl p-6 sm:p-8 shadow-sm mb-8">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

          <div className="flex items-start gap-4">

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F3B183] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2723]">
                {user.name}
              </h2>

              <p className="text-[#756C65] mt-1 break-all">
                {user.email}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-4">

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    user.isAdmin
                      ? "bg-[#2D2723] text-white"
                      : "bg-[#F3B183]/30 text-[#C96C35]"
                  }`}
                >
                  {user.isAdmin ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3 5 6v5c0 4.3 2.9 8.2 7 10 4.1-1.8 7-5.7 7-10V6l-7-3Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                      />
                    </svg>
                  )}

                  {user.isAdmin ? "Admin" : "Customer"}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    user.isActive === false
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {user.isActive === false
                    ? "Deactivated"
                    : "Active"}
                </span>

              </div>
            </div>
          </div>

          <div className="bg-[#FFF9F5] border border-[#E9DED6] rounded-xl px-5 py-4">
            <p className="text-xs uppercase tracking-wide font-semibold text-[#756C65]">
              Joined
            </p>

            <p className="text-[#2D2723] font-bold mt-1">
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>

        </div>

        {/* CONTACT INFO */}
        <div className="border-t border-[#E9DED6] mt-8 pt-8">

          <h3 className="text-lg font-bold text-[#2D2723] mb-5">
            Contact Information
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Phone
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {user.phone || "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                City
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {user.city || "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Postal Code
              </p>

              <p className="font-semibold text-[#2D2723] mt-2">
                {user.postalCode || "Not provided"}
              </p>
            </div>

            <div className="bg-[#FFF9F5] rounded-xl p-4 sm:col-span-2 lg:col-span-3">
              <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                Address
              </p>

              <p className="font-semibold text-[#2D2723] mt-2 break-words">
                {user.address || "Not provided"}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

        {/* ORDERS */}
        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Total Orders
              </p>

              <h3 className="text-3xl font-bold text-[#2D2723] mt-2">
                {orders.length}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-6 h-6"
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

        {/* SPENT */}
        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Total Spent
              </p>

              <h3 className="text-3xl font-bold text-[#2D2723] mt-2">
                ${totalSpent.toFixed(2)}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-6 h-6"
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

        {/* ACTIVE ORDERS */}
        <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#756C65]">
                Active Orders
              </p>

              <h3 className="text-3xl font-bold text-[#2D2723] mt-2">
                {activeOrders}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F3B183]/30 text-[#E98B50] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2"
                />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* ORDER HISTORY */}
      <section className="bg-white border border-[#E9DED6] rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 sm:px-8 py-6 border-b border-[#E9DED6]">
          <h2 className="text-2xl font-bold text-[#2D2723]">
            Order History
          </h2>

          <p className="text-[#756C65] text-sm mt-1">
            All orders placed by this customer.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center">

            <div className="w-14 h-14 rounded-full bg-[#FFF9F5] text-[#E98B50] flex items-center justify-center mx-auto">
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
                  d="M6 7h12l1 13H5L6 7Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V6a3 3 0 0 1 6 0v3"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#2D2723] mt-4">
              No Orders Yet
            </h3>

            <p className="text-[#756C65] mt-1">
              This customer has not placed any orders.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-[#E9DED6]">

            {orders.map((order) => {

              const itemCount = order.items?.reduce(
                (sum, item) =>
                  sum + Number(item.quantity || 0),
                0
              );

              const statusStyles = {
                Pending:
                  "bg-amber-50 text-amber-700",
                Shipped:
                  "bg-[#F3B183]/30 text-[#C96C35]",
                Delivered:
                  "bg-green-50 text-green-700",
                Cancelled:
                  "bg-red-50 text-red-600",
              };

              return (
                <div
                  key={order._id}
                  className="p-5 sm:p-6 hover:bg-[#FFF9F5]/70 transition"
                >

                  <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-5 lg:items-center">

                    {/* ORDER */}
                    <div>
                      <p className="font-bold text-[#2D2723]">
                        Order #
                        {String(order._id).slice(-8)}
                      </p>

                      <p className="text-sm text-[#756C65] mt-1">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                        Items
                      </p>

                      <p className="font-semibold text-[#2D2723] mt-1">
                        {itemCount}
                      </p>
                    </div>

                    {/* TOTAL */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold">
                        Total
                      </p>

                      <p className="font-bold text-[#2D2723] mt-1">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#756C65] font-semibold lg:hidden mb-1">
                        Status
                      </p>

                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* VIEW */}
                    <div>
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E9DED6] text-[#2D2723] font-semibold hover:border-[#E98B50] hover:text-[#E98B50] transition"
                      >
                        View
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9 18 6-6-6-6"
                          />
                        </svg>
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}