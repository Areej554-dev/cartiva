import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function POST(request) {
  try {
    await connectDB();
  
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }
    
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          message: "Please fill in all fields.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          message: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (email.length > 150) {
      return NextResponse.json(
        {
          message: "Email is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          message: "Subject is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          message: "Message is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message: "Your message has been sent successfully.",
        id: contactMessage._id.toString(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while sending your message.",
      },
      {
        status: 500,
      }
    );
  }
}