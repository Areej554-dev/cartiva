import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function GET() {
  try {
    await connectDB();

    const cart = await Cart.find();

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const product = await request.json();

    const existingProduct = await Cart.findOne({
      id: product.id,
    });

    if (existingProduct) {
      existingProduct.quantity += 1;

      await existingProduct.save();

      return NextResponse.json(existingProduct);
    }

    const cartItem = await Cart.create({
      ...product,
      quantity: 1,
    });

    return NextResponse.json(cartItem, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { id } = await request.json();

    await Cart.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Product removed from cart",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const { id, quantity } = await request.json();

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity cannot be less than 1" },
        { status: 400 }
      );
    }

    const updatedProduct = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}