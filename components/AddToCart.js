"use client";

import { useCart } from "@/components/CartContext";

export default function AddToCart({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);

    alert("Product added to cart!");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-black text-white px-8 py-4 rounded-lg text-lg"
    >
      Add to Cart
    </button>
  );
}