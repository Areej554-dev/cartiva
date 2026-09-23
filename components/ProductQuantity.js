"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function ProductQuantity({ product }) {
  const { addToCart } = useCart();

  const stock = Number(product?.stock ?? 0);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // =========================================
  // INCREASE QUANTITY
  // =========================================

  const increaseQuantity = () => {
    setQuantity((current) => {
      if (current >= stock) {
        return current;
      }

      return current + 1;
    });
  };

  // =========================================
  // DECREASE QUANTITY
  // =========================================

  const decreaseQuantity = () => {
    setQuantity((current) => {
      if (current <= 1) {
        return 1;
      }

      return current - 1;
    });
  };

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {
    if (stock <= 0) {
      alert(
        "This product is currently out of stock."
      );

      return;
    }

    if (quantity > stock) {
      alert(
        `Only ${stock} item${
          stock === 1 ? "" : "s"
        } available.`
      );

      setQuantity(stock);

      return;
    }

    setAdding(true);

    try {
      const added = addToCart(
        product,
        quantity
      );

      if (!added) {
        alert(
          "You already have the maximum available quantity in your cart."
        );

        return;
      }

      alert(
        `${quantity} ${
          quantity === 1
            ? "item"
            : "items"
        } added to your cart.`
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      alert(
        "Something went wrong while adding the product to your cart."
      );
    } finally {
      setAdding(false);
    }
  };

  // =========================================
  // OUT OF STOCK
  // =========================================

  if (stock <= 0) {
    return (
      <div className="w-full">

        <div className="mb-3 text-sm font-medium text-red-600">
          This product is currently out of stock.
        </div>

        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-3.5 font-semibold text-gray-500 sm:w-auto"
        >
          Out of Stock
        </button>

      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="flex w-full flex-col gap-4">

      {/* =====================================
          STOCK
      ====================================== */}

      <div className="flex items-center justify-between gap-4">

        <p className="text-sm text-gray-500">
          {stock}{" "}
          {stock === 1
            ? "item"
            : "items"}{" "}
          available
        </p>

        {stock <= 5 && (
          <p className="text-sm font-medium text-orange-600">
            Only {stock} left
          </p>
        )}

      </div>

      {/* =====================================
          QUANTITY SELECTOR
      ====================================== */}

      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-gray-700">
          Quantity
        </span>

        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300">

          {/* Minus */}
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={
              quantity <= 1 || adding
            }
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>

          {/* Quantity */}
          <span className="flex h-11 min-w-12 items-center justify-center border-x border-gray-300 px-3 font-semibold">
            {quantity}
          </span>

          {/* Plus */}
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              quantity >= stock || adding
            }
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>

        </div>

      </div>

      {/* =====================================
          ADD TO CART
      ====================================== */}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding}
        className="w-full rounded-xl bg-[#E98B50] px-6 py-3.5 font-semibold text-white transition hover:bg-[#C96C35] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {adding
          ? "Adding..."
          : "Add to Cart"}
      </button>

    </div>
  );
}