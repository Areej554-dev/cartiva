import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// GET ALL USERS
// =========================================

export async function GET() {
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

    await connectDB();

    // ---------------------------------------
    // Get users
    // ---------------------------------------

    const users = await User.find({})
      .select(
        "name email isAdmin isActive phone address city postalCode createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // ---------------------------------------
    // Get order counts
    // ---------------------------------------

    const orderCounts = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const orderCountMap = new Map();

    for (const item of orderCounts) {
      if (item._id) {
        orderCountMap.set(
          String(item._id),
          Number(item.orderCount || 0)
        );
      }
    }

    // ---------------------------------------
    // Format users
    // ---------------------------------------

    const usersWithOrders = users.map((user) => {
      const userId = String(user._id);

      return {
        _id: userId,

        name:
          typeof user.name === "string"
            ? user.name
            : "",

        email:
          typeof user.email === "string"
            ? user.email
            : "",

        isAdmin: Boolean(user.isAdmin),

        // Older accounts without isActive
        // are treated as active.
        isActive: user.isActive !== false,

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

        createdAt: user.createdAt || null,

        orderCount:
          orderCountMap.get(userId) || 0,
      };
    });

    return NextResponse.json(
      {
        success: true,
        users: usersWithOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN GET USERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users.",
      },
      { status: 500 }
    );
  }
}