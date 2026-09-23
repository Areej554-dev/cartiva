import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

import { authOptions } from "@/auth";

export const runtime = "nodejs";

// =========================================
// ADMIN AUTHORIZATION
// =========================================

async function requireAdmin() {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      ),
    };
  }

  if (!session.user.isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}

// =========================================
// POST IMAGE
// =========================================

export async function POST(request) {
  try {
    // ---------------------------------------
    // Admin check
    // ---------------------------------------

    const auth = await requireAdmin();

    if (!auth.authorized) {
      return auth.response;
    }

    // ---------------------------------------
    // Read form data
    // ---------------------------------------

    let formData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid multipart form data.",
        },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    // ---------------------------------------
    // Validate uploaded object
    // ---------------------------------------

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "No image file selected.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Allowed image types
    // ---------------------------------------

    const allowedTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    if (!allowedTypes[file.type]) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // File size
    // ---------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (!Number.isFinite(file.size)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid image file.",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The uploaded image is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image size must be less than 5MB.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------
    // Get extension from validated MIME type
    // ---------------------------------------

    const extension =
      allowedTypes[file.type];

    // ---------------------------------------
    // Generate safe unique filename
    // ---------------------------------------

    const randomName =
      crypto.randomBytes(16).toString("hex");

    const uniqueName =
      `product-${Date.now()}-${randomName}${extension}`;

    // ---------------------------------------
    // Upload directory
    // ---------------------------------------

    const uploadDirectory =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    await mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );

    const filePath =
      path.join(
        uploadDirectory,
        uniqueName
      );

    // ---------------------------------------
    // Write file
    // ---------------------------------------

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    await writeFile(
      filePath,
      buffer
    );

    // ---------------------------------------
    // Return public URL
    // ---------------------------------------

    const imageUrl =
      `/uploads/${uniqueName}`;

    return NextResponse.json(
      {
        success: true,
        message:
          "Image uploaded successfully.",
        imageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "IMAGE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to upload image.",
      },
      { status: 500 }
    );
  }
}