import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import OrderStatus from "@/components/OrderStatus";
import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

/* =========================================================
   IMAGE PATH HELPER
========================================================= */

const getOrderImage = (image) => {
    if (!image) return "";

    const value = String(image).trim();

    if (!value) return "";

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return value;
    }

    return `/${value}`;
};

/* =========================================================
   STATUS COLORS
========================================================= */

const getStatusClasses = (status) => {
    switch (status) {
        case "Pending":
            return "bg-[#FFF4D6] text-[#9A6B00] border border-[#F0D88A]";

        case "Shipped":
            return "bg-[#FFF0E7] text-[#C96C35] border border-[#F3B183]";

        case "Delivered":
            return "bg-[#EAF7EF] text-[#2F7D4A] border border-[#B9DFC5]";

        case "Cancelled":
            return "bg-[#FCECEC] text-[#B42318] border border-[#F3C1BE]";

        default:
            return "bg-[#F3EFEC] text-[#756C65] border border-[#E9DED6]";
    }
};

/* =========================================================
   ADMIN ORDERS PAGE
========================================================= */

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions);

    /* =====================================================
       AUTH CHECK
    ===================================================== */

    if (!session?.user?.id) {
        redirect("/login");
    }

    /* =====================================================
       ADMIN CHECK
    ===================================================== */

    if (!session.user.isAdmin) {
        return (
            <main className="min-h-[80vh] flex items-center justify-center px-6 bg-[#FFF9F5]">

                <div className="text-center max-w-md">

                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFF0E7] text-[#E98B50] flex items-center justify-center">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.8"
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m0 3.75h.007M10.29 3.86 2.82 17.2a1.5 1.5 0 0 0 1.31 2.25h15.74a1.5 1.5 0 0 0 1.31-2.25L13.71 3.86a1.5 1.5 0 0 0-2.62 0Z"
                            />
                        </svg>

                    </div>

                    <h1 className="text-4xl font-bold text-[#2D2723] mb-3">
                        Access Denied
                    </h1>

                    <p className="text-[#756C65] mb-7 leading-7">
                        You do not have permission to access the admin dashboard.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#E98B50] text-white font-semibold hover:bg-[#C96C35] transition"
                    >
                        Back to Home
                    </Link>

                </div>

            </main>
        );
    }

    /* =====================================================
       LOAD ORDERS + CURRENT PRODUCTS
    ===================================================== */

    let orders = [];

    try {
        await connectDB();

        orders = await Order.find({})
            .sort({ createdAt: -1 })
            .lean();

        /*
         * Load all products.
         *
         * I intentionally load the current products and create
         * lookup maps using:
         *
         * 1. MongoDB _id
         * 2. Numeric/custom product id
         * 3. Product name
         *
         * This handles both old and new orders.
         */

        const products = await Product.find({}).lean();

        const productByMongoId = new Map();
        const productByCustomId = new Map();
        const productByName = new Map();

        for (const product of products) {

            if (product._id) {
                productByMongoId.set(
                    String(product._id),
                    product
                );
            }

            if (
                product.id !== undefined &&
                product.id !== null
            ) {
                productByCustomId.set(
                    String(product.id),
                    product
                );
            }

            if (product.name) {
                productByName.set(
                    String(product.name).trim().toLowerCase(),
                    product
                );
            }
        }

        /*
         * Replace each order item's image with the CURRENT
         * product image whenever a matching product is found.
         */

        orders = orders.map((order) => {

            const updatedItems = (order.items || []).map(
                (item) => {

                    const productId = String(
                        item.productId || ""
                    ).trim();

                    const itemName = String(
                        item.name || ""
                    )
                        .trim()
                        .toLowerCase();

                    const currentProduct =
                        productByMongoId.get(productId) ||
                        productByCustomId.get(productId) ||
                        productByName.get(itemName);

                    return {
                        ...item,

                        image:
                            currentProduct?.image ||
                            item.image ||
                            "",
                    };
                }
            );

            return {
                ...order,
                items: updatedItems,
            };
        });

    } catch (error) {
        console.error("ADMIN ORDERS ERROR:", error);
    }

    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
    ).length;

    const shippedOrders = orders.filter(
        (order) => order.status === "Shipped"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) => order.status === "Cancelled"
    ).length;

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <main className="min-h-[80vh] bg-[#FFF9F5] text-[#2D2723]">

            <div className="mx-auto w-full max-w-[1500px]">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-10">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E98B50] mb-3">
                        Admin Dashboard
                    </p>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                        <div>

                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                All Orders
                            </h1>

                            <p className="text-[#756C65] mt-3 text-base md:text-lg">
                                Manage and monitor all Cartiva customer orders.
                            </p>

                        </div>

                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 w-fit px-5 py-3 rounded-xl border border-[#E9DED6] bg-white text-[#2D2723] font-medium hover:border-[#E98B50] hover:text-[#C96C35] transition"
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
                                    d="M10.5 6.75 4.5 12l6 5.25M19.5 12h-15"
                                />
                            </svg>

                            Dashboard

                        </Link>

                    </div>

                </div>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

                    <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-[#756C65]">
                            Total Orders
                        </p>

                        <p className="text-4xl font-bold mt-3">
                            {totalOrders}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-[#E98B50]">
                            <span className="w-2 h-2 rounded-full bg-[#E98B50]" />
                            All customer orders
                        </div>

                    </div>

                    <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-[#756C65]">
                            Pending
                        </p>

                        <p className="text-4xl font-bold mt-3">
                            {pendingOrders}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-[#9A6B00]">
                            <span className="w-2 h-2 rounded-full bg-[#D8A928]" />
                            Awaiting processing
                        </div>

                    </div>

                    <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-[#756C65]">
                            Shipped
                        </p>

                        <p className="text-4xl font-bold mt-3">
                            {shippedOrders}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-[#C96C35]">
                            <span className="w-2 h-2 rounded-full bg-[#E98B50]" />
                            On the way
                        </div>

                    </div>

                    <div className="bg-white border border-[#E9DED6] rounded-2xl p-6 shadow-sm">

                        <p className="text-sm font-medium text-[#756C65]">
                            Delivered
                        </p>

                        <p className="text-4xl font-bold mt-3">
                            {deliveredOrders}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm text-[#2F7D4A]">
                            <span className="w-2 h-2 rounded-full bg-[#4FAF6D]" />
                            Completed
                        </div>

                    </div>

                </div>

                {/* =================================================
                    CANCELLED
                ================================================= */}

                {cancelledOrders > 0 && (

                    <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#F3C1BE] bg-[#FCECEC] px-5 py-4">

                        <div>

                            <p className="font-semibold text-[#B42318]">
                                Cancelled Orders
                            </p>

                            <p className="text-sm text-[#8F1D17] mt-1">
                                {cancelledOrders} order
                                {cancelledOrders !== 1 ? "s" : ""}
                                {" "}cancelled.
                            </p>

                        </div>

                        <span className="text-2xl font-bold text-[#B42318]">
                            {cancelledOrders}
                        </span>

                    </div>

                )}

                {/* =================================================
                    NO ORDERS
                ================================================= */}

                {orders.length === 0 ? (

                    <div className="bg-white border border-[#E9DED6] rounded-2xl p-12 text-center shadow-sm">

                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFF0E7] text-[#E98B50] flex items-center justify-center">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 4.5h10.5A2.25 2.25 0 0 1 19.5 6.75v13.5H4.5V6.75A2.25 2.25 0 0 1 6.75 4.5ZM8.25 4.5v-1.5h7.5v1.5M8.25 10.5h7.5M8.25 14.25h4.5"
                                />
                            </svg>

                        </div>

                        <h2 className="text-2xl font-bold mb-2">
                            No Orders Found
                        </h2>

                        <p className="text-[#756C65]">
                            There are currently no orders in Cartiva.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       ORDERS
                    ================================================= */

                    <div className="space-y-6">

                        {orders.map((order) => {

                            const orderId = order._id.toString();

                            return (

                                <div
                                    key={orderId}
                                    className="bg-white border border-[#E9DED6] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                                >

                                    {/* ORDER HEADER */}

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                                        <div className="min-w-0">

                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#756C65]">
                                                Order ID
                                            </p>

                                            <p className="font-semibold text-[#2D2723] break-all mt-1">
                                                {orderId}
                                            </p>

                                        </div>

                                        <span
                                            className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusClasses(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                    {/* CUSTOMER DATA */}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

                                        <div>

                                            <p className="text-sm text-[#756C65]">
                                                Customer
                                            </p>

                                            <p className="font-semibold mt-1">
                                                {order.customer?.firstName || ""}
                                                {" "}
                                                {order.customer?.lastName || ""}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-[#756C65]">
                                                Email
                                            </p>

                                            <p className="font-semibold mt-1 break-all">
                                                {order.customer?.email || "N/A"}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-[#756C65]">
                                                Date
                                            </p>

                                            <p className="font-semibold mt-1">

                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-[#756C65]">
                                                Total
                                            </p>

                                            <p className="font-bold text-lg mt-1 text-[#C96C35]">

                                                $
                                                {Number(
                                                    order.total || 0
                                                ).toFixed(2)}

                                            </p>

                                        </div>

                                    </div>

                                    {/* ORDERED ITEMS */}

                                    <div className="border-t border-[#E9DED6] pt-6">

                                        <p className="font-semibold mb-4">
                                            Ordered Items
                                        </p>

                                        <div className="space-y-4">

                                            {order.items?.slice(0, 3).map(
                                                (item, index) => {

                                                    const imageUrl =
                                                        getOrderImage(
                                                            item.image
                                                        );

                                                    return (

                                                        <div
                                                            key={`${item.productId}-${index}`}
                                                            className="flex items-center gap-4"
                                                        >

                                                            {/* PRODUCT IMAGE */}

                                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-[#FFF9F5] border border-[#E9DED6]">

                                                                {imageUrl ? (

                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={
                                                                            item.name ||
                                                                            "Product"
                                                                        }
                                                                        className="h-full w-full object-contain p-1 bg-white"
                                                                    />

                                                                ) : (

                                                                    <div className="h-full w-full flex items-center justify-center text-xs font-medium text-[#756C65]">
                                                                        No image
                                                                    </div>

                                                                )}

                                                            </div>

                                                            {/* PRODUCT INFO */}

                                                            <div className="flex-1 min-w-0">

                                                                <p className="font-medium truncate">
                                                                    {item.name ||
                                                                        "Unnamed Product"}
                                                                </p>

                                                                <p className="text-sm text-[#756C65] mt-1">
                                                                    Qty:{" "}
                                                                    {Number(
                                                                        item.quantity ||
                                                                        1
                                                                    )}
                                                                </p>

                                                            </div>

                                                            {/* PRICE */}

                                                            <p className="font-semibold whitespace-nowrap">

                                                                $
                                                                {(
                                                                    Number(
                                                                        item.price ||
                                                                        0
                                                                    ) *
                                                                    Number(
                                                                        item.quantity ||
                                                                        1
                                                                    )
                                                                ).toFixed(2)}

                                                            </p>

                                                        </div>

                                                    );
                                                }
                                            )}

                                        </div>

                                        {order.items?.length > 3 && (

                                            <p className="text-sm text-[#756C65] mt-4">

                                                +
                                                {" "}
                                                {order.items.length - 3}
                                                {" "}
                                                more item
                                                {order.items.length - 3 !== 1
                                                    ? "s"
                                                    : ""}

                                            </p>

                                        )}

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="border-t border-[#E9DED6] mt-6 pt-6">

                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                            <OrderStatus
                                                orderId={orderId}
                                                currentStatus={order.status}
                                            />

                                            <Link
                                                href={`/admin/orders/${orderId}`}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E98B50] text-white font-semibold hover:bg-[#C96C35] transition w-full lg:w-fit"
                                            >

                                                View Details

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
                                                        d="M9 5.25 15.75 12 9 18.75"
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

            </div>

        </main>
    );
}