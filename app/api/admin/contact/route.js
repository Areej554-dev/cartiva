import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

// =========================================
// GET MESSAGES
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

    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        messages: messages.map((message) => ({
          ...message,
          _id: message._id.toString(),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN CONTACT GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load contact messages.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// UPDATE MESSAGE STATUS
// =========================================

export async function PATCH(request) {
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

    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Message ID is required.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "New",
      "Read",
      "Replied",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message status.",
        },
        { status: 400 }
      );
    }

    const message =
      await ContactMessage.findById(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Contact message not found.",
        },
        { status: 404 }
      );
    }

    message.status = status;

    await message.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Contact message status updated successfully.",
        contactMessage: {
          ...message.toObject(),
          _id: message._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN CONTACT PATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update contact message.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// DELETE MESSAGE
// =========================================

export async function DELETE(request) {
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

    const { searchParams } =
      new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Message ID is required.",
        },
        { status: 400 }
      );
    }

    const deletedMessage =
      await ContactMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Contact message not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Contact message deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "ADMIN CONTACT DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete contact message.",
      },
      { status: 500 }
    );
  }
}