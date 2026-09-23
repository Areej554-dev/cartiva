import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

// =========================================
// GET CURRENT USER'S ORDERS
// =========================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to view your orders.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      userId: String(session.user.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// POST NEW ORDER
// =========================================

export async function POST(request) {
  const decreasedProducts = [];

  try {
    // ---------------------------------------
    // 1. AUTHENTICATION
    // ---------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // ---------------------------------------
    // 2. READ REQUEST
    // ---------------------------------------

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const {
      customer,
      shippingAddress,
      items,
      paymentMethod,
    } = body;

    // ---------------------------------------
    // 3. BASIC VALIDATION
    // ---------------------------------------

    if (
      !customer ||
      typeof customer !== "object" ||
      !shippingAddress ||
      typeof shippingAddress !== "object" ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Required order information is missing.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // CUSTOMER VALIDATION
    // ---------------------------------------

    const firstName =
      String(customer.firstName || "").trim();

    const lastName =
      String(customer.lastName || "").trim();

    const phone =
      String(customer.phone || "").trim();

    const sessionEmail =
      String(session.user.email || "")
        .trim()
        .toLowerCase();

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer information is incomplete.",
        },
        { status: 400 }
      );
    }

    if (!sessionEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account email could not be verified.",
        },
        { status: 400 }
      );
    }
    
    // ---------------------------------------
    // SHIPPING VALIDATION
    // ---------------------------------------

    const address =
      String(shippingAddress.address || "").trim();

    const city =
      String(shippingAddress.city || "").trim();

    const postalCode =
      String(shippingAddress.postalCode || "").trim();

    if (!address || !city || !postalCode) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Shipping address is incomplete.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // PAYMENT METHOD
    // ---------------------------------------

    const allowedPaymentMethods = [
      "Cash on Delivery",
    ];

    const selectedPaymentMethod =
      allowedPaymentMethods.includes(
        paymentMethod
      )
        ? paymentMethod
        : "Cash on Delivery";

    // ---------------------------------------
    // 4. VALIDATE ITEMS
    // ---------------------------------------

    const validatedItems = [];

    for (const item of items) {
      const productId =
        String(item?.productId || "").trim();

      const quantity = Number(
        item?.quantity || 1
      );

      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product information.",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product quantity.",
          },
          { status: 400 }
        );
      }

      let product;

      try {
        product = await Product.findById(
          productId
        ).lean();
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "One of the selected products is invalid.",
          },
          { status: 400 }
        );
      }

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message:
              "One of the selected products is no longer available.",
          },
          { status: 400 }
        );
      }

      const stock = Number(
        product.stock ?? 0
      );

      if (stock <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: `"${product.name}" is out of stock.`,
          },
          { status: 400 }
        );
      }

      if (quantity > stock) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${stock} item(s) of "${product.name}" are available.`,
          },
          { status: 400 }
        );
      }

      validatedItems.push({
        productId,
        quantity,
        product,
      });
    }

    // ---------------------------------------
    // 5. MERGE DUPLICATE PRODUCT LINES
    // ---------------------------------------

    const mergedItems = [];

    for (const item of validatedItems) {
      const existingItem =
        mergedItems.find(
          (existing) =>
            existing.productId ===
            item.productId
        );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        mergedItems.push({
          ...item,
        });
      }
    }

    // ---------------------------------------
    // 6. REVALIDATE MERGED QUANTITIES
    // ---------------------------------------

    for (const item of mergedItems) {
      const currentStock = Number(
        item.product.stock ?? 0
      );

      if (item.quantity > currentStock) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${currentStock} item(s) of "${item.product.name}" are available.`,
          },
          { status: 400 }
        );
      }
    }

    // ---------------------------------------
    // 7. CALCULATE TOTALS FROM DATABASE
    // ---------------------------------------

    const subtotal = mergedItems.reduce(
      (sum, item) => {
        const price = Number(
          item.product.price || 0
        );

        return (
          sum +
          price * item.quantity
        );
      },
      0
    );

    const shipping = 10;

    const total =
      subtotal + shipping;

    // ---------------------------------------
    // 8. ATOMIC STOCK DEDUCTION
    // ---------------------------------------

    try {
      for (const item of mergedItems) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: item.product._id,
              stock: {
                $gte: item.quantity,
              },
            },
            {
              $inc: {
                stock: -item.quantity,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );

        if (!updatedProduct) {
          throw new Error(
            `Not enough stock for "${item.product.name}".`
          );
        }

        decreasedProducts.push({
          productId:
            updatedProduct._id,
          quantity:
            item.quantity,
        });

        console.log(
          `STOCK UPDATED: ${updatedProduct.name} | Remaining: ${updatedProduct.stock}`
        );
      }

      // ---------------------------------------
      // 9. CREATE ORDER
      // ---------------------------------------

      const order =
        await Order.create({
          userId:
            String(session.user.id),

          customer: {
            firstName,
            lastName,
            email: sessionEmail,
            phone,
          },

          shippingAddress: {
            address,
            city,
            postalCode,
          },

          items: mergedItems.map(
            (item) => ({
              productId:
                String(
                  item.product._id
                ),

              name:
                item.product.name,

              price:
                Number(
                  item.product.price
                ),

              quantity:
                item.quantity,

              image:
                item.product.image ||
                "",
            })
          ),

          subtotal,
          shipping,
          total,

          paymentMethod:
            selectedPaymentMethod,

          status: "Pending",

          stockRestored: false,
        });

      // ---------------------------------------
      // 10. SUCCESS
      // ---------------------------------------

      return NextResponse.json(
        {
          success: true,
          message:
            "Order placed successfully.",
          order,
        },
        { status: 201 }
      );
    } catch (orderError) {
      // ---------------------------------------
      // 11. RESTORE STOCK
      // ---------------------------------------

      console.error(
        "ORDER CREATION FAILED:",
        orderError
      );

      for (const item of decreasedProducts) {
        try {
          const restoredProduct =
            await Product.findByIdAndUpdate(
              item.productId,
              {
                $inc: {
                  stock: item.quantity,
                },
              },
              {
                new: true,
              }
            );

          if (restoredProduct) {
            console.log(
              `STOCK RESTORED: ${restoredProduct.name} | Stock: ${restoredProduct.stock}`
            );
          }
        } catch (restoreError) {
          console.error(
            "STOCK RESTORATION FAILED:",
            restoreError
          );
        }
      }

      throw orderError;
    }
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to create order.",
      },
      { status: 500 }
    );
  }
}