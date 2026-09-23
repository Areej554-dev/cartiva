import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// =========================================
// GET CURRENT ACCOUNT
// =========================================

export async function GET() {
  try {
    const session =
      await getServerSession(authOptions);

    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // ---------------------------------------
    // Get user
    // ---------------------------------------

    const user =
      await User.findById(
        session.user.id
      )
        .select(
          "name email phone address city postalCode isAdmin isActive createdAt"
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
    // Account response
    // ---------------------------------------

    return NextResponse.json(
      {
        success: true,

        user: {
          _id: String(user._id),
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          postalCode:
            user.postalCode || "",
          isAdmin:
            Boolean(user.isAdmin),
          isActive:
            user.isActive !== false,
          createdAt:
            user.createdAt || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET ACCOUNT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load account.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// UPDATE CURRENT ACCOUNT
// =========================================

export async function PATCH(request) {
  try {
    const session =
      await getServerSession(authOptions);

    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

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
          message:
            "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Only accept editable fields
    // ---------------------------------------

    const phone =
      typeof body?.phone === "string"
        ? body.phone.trim()
        : "";

    const address =
      typeof body?.address === "string"
        ? body.address.trim()
        : "";

    const city =
      typeof body?.city === "string"
        ? body.city.trim()
        : "";

    const postalCode =
      typeof body?.postalCode === "string"
        ? body.postalCode.trim()
        : "";

    // ---------------------------------------
    // Validate field lengths
    // ---------------------------------------

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number is too long.",
        },
        { status: 400 }
      );
    }

    if (address.length > 300) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Address cannot exceed 300 characters.",
        },
        { status: 400 }
      );
    }

    if (city.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "City cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    if (postalCode.length > 20) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Postal code is too long.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Basic phone validation
    // ---------------------------------------

    if (phone) {
      const phoneDigits =
        phone.replace(/\D/g, "");

      if (
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please enter a valid phone number.",
          },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // ---------------------------------------
    // Get current user
    // ---------------------------------------

    const user =
      await User.findById(
        session.user.id
      );

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
    // Update ONLY editable fields
    // ---------------------------------------

    user.phone = phone;
    user.address = address;
    user.city = city;
    user.postalCode =
      postalCode;

    await user.save();

    // ---------------------------------------
    // Return safe user data
    // ---------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Account information updated successfully.",

        user: {
          _id: String(user._id),
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address:
            user.address || "",
          city: user.city || "",
          postalCode:
            user.postalCode || "",
          isAdmin:
            Boolean(user.isAdmin),
          isActive:
            user.isActive !== false,
          createdAt:
            user.createdAt || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE ACCOUNT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update account.",
      },
      { status: 500 }
    );
  }
}