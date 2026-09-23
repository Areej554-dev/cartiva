import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

export const dynamic = "force-dynamic";

// GET user's wishlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({
      userId: String(session.user.id),
    }).lean();

    return NextResponse.json(
      {
        success: true,
        wishlist: wishlist?.products || [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}


// ADD product to wishlist
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to use your wishlist.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const {
      productId,
      name,
      price,
      image,
      category,
    } = body;

    if (!productId || !name || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Product information is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    let wishlist = await Wishlist.findOne({
      userId: String(session.user.id),
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: String(session.user.id),
        products: [
          {
            productId: String(productId),
            name,
            price: Number(price),
            image: image || "",
            category: category || "",
          },
        ],
      });

      return NextResponse.json(
        {
          success: true,
          message: "Added to wishlist.",
          wishlist: wishlist.products,
        },
        {
          status: 201,
        }
      );
    }

    const alreadyExists = wishlist.products.some(
      (product) =>
        String(product.productId) ===
        String(productId)
    );

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is already in your wishlist.",
        },
        {
          status: 409,
        }
      );
    }

    wishlist.products.push({
      productId: String(productId),
      name,
      price: Number(price),
      image: image || "",
      category: category || "",
    });

    await wishlist.save();

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist.",
        wishlist: wishlist.products,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}


// REMOVE product from wishlist
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({
      userId: String(session.user.id),
    });

    if (!wishlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist not found.",
        },
        {
          status: 404,
        }
      );
    }

    wishlist.products = wishlist.products.filter(
      (product) =>
        String(product.productId) !==
        String(productId)
    );

    await wishlist.save();

    return NextResponse.json(
      {
        success: true,
        message: "Removed from wishlist.",
        wishlist: wishlist.products,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product.",
      },
      {
        status: 500,
      }
    );
  }
}