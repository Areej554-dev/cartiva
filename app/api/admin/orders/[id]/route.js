import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// VALIDATE ORDER ID
// =========================================

function isValidOrderId(id) {
  return (
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id)
  );
}

// =========================================
// GET SINGLE ADMIN ORDER
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

    if (!isValidOrderId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET ADMIN ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// UPDATE ORDER STATUS
// =========================================

export async function PATCH(request, { params }) {
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

    if (!isValidOrderId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Parse request body
    // ---------------------------------------

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    const { status } = body;

    const allowedStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // ---------------------------------------
    // Find order
    // ---------------------------------------

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    const oldStatus = order.status;

    if (oldStatus === status) {
      return NextResponse.json(
        {
          success: true,
          message:
            "Order status is already set to this value.",
          order,
        },
        { status: 200 }
      );
    }

    // ---------------------------------------
    // Prevent reopening cancelled orders
    // ---------------------------------------

    if (
      oldStatus === "Cancelled" &&
      status !== "Cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cancelled orders cannot be moved back to another status.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // CANCEL + RESTORE STOCK
    // ---------------------------------------

    if (
      status === "Cancelled" &&
      oldStatus !== "Cancelled"
    ) {
      if (order.stockRestored !== true) {
        const restoredProducts = [];

        try {
          for (const item of order.items || []) {
            const productId =
              String(item.productId || "").trim();

            const quantity = Number(
              item.quantity || 0
            );

            if (quantity <= 0) {
              continue;
            }

            let product = null;

            // -----------------------------------
            // MongoDB ObjectId
            // -----------------------------------

            if (
              mongoose.Types.ObjectId.isValid(
                productId
              )
            ) {
              product =
                await Product.findById(
                  productId
                );
            }

            // -----------------------------------
            // Legacy numeric ID
            // -----------------------------------

            if (!product) {
              const numericId =
                Number(productId);

              if (
                Number.isFinite(numericId)
              ) {
                product =
                  await Product.findOne({
                    id: numericId,
                  });
              }
            }

            // -----------------------------------
            // Name fallback
            // -----------------------------------

            if (!product && item.name) {
              product =
                await Product.findOne({
                  name: String(
                    item.name
                  ).trim(),
                });
            }

            if (!product) {
              throw new Error(
                `Could not find product "${item.name || productId}" to restore stock.`
              );
            }

            const currentStock =
              Number(product.stock || 0);

            product.stock =
              currentStock + quantity;

            await product.save();

            restoredProducts.push({
              productId: product._id,
              quantity,
            });

            console.log(
              `STOCK RESTORED: ${product.name} | ${currentStock} → ${product.stock}`
            );
          }

          // Mark only after every item succeeded
          order.stockRestored = true;
        } catch (restoreError) {
          console.error(
            "STOCK RESTORATION ERROR:",
            restoreError
          );

          // -----------------------------------
          // Roll back already-restored products
          // -----------------------------------

          for (
            const restored of restoredProducts
          ) {
            try {
              await Product.findByIdAndUpdate(
                restored.productId,
                {
                  $inc: {
                    stock: -restored.quantity,
                  },
                }
              );
            } catch (rollbackError) {
              console.error(
                "STOCK ROLLBACK ERROR:",
                rollbackError
              );
            }
          }

          throw restoreError;
        }
      }
    }

    // ---------------------------------------
    // Update order status
    // ---------------------------------------

    order.status = status;

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message:
          status === "Cancelled"
            ? "Order cancelled and stock restored successfully."
            : "Order status updated successfully.",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update order status.",
      },
      { status: 500 }
    );
  }
}