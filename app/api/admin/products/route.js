import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// GET ALL PRODUCTS
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

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN GET PRODUCTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// CREATE PRODUCT
// =========================================

export async function POST(request) {
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
    // Parse JSON safely
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

    // ---------------------------------------
    // Read fields
    // ---------------------------------------

    const {
      name,
      category,
      price,
      image,
      description,
      stock,
    } = body;

    // ---------------------------------------
    // Validate name
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
    // Validate category
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
    // Validate price
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
    // Validate stock
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
    // Validate image
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
    // Validate description
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
    // Create product
    // ---------------------------------------

    const product = await Product.create({
      name: cleanName,
      category: cleanCategory,
      price: roundedPrice,
      image: cleanImage,
      description: cleanDescription,
      stock: numericStock,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN CREATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}