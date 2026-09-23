import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Sorting
    let sortOption = {};

    if (sort === "price-asc") {
      sortOption.price = 1;
    }

    if (sort === "price-desc") {
      sortOption.price = -1;
    }

    if (sort === "name-asc") {
      sortOption.name = 1;
    }

    if (sort === "name-desc") {
      sortOption.name = -1;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .lean();

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}