"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COLORS = {
    orange: "#E98B50",
    darkOrange: "#C96C35",
    lightOrange: "#FFF0E7",
    cream: "#FFF9F5",
    text: "#2D2723",
    muted: "#756C65",
    border: "#E9DED6",
    white: "#FFFFFF",
};

const StatIcon = ({ type }) => {
    const icons = {
        products: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m7.5 4.5 4.5-2 4.5 2m-9 0v5l4.5 2 4.5-2v-5M5.25 9.75 3 11v8l9 3 9-3v-8l-2.25-1.25M12 12v10"
                />
            </svg>
        ),

        orders: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v13.5H4.5V6.75A2.25 2.25 0 0 1 6.75 4.5ZM8.25 4.5v-1.5h7.5v1.5M8.25 10.5h7.5M8.25 14.25h4.5"
                />
            </svg>
        ),

        revenue: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v18m4.5-13.5c-.75-1-2-1.5-4-1.5-2.25 0-4 1.1-4 2.75 0 4.25 8 2.25 8 6.5 0 1.8-1.75 3.25-4 3.25-2 0-3.5-.5-4.5-1.75"
                />
            </svg>
        ),

        pending: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        ),

        stock: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12 3 8.25 4.5v9L12 21l-8.25-4.5v-9L12 3Zm0 0v9m8.25-4.5L12 12 3.75 7.5"
                />
            </svg>
        ),

        message: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25c0 4.556-4.03 8.25-9 8.25-1.12 0-2.19-.18-3.17-.52L4.5 20.25l1.19-3.57A7.87 7.87 0 0 1 3 11.25C3 6.694 7.03 3 12 3s9 3.694 9 8.25Z"
                />
            </svg>
        ),
    };

    return icons[type] || icons.products;
};

const ActionIcon = ({ type }) => {
    const icons = {
        products: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m7.5 4.5 4.5-2 4.5 2m-9 0v5l4.5 2 4.5-2v-5M5.25 9.75 3 11v8l9 3 9-3v-8l-2.25-1.25M12 12v10"
                />
            </svg>
        ),

        orders: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v13.5H4.5V6.75A2.25 2.25 0 0 1 6.75 4.5ZM8.25 4.5v-1.5h7.5v1.5M8.25 10.5h7.5M8.25 14.25h4.5"
                />
            </svg>
        ),

        customers: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 8.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0M18 8.25h3M19.5 6.75v3"
                />
            </svg>
        ),

        messages: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25c0 4.556-4.03 8.25-9 8.25-1.12 0-2.19-.18-3.17-.52L4.5 20.25l1.19-3.57A7.87 7.87 0 0 1 3 11.25C3 6.694 7.03 3 12 3s9 3.694 9 8.25Z"
                />
            </svg>
        ),

        store: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9.75h16.5M5.25 9.75v9.75h13.5V9.75M4.5 9.75l1.5-5.25h12L19.5 9.75M9 14.25h6"
                />
            </svg>
        ),
    };

    return icons[type] || icons.store;
};

const statusClasses = {
    Pending: "bg-[#FFF4D6] text-[#9A6B00]",
    Shipped: "bg-[#FFF0E7] text-[#C96C35]",
    Delivered: "bg-[#EAF7EF] text-[#2F7D4A]",
    Cancelled: "bg-[#FCECEC] text-[#B42318]",
};

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessages, setNewMessages] = useState(0);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/admin/dashboard", {
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load dashboard."
                );
            }

            setData(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/admin/contact", {
                cache: "no-store",
            });

            if (!response.ok) return;

            const result = await response.json();

            if (Array.isArray(result)) {
                setNewMessages(
                    result.filter(
                        (message) => message.status === "New"
                    ).length
                );
            }
        } catch (error) {
            console.error("Failed to load contact messages:", error);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <main className="min-h-[80vh] bg-[#FFF9F5] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1500px]">
                    <div className="h-10 w-64 rounded-xl bg-white animate-pulse" />
                    <div className="mt-3 h-5 w-96 max-w-full rounded-lg bg-white animate-pulse" />

                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-36 rounded-2xl bg-white border border-[#E9DED6] animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="min-h-[80vh] flex items-center justify-center bg-[#FFF9F5] px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#2D2723]">
                        Failed to load dashboard
                    </h1>

                    <button
                        onClick={fetchDashboard}
                        className="mt-5 rounded-xl bg-[#E98B50] px-6 py-3 font-semibold text-white hover:bg-[#C96C35] transition"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    const {
        totalProducts,
        totalOrders,
        totalRevenue,
        cancelledRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts,
    } = data.stats;

    const recentOrders = data.recentOrders || [];

    return (
        <main className="min-h-[80vh] bg-[#FFF9F5] text-[#2D2723] px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1500px]">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <section className="mb-10">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E98B50]">
                                Admin Dashboard
                            </p>

                            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                                Welcome back, Admin
                            </h1>

                            <p className="mt-3 text-[#756C65] text-base sm:text-lg">
                                Here's what's happening in your Cartiva store.
                            </p>

                        </div>

                        <button
                            onClick={() => {
                                fetchDashboard();
                                fetchMessages();
                            }}
                            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9DED6] bg-white px-5 py-3 font-semibold text-[#2D2723] hover:border-[#E98B50] hover:text-[#C96C35] transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12a7.5 7.5 0 0 1 12.98-5.12M19.5 12a7.5 7.5 0 0 1-12.98 5.12M17.25 6.75h.01v.01h-.01v-.01ZM6.75 17.25h.01v.01h-.01v-.01Z"
                                />
                            </svg>

                            Refresh
                        </button>

                    </div>

                </section>

                {/* =====================================================
                    STAT CARDS
                ===================================================== */}

                <section className="mb-12">

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">

                        {/* Products */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        Products
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {totalProducts}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <StatIcon type="products" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Products in your catalog
                            </p>

                        </div>

                        {/* Orders */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        Orders
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {totalOrders}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <StatIcon type="orders" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Total customer orders
                            </p>

                        </div>

                        {/* Revenue */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        Revenue
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        ${Number(totalRevenue).toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <StatIcon type="revenue" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Excluding cancelled orders
                            </p>

                        </div>

                        {/* Pending */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        Pending Orders
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {pendingOrders}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4D6] text-[#9A6B00]">
                                    <StatIcon type="pending" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Waiting for processing
                            </p>

                        </div>

                        {/* Low Stock */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        Low Stock
                                    </p>

                                    <p
                                        className={`mt-2 text-3xl font-bold ${
                                            lowStockProducts > 0
                                                ? "text-[#B42318]"
                                                : "text-[#2F7D4A]"
                                        }`}
                                    >
                                        {lowStockProducts}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <StatIcon type="stock" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Products needing attention
                            </p>

                        </div>

                        {/* Messages */}
                        <Link
                            href="/admin/contact"
                            className="rounded-2xl border border-[#F3B183] bg-white p-5 shadow-sm hover:shadow-md transition"
                        >

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-[#756C65]">
                                        New Messages
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-[#E98B50]">
                                        {newMessages}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <StatIcon type="message" />
                                </div>

                            </div>

                            <p className="mt-4 text-xs text-[#756C65]">
                                Customer messages waiting
                            </p>

                        </Link>

                    </div>

                </section>

                {/* =====================================================
                    QUICK ACTIONS
                ===================================================== */}

                <section className="mb-12">

                    <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E98B50]">
                            Management
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            Quick Actions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

                        {[
                            {
                                title: "Manage Products",
                                description:
                                    "Add, edit, delete products and manage stock.",
                                href: "/admin/products",
                                icon: "products",
                            },
                            {
                                title: "Manage Orders",
                                description:
                                    "View orders and update their status.",
                                href: "/admin/orders",
                                icon: "orders",
                            },
                            {
                                title: "Manage Customers",
                                description:
                                    "View registered customers and their activity.",
                                href: "/admin/users",
                                icon: "customers",
                            },
                            {
                                title: "Contact Messages",
                                description:
                                    newMessages > 0
                                        ? `${newMessages} new message${
                                              newMessages !== 1 ? "s" : ""
                                          } waiting.`
                                        : "View customer messages and replies.",
                                href: "/admin/contact",
                                icon: "messages",
                                badge: newMessages,
                            },
                            {
                                title: "View Store",
                                description:
                                    "Open the customer-facing Cartiva store.",
                                href: "/products",
                                icon: "store",
                            },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group relative rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >

                                {action.badge > 0 && (
                                    <span className="absolute right-5 top-5 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#E98B50] px-2 text-xs font-bold text-white">
                                        {action.badge > 99 ? "99+" : action.badge}
                                    </span>
                                )}

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0E7] text-[#E98B50]">
                                    <ActionIcon type={action.icon} />
                                </div>

                                <h3 className="mt-5 font-bold text-lg group-hover:text-[#C96C35] transition">
                                    {action.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#756C65]">
                                    {action.description}
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C96C35]">
                                    Open

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        stroke="currentColor"
                                        className="w-4 h-4 transition group-hover:translate-x-1"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.25 12h13.5M13.5 6.75 18.75 12l-5.25 5.25"
                                        />
                                    </svg>
                                </div>

                            </Link>
                        ))}

                    </div>

                </section>

                {/* =====================================================
                    SALES ANALYTICS
                ===================================================== */}

                <section className="mb-12">

                    <div className="mb-6">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E98B50]">
                            Performance
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            Sales Analytics
                        </h2>

                        <p className="mt-2 text-sm text-[#756C65]">
                            Overview of your store's sales and order activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* Revenue */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                            <p className="text-sm text-[#756C65]">
                                Total Revenue
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                ${Number(totalRevenue).toFixed(2)}
                            </p>

                            <p className="mt-2 text-xs text-[#756C65]">
                                Excludes cancelled orders
                            </p>

                        </div>

                        {/* Cancelled */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                            <p className="text-sm text-[#756C65]">
                                Cancelled Order Value
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                ${Number(cancelledRevenue).toFixed(2)}
                            </p>

                            <p className="mt-2 text-xs text-[#B42318]">
                                Cancelled orders
                            </p>

                        </div>

                        {/* Active */}
                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                            <p className="text-sm text-[#756C65]">
                                Active Orders
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {pendingOrders + shippedOrders}
                            </p>

                            <p className="mt-2 text-xs text-[#756C65]">
                                Pending + Shipped
                            </p>

                        </div>

                    </div>

                    {/* ORDER STATUS */}
                    <div className="mt-5 rounded-2xl border border-[#E9DED6] bg-white p-6 shadow-sm">

                        <h3 className="text-xl font-bold">
                            Orders by Status
                        </h3>

                        <div className="mt-6 space-y-5">

                            {[
                                {
                                    name: "Pending",
                                    count: pendingOrders,
                                    background: "#FFF4D6",
                                    bar: "#D8A928",
                                },
                                {
                                    name: "Shipped",
                                    count: shippedOrders,
                                    background: "#FFF0E7",
                                    bar: "#E98B50",
                                },
                                {
                                    name: "Delivered",
                                    count: deliveredOrders,
                                    background: "#EAF7EF",
                                    bar: "#4FAF6D",
                                },
                                {
                                    name: "Cancelled",
                                    count: cancelledOrders,
                                    background: "#FCECEC",
                                    bar: "#D66A63",
                                },
                            ].map((item) => {

                                const percentage =
                                    totalOrders > 0
                                        ? (item.count / totalOrders) * 100
                                        : 0;

                                return (
                                    <div key={item.name}>

                                        <div className="mb-2 flex items-center justify-between">

                                            <span className="font-semibold">
                                                {item.name}
                                            </span>

                                            <span className="text-sm text-[#756C65]">
                                                {item.count}
                                            </span>

                                        </div>

                                        <div
                                            className="h-3 w-full overflow-hidden rounded-full"
                                            style={{
                                                backgroundColor:
                                                    item.background,
                                            }}
                                        >
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: item.bar,
                                                }}
                                            />
                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    RECENT ORDERS
                ===================================================== */}

                <section className="mb-10">

                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E98B50]">
                                Latest activity
                            </p>

                            <h2 className="mt-1 text-2xl font-bold">
                                Recent Orders
                            </h2>

                        </div>

                        <Link
                            href="/admin/orders"
                            className="text-sm font-semibold text-[#C96C35] hover:text-[#E98B50] transition"
                        >
                            View all
                        </Link>

                    </div>

                    {recentOrders.length === 0 ? (

                        <div className="rounded-2xl border border-[#E9DED6] bg-white p-10 text-center">

                            <p className="font-semibold">
                                No orders yet.
                            </p>

                            <p className="mt-2 text-sm text-[#756C65]">
                                New customer orders will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-hidden rounded-2xl border border-[#E9DED6] bg-white shadow-sm">

                            {recentOrders.map((order, index) => {

                                const status =
                                    statusClasses[order.status] ||
                                    "bg-[#F3EFEC] text-[#756C65]";

                                return (
                                    <div
                                        key={order._id}
                                        className={`flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between ${
                                            index !== recentOrders.length - 1
                                                ? "border-b border-[#E9DED6]"
                                                : ""
                                        }`}
                                    >

                                        <div className="min-w-0">

                                            <p className="font-bold">
                                                Order #
                                                {String(order._id).slice(-8)}
                                            </p>

                                            <p className="mt-1 text-sm text-[#756C65]">
                                                {order.customer?.firstName}{" "}
                                                {order.customer?.lastName}
                                            </p>

                                        </div>

                                        <div className="flex flex-wrap items-center gap-5">

                                            <div>

                                                <p className="text-xs text-[#756C65]">
                                                    Total
                                                </p>

                                                <p className="font-bold">
                                                    $
                                                    {Number(
                                                        order.total || 0
                                                    ).toFixed(2)}
                                                </p>

                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status}`}
                                            >
                                                {order.status}
                                            </span>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}