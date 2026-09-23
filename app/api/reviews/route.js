import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

// GET reviews / rating summaries
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");
    const productIds = searchParams.get("productIds");

    await connectDB();

    // Single product reviews
    if (productId) {
      const reviews = await Review.find({
        productId: String(productId),
      })
        .sort({ createdAt: -1 })
        .lean();

      const averageRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum, review) =>
                sum + Number(review.rating || 0),
              0
            ) / reviews.length
          : 0;

      return NextResponse.json(
        {
          success: true,
          reviews,
          averageRating,
          reviewCount: reviews.length,
        },
        {
          status: 200,
        }
      );
    }

    // Multiple products
    if (productIds) {
      const ids = productIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      const reviews = await Review.find({
        productId: { $in: ids },
      })
        .sort({ createdAt: -1 })
        .lean();

      const summaries = {};

      ids.forEach((id) => {
        const productReviews = reviews.filter(
          (review) =>
            String(review.productId) === String(id)
        );

        const averageRating =
          productReviews.length > 0
            ? productReviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating || 0),
                0
              ) / productReviews.length
            : 0;

        summaries[id] = {
          averageRating,
          reviewCount: productReviews.length,
        };
      });

      return NextResponse.json(
        {
          success: true,
          summaries,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Product ID or product IDs are required.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews.",
      },
      {
        status: 500,
      }
    );
  }
}


// POST a verified review
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to write a review.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const {
      productId,
      rating,
      comment,
    } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product, rating and comment are required.",
        },
        {
          status: 400,
        }
      );
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rating must be between 1 and 5.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof comment !== "string" ||
      comment.trim().length < 3
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review must contain at least 3 characters.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    // Check whether the user purchased this product
    const purchasedProduct = await Order.findOne({
      userId: String(session.user.id),
      "items.productId": String(productId),
    });

    if (!purchasedProduct) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only review products you have purchased.",
        },
        {
          status: 403,
        }
      );
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({
      productId: String(productId),
      userId: String(session.user.id),
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reviewed this product.",
        },
        {
          status: 409,
        }
      );
    }

    const review = await Review.create({
      productId: String(productId),
      userId: String(session.user.id),
      userName:
        session.user.name || "Customer",
      rating: numericRating,
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Verified review submitted successfully.",
        review,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review.",
      },
      {
        status: 500,
      }
    );
  }
}