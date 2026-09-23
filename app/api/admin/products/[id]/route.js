import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// VALIDATE PRODUCT ID
// =========================================

function validateProductId(id) {
  return (
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id)
  );
}

// =========================================
// UPDATE PRODUCT
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

    if (!validateProductId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

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

    const {
      name,
      category,
      price,
      image,
      description,
      stock,
    } = body;

    // ---------------------------------------
    // NAME
    // ---------------------------------------

    const cleanName =
      typeof name === "string"
        ? name.trim()
        : "";

    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (cleanName.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product name cannot exceed 150 characters.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // CATEGORY
    // ---------------------------------------

    const cleanCategory =
      typeof category === "string"
        ? category.trim()
        : "";

    if (!cleanCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Product category is required.",
        },
        { status: 400 }
      );
    }

    if (cleanCategory.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product category cannot exceed 50 characters.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // PRICE
    // ---------------------------------------

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product price is required.",
        },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    const roundedPrice =
      Math.round(numericPrice * 100) / 100;

    // ---------------------------------------
    // STOCK
    // ---------------------------------------

    const numericStock =
      stock === undefined ||
      stock === null ||
      stock === ""
        ? 0
        : Number(stock);

    if (
      !Number.isFinite(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stock must be a valid non-negative whole number.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // IMAGE
    // ---------------------------------------

    const cleanImage =
      typeof image === "string"
        ? image.trim()
        : "";

    if (cleanImage.length > 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Image path is too long.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // DESCRIPTION
    // ---------------------------------------

    const cleanDescription =
      typeof description === "string"
        ? description.trim()
        : "";

    if (cleanDescription.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Description cannot exceed 5000 characters.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // FIND PRODUCT
    // ---------------------------------------

    const product =
      await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------
    // UPDATE
    // ---------------------------------------

    product.name = cleanName;
    product.category = cleanCategory;
    product.price = roundedPrice;
    product.image = cleanImage;
    product.description = cleanDescription;
    product.stock = numericStock;

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully.",
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// DELETE PRODUCT
// =========================================

export async function DELETE(
  request,
  { params }
) {
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

    if (!validateProductId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const product =
      await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    await product.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message:
          "Product deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}