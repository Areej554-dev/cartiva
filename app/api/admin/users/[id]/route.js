import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// GET CUSTOMER DETAILS
// =========================================

export async function GET(request, { params }) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = await params;

    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // ---------------------------------------
    // Get user
    // ---------------------------------------

    const user = await User.findById(id)
      .select(
        "name email isAdmin isActive phone address city postalCode createdAt"
      )
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------
    // Get user's orders
    // ---------------------------------------

    const orders = await Order.find({
      userId: String(id),
    })
      .sort({ createdAt: -1 })
      .lean();

    // ---------------------------------------
    // Calculate statistics
    // ---------------------------------------

    const totalOrders = orders.length;

    const activeOrders = orders.filter(
      (order) =>
        order.status === "Pending" ||
        order.status === "Shipped"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const totalSpent = orders
      .filter(
        (order) => order.status !== "Cancelled"
      )
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

    // ---------------------------------------
    // Return customer details
    // ---------------------------------------

    return NextResponse.json(
      {
        success: true,

        user: {
          _id: String(user._id),

          name:
            typeof user.name === "string"
              ? user.name
              : "",

          email:
            typeof user.email === "string"
              ? user.email
              : "",

          isAdmin: Boolean(user.isAdmin),

          isActive:
            user.isActive !== false,

          phone:
            typeof user.phone === "string"
              ? user.phone
              : "",

          address:
            typeof user.address === "string"
              ? user.address
              : "",

          city:
            typeof user.city === "string"
              ? user.city
              : "",

          postalCode:
            typeof user.postalCode === "string"
              ? user.postalCode
              : "",

          createdAt:
            user.createdAt || null,
        },

        orders,

        statistics: {
          totalOrders,
          activeOrders,
          deliveredOrders,
          cancelledOrders,
          totalSpent,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN GET USER DETAILS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch customer details.",
      },
      { status: 500 }
    );
  }
}