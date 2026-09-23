import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    // -----------------------------------------
    // PRODUCT / ORDER COUNTS
    // -----------------------------------------

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const pendingOrders =
      await Order.countDocuments({
        status: "Pending",
      });

    const shippedOrders =
      await Order.countDocuments({
        status: "Shipped",
      });

    const deliveredOrders =
      await Order.countDocuments({
        status: "Delivered",
      });

    const cancelledOrders =
      await Order.countDocuments({
        status: "Cancelled",
      });

    // -----------------------------------------
    // LOW STOCK PRODUCTS
    // -----------------------------------------

    const lowStockProducts =
      await Product.find({
        stock: { $lte: 5 },
      })
        .sort({ stock: 1 })
        .limit(10)
        .lean();

    // -----------------------------------------
    // REVENUE
    // -----------------------------------------

    const revenueResult =
      await Order.aggregate([
        {
          $group: {
            _id: "$status",
            revenue: {
              $sum: "$total",
            },
          },
        },
      ]);

    let totalRevenue = 0;
    let cancelledRevenue = 0;

    revenueResult.forEach((item) => {
      const revenue = Number(item.revenue || 0);

      if (item._id === "Cancelled") {
        cancelledRevenue += revenue;
      } else {
        totalRevenue += revenue;
      }
    });

    // -----------------------------------------
    // ORDER STATUS ANALYTICS
    // -----------------------------------------

    const orderStatus = {
      Pending: pendingOrders,
      Shipped: shippedOrders,
      Delivered: deliveredOrders,
      Cancelled: cancelledOrders,
    };

    // -----------------------------------------
    // RECENT ORDERS
    // -----------------------------------------

    const recentOrders =
      await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return NextResponse.json(
      {
        success: true,

        stats: {
          totalProducts,
          totalOrders,
          totalRevenue,
          cancelledRevenue,
          pendingOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          lowStockProducts:
            lowStockProducts.length,
        },

        orderStatus,

        lowStockProducts,

        recentOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard.",
      },
      { status: 500 }
    );
  }
}