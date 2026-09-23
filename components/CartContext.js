"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // =========================================
  // GET STOCK
  // =========================================

  const getStock = (product) => {
    const stock = Number(product?.stock);

    return Number.isFinite(stock) && stock >= 0
      ? stock
      : null;
  };

  // =========================================
  // LOAD CART
  // =========================================

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);

      localStorage.removeItem("cart");
    } finally {
      setLoaded(true);
    }
  }, []);

  // =========================================
  // SAVE CART
  // =========================================

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart, loaded]);

  // =========================================
  // SYNC STOCK
  // =========================================

  useEffect(() => {
    if (!loaded || cart.length === 0) {
      return;
    }

    let cancelled = false;

    const syncStock = async () => {
      try {
        const response = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const products = await response.json();

        if (
          cancelled ||
          !Array.isArray(products)
        ) {
          return;
        }

        setCart((currentCart) =>
          currentCart
            .map((cartItem) => {
              const cartProductId = String(
                cartItem._id || cartItem.id
              );

              const latestProduct = products.find(
                (product) =>
                  String(
                    product._id || product.id
                  ) === cartProductId
              );

              if (!latestProduct) {
                return cartItem;
              }

              const latestStock =
                getStock(latestProduct);

              const currentQuantity = Math.max(
                1,
                Number(cartItem.quantity || 1)
              );

              if (
                latestStock !== null &&
                latestStock <= 0
              ) {
                return null;
              }

              return {
                ...cartItem,
                ...latestProduct,
                quantity:
                  latestStock !== null
                    ? Math.min(
                        currentQuantity,
                        latestStock
                      )
                    : currentQuantity,
              };
            })
            .filter(Boolean)
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to sync cart stock:",
            error
          );
        }
      }
    };

    syncStock();

    return () => {
      cancelled = true;
    };
  }, [loaded]);

  // =========================================
  // ADD PRODUCT
  // =========================================

  const addToCart = (
    product,
    requestedQuantity = 1
  ) => {
    const productId = String(
      product._id || product.id
    );

    const requested = Number(
      requestedQuantity
    );

    if (
      !Number.isInteger(requested) ||
      requested <= 0
    ) {
      return false;
    }

    const stock = getStock(product);

    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            String(
              item._id || item.id
            ) === productId
        );

      // Existing product
      if (existingProduct) {
        const currentQuantity = Math.max(
          1,
          Number(
            existingProduct.quantity || 1
          )
        );

        const maxStock =
          stock !== null
            ? stock
            : Infinity;

        const availableToAdd = Math.max(
          0,
          maxStock - currentQuantity
        );

        const quantityToAdd = Math.min(
          requested,
          availableToAdd
        );

        if (quantityToAdd <= 0) {
          return currentCart;
        }

        return currentCart.map((item) =>
          String(
            item._id || item.id
          ) === productId
            ? {
                ...item,
                ...product,
                quantity:
                  currentQuantity +
                  quantityToAdd,
              }
            : item
        );
      }

      // New product
      if (
        stock !== null &&
        stock <= 0
      ) {
        return currentCart;
      }

      const quantityToAdd =
        stock !== null
          ? Math.min(requested, stock)
          : requested;

      if (quantityToAdd <= 0) {
        return currentCart;
      }

      return [
        ...currentCart,
        {
          ...product,
          _id: productId,
          id: productId,
          quantity: quantityToAdd,
        },
      ];
    });

    return true;
  };

  // =========================================
  // SET EXACT QUANTITY
  // =========================================

  const updateQuantity = (
    productId,
    newQuantity
  ) => {
    const quantity = Number(newQuantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setCart((currentCart) =>
        currentCart.filter(
          (item) =>
            String(
              item._id || item.id
            ) !== String(productId)
        )
      );

      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          String(
            item._id || item.id
          ) !== String(productId)
        ) {
          return item;
        }

        const stock = getStock(item);

        const finalQuantity =
          stock !== null
            ? Math.min(
                Math.floor(quantity),
                stock
              )
            : Math.floor(quantity);

        return {
          ...item,
          quantity: finalQuantity,
        };
      })
    );
  };

  // =========================================
  // INCREASE
  // =========================================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          String(
            item._id || item.id
          ) !== String(productId)
        ) {
          return item;
        }

        const currentQuantity = Math.max(
          1,
          Number(
            item.quantity || 1
          )
        );

        const stock = getStock(item);

        if (
          stock !== null &&
          currentQuantity >= stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity:
            currentQuantity + 1,
        };
      })
    );
  };

  // =========================================
  // DECREASE
  // =========================================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          String(
            item._id || item.id
          ) === String(productId)
            ? {
                ...item,
                quantity:
                  Number(
                    item.quantity || 1
                  ) - 1,
              }
            : item
        )
        .filter(
          (item) =>
            Number(
              item.quantity || 0
            ) > 0
        )
    );
  };

  // =========================================
  // REMOVE
  // =========================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          String(
            item._id || item.id
          ) !== String(productId)
      )
    );
  };

  // =========================================
  // CLEAR
  // =========================================

  const clearCart = () => {
    setCart([]);
  };

  // =========================================
  // CART COUNT
  // =========================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // =========================================
  // CART SUBTOTAL
  // =========================================

  const cartSubtotal = cart.reduce(
    (total, item) => {
      const price = Number(
        item.price || 0
      );

      const quantity = Math.max(
        1,
        Number(item.quantity || 1)
      );

      return total + price * quantity;
    },
    0
  );

  // =========================================
  // PROVIDER
  // =========================================

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loaded,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================================
// HOOK
// =========================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider."
    );
  }

  return context;
}