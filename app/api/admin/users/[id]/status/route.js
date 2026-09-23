import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// UPDATE USER ACCOUNT STATUS
// =========================================

export async function PATCH(request, { params }) {
  try {
    // ---------------------------------------
    // Admin authorization
    // ---------------------------------------

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

    // ---------------------------------------
    // Get user ID
    // ---------------------------------------

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
    // Validate isActive
    // ---------------------------------------

    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isActive must be true or false.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Find user
    // ---------------------------------------

    const user = await User.findById(id);

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
    // Prevent self-deactivation
    // ---------------------------------------

    if (
      String(user._id) ===
      String(auth.session.user.id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot deactivate your own admin account.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Protect other admin accounts
    // ---------------------------------------

    if (user.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin account status cannot be changed here.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Update account status
    // ---------------------------------------

    user.isActive = body.isActive;

    await user.save();

    // ---------------------------------------
    // Success
    // ---------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: body.isActive
          ? "Account activated successfully."
          : "Account deactivated successfully.",

        user: {
          _id: String(user._id),
          name: user.name,
          email: user.email,
          isActive: Boolean(user.isActive),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN USER STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update account status.",
      },
      { status: 500 }
    );
  }
}