"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { data: session, status } = useSession();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================================
  // LOAD WISHLIST
  // =========================================

  useEffect(() => {
    if (status !== "authenticated") {
      setWishlist([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadWishlist = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/wishlist", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load wishlist."
          );
        }

        if (!cancelled) {
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "WISHLIST LOAD ERROR:",
            error
          );
          setWishlist([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [status]);

  // =========================================
  // CHECK WISHLIST
  // =========================================

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        String(item.productId) === String(productId)
    );
  };

  // =========================================
  // ADD TO WISHLIST
  // =========================================

  const addToWishlist = async (product) => {
    if (!session?.user) {
      window.location.href = "/login";
      return;
    }

    const productId = String(
      product._id || product.id
    );

    try {
      setLoading(true);

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name: product.name,
          price: Number(product.price || 0),
          image: product.image || "",
          category: product.category || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add to wishlist."
        );
      }

      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error(
        "ADD WISHLIST ERROR:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REMOVE FROM WISHLIST
  // =========================================

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/wishlist?productId=${encodeURIComponent(
          String(productId)
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove product."
        );
      }

      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error(
        "REMOVE WISHLIST ERROR:",
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // TOGGLE WISHLIST
  // =========================================

  const toggleWishlist = async (product) => {
    const productId = String(
      product._id || product.id
    );

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
      return;
    }

    await addToWishlist(product);
  };

  // =========================================
  // PROVIDER
  // =========================================

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider."
    );
  }

  return context;
}