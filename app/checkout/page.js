"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function BagIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function PackageIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

export default function Checkout() {
  const {
    cart,
    clearCart,
    setCart,
    cartCount,
    cartSubtotal,
  } = useCart();

  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] =
    useState(true);

  const [checkingStock, setCheckingStock] =
    useState(false);

  const [error, setError] = useState("");
  const [stockErrors, setStockErrors] =
    useState([]);

  // =========================================
  // LOAD ACCOUNT INFORMATION
  // =========================================

  useEffect(() => {
    if (!session?.user?.id) {
      if (status !== "loading") {
        setLoadingAccount(false);
      }

      return;
    }

    let cancelled = false;

    const loadAccountInformation = async () => {
      try {
        setLoadingAccount(true);

        const fullName =
          session.user.name?.trim() || "";

        const nameParts =
          fullName.split(/\s+/);

        const firstName =
          nameParts[0] || "";

        const lastName =
          nameParts.slice(1).join(" ") || "";

        if (!cancelled) {
          setFormData((current) => ({
            ...current,
            firstName,
            lastName,
            email:
              session.user.email || "",
          }));
        }

        const response = await fetch(
          "/api/account",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        const responseText =
          await response.text();

        let data = {};

        if (
          responseText &&
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            data = JSON.parse(
              responseText
            );
          } catch (parseError) {
            console.error(
              "ACCOUNT JSON ERROR:",
              parseError
            );
          }
        }

        if (!response.ok) {
          console.error(
            "ACCOUNT LOAD ERROR:",
            data.message
          );

          return;
        }

        if (data.user && !cancelled) {
          setFormData((current) => ({
            ...current,

            firstName,
            lastName,

            email:
              session.user.email ||
              data.user.email ||
              "",

            phone:
              data.user.phone || "",

            address:
              data.user.address || "",

            city:
              data.user.city || "",

            postalCode:
              data.user.postalCode || "",
          }));
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "FAILED TO LOAD ACCOUNT INFORMATION:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAccount(false);
        }
      }
    };

    loadAccountInformation();

    return () => {
      cancelled = true;
    };
  }, [session, status]);

  // =========================================
  // TOTALS
  // =========================================

  const subtotal = Number(
    cartSubtotal || 0
  );

  const shipping =
    cart.length > 0 ? 10 : 0;

  const total =
    subtotal + shipping;

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setStockErrors([]);
  };

  // =========================================
  // CHECK STOCK
  // =========================================

  const checkCurrentStock = async () => {
    try {
      setCheckingStock(true);
      setStockErrors([]);
      setError("");

      const response = await fetch(
        "/api/products",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to check current product stock."
        );
      }

      const products = await response.json();

      if (!Array.isArray(products)) {
        throw new Error(
          "Invalid product information received from server."
        );
      }

      const errors = [];
      const updatedCart = [];

      for (const cartItem of cart) {
        const cartProductId = String(
          cartItem._id || cartItem.id
        );

        const latestProduct =
          products.find(
            (product) =>
              String(
                product._id || product.id
              ) === cartProductId
          );

        if (!latestProduct) {
          errors.push(
            `${cartItem.name} is no longer available.`
          );

          continue;
        }

        const currentStock = Number(
          latestProduct.stock ?? 0
        );

        const requestedQuantity =
          Number(
            cartItem.quantity || 1
          );

        if (currentStock <= 0) {
          errors.push(
            `${latestProduct.name} is currently out of stock.`
          );

          updatedCart.push({
            ...cartItem,
            ...latestProduct,
            quantity: requestedQuantity,
            unavailable: true,
          });

          continue;
        }

        if (
          requestedQuantity >
          currentStock
        ) {
          errors.push(
            `Only ${currentStock} of "${latestProduct.name}" are available.`
          );

          updatedCart.push({
            ...cartItem,
            ...latestProduct,
            quantity: currentStock,
            unavailable: false,
          });

          continue;
        }

        updatedCart.push({
          ...cartItem,
          ...latestProduct,
          unavailable: false,
        });
      }

      setCart(updatedCart);

      if (errors.length > 0) {
        setStockErrors(errors);
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "STOCK CHECK ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to verify product stock."
      );

      return false;
    } finally {
      setCheckingStock(false);
    }
  };

  // =========================================
  // VALIDATE FORM
  // =========================================

  const validateForm = () => {
    const firstName =
      formData.firstName.trim();

    const lastName =
      formData.lastName.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const address =
      formData.address.trim();

    const city =
      formData.city.trim();

    const postalCode =
      formData.postalCode.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode
    ) {
      return "Please complete all required fields.";
    }

    if (firstName.length < 2) {
      return "Please enter a valid first name.";
    }

    if (lastName.length < 2) {
      return "Please enter a valid last name.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    const phoneDigits =
      phone.replace(/\D/g, "");

    if (phoneDigits.length < 7) {
      return "Please enter a valid phone number.";
    }

    if (address.length < 5) {
      return "Please enter a complete shipping address.";
    }

    if (city.length < 2) {
      return "Please enter a valid city.";
    }

    if (postalCode.length < 3) {
      return "Please enter a valid postal code.";
    }

    return "";
  };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setStockErrors([]);

    if (!session?.user?.id) {
      setError(
        "Please login before placing your order."
      );

      return;
    }

    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    if (
      loading ||
      checkingStock
    ) {
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const stockIsValid =
      await checkCurrentStock();

    if (!stockIsValid) {
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),
        },

        shippingAddress: {
          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          postalCode:
            formData.postalCode.trim(),
        },

        items: cart.map((product) => ({
          productId: String(
            product._id || product.id
          ),

          name: product.name,

          price:
            Number(product.price) || 0,

          quantity:
            Number(product.quantity) || 1,

          image:
            product.image || "",
        })),

        subtotal,
        shipping,
        total,

        paymentMethod,
      };

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            orderData
          ),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      const responseText =
        await response.text();

      let data = {};

      if (responseText) {
        if (
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            data =
              JSON.parse(
                responseText
              );
          } catch (parseError) {
            console.error(
              "ORDER JSON PARSE ERROR:",
              parseError
            );

            throw new Error(
              "The server returned an invalid response."
            );
          }
        } else {
          throw new Error(
            "The server returned an unexpected response."
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place order."
        );
      }

      if (!data.order?._id) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      clearCart();

      router.push(
        `/order-success?id=${data.order._id}`
      );
    } catch (error) {
      console.error(
        "ORDER FAILED:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while placing your order."
      );

      setLoading(false);
    }
  };

  // =========================================
  // AUTH LOADING
  // =========================================

  if (status === "loading") {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12">
        <div className="text-center">

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[#E9DED6] border-t-[#E98B50]" />

          <h1 className="text-2xl font-bold text-[#2D2723]">
            Checking your account...
          </h1>

          <p className="mt-2 text-base text-[#756C65]">
            Please wait a moment.
          </p>

        </div>
      </main>
    );
  }

  // =========================================
  // GUEST
  // =========================================

  if (!session?.user) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <LockIcon className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Login Required
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Please login to your Cartiva account before
            proceeding to checkout.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#E98B50] px-7 py-3 text-base font-semibold text-white transition hover:bg-[#C96C35]"
            >
              Login
            </Link>

            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E9DED6] px-7 py-3 text-base font-semibold text-[#2D2723] transition hover:border-[#E98B50] hover:bg-[#FFF9F5]"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </main>
    );
  }

  // =========================================
  // EMPTY CART
  // =========================================

  if (cart.length === 0) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#FFF9F5] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E9DED6] bg-white p-7 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1E8] text-[#E98B50]">
            <BagIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-[#2D2723] sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-base leading-6 text-[#756C65]">
            Add some products before checking out.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] sm:w-auto"
          >
            Start Shopping
            <ArrowRightIcon />
          </Link>

        </div>
      </main>
    );
  }

  // =========================================
  // CHECKOUT PAGE
  // =========================================

  return (
    <main className="min-h-screen bg-[#FFF9F5] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-7 sm:mb-9">

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#756C65] transition hover:text-[#C96C35] sm:text-base"
          >
            <ArrowLeftIcon />
            Back to Cart
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#E98B50]">
            Complete your order
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2D2723] sm:text-4xl lg:text-5xl">
            Checkout
          </h1>

          <p className="mt-2 max-w-2xl text-base leading-6 text-[#756C65]">
            Complete your details to place your order.
          </p>

        </div>

        {/* ACCOUNT LOADING */}

        {loadingAccount && (
          <div className="mb-6 rounded-xl border border-[#E9DED6] bg-white px-4 py-3.5 text-sm text-[#756C65]">
            Loading your saved account information...
          </div>
        )}

        {/* STOCK ERRORS */}

        {stockErrors.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">

            <p className="text-base font-bold">
              Please review your cart
            </p>

            <div className="mt-2 space-y-1">
              {stockErrors.map(
                (stockError, index) => (
                  <p
                    key={`${stockError}-${index}`}
                    className="text-sm leading-5"
                  >
                    {stockError}
                  </p>
                )
              )}
            </div>

            <Link
              href="/cart"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#E98B50] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C96C35]"
            >
              Review Cart
            </Link>

          </div>
        )}

        {/* GENERAL ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-base font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">

            {/* =====================================
                LEFT CONTENT
            ====================================== */}

            <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2">

              {/* CUSTOMER INFORMATION */}

              <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Customer Information
                  </h2>

                  <p className="mt-1 text-base leading-6 text-[#756C65]">
                    Enter the details we should use for your order.
                  </p>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* First Name */}

                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-base font-semibold text-[#2D2723]"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      required
                      className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                    />
                  </div>

                  {/* Last Name */}

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-base font-semibold text-[#2D2723]"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      required
                      className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                    />
                  </div>

                </div>

                {/* Email */}

                <div className="mt-5">

                  <label
                    htmlFor="email"
                    className="mb-2 block text-base font-semibold text-[#2D2723]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    autoComplete="email"
                    className="min-h-12 w-full cursor-not-allowed rounded-xl border border-[#E9DED6] bg-[#FFF9F5] px-4 py-3 text-base text-[#756C65]"
                  />

                  <p className="mt-2 text-sm leading-5 text-[#756C65]">
                    Your account email is used for this order.
                  </p>

                </div>

                {/* Phone */}

                <div className="mt-5">

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-base font-semibold text-[#2D2723]"
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    required
                    className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                  />

                </div>

              </section>

              {/* SHIPPING */}

              <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Shipping Address
                  </h2>

                  <p className="mt-1 text-base leading-6 text-[#756C65]">
                    Where should we deliver your order?
                  </p>

                </div>

                <div>

                  <label
                    htmlFor="address"
                    className="mb-2 block text-base font-semibold text-[#2D2723]"
                  >
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                    autoComplete="street-address"
                    required
                    className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                  />

                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  {/* City */}

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-base font-semibold text-[#2D2723]"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      autoComplete="address-level2"
                      required
                      className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                    />
                  </div>

                  {/* Postal Code */}

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-base font-semibold text-[#2D2723]"
                    >
                      Postal Code
                    </label>

                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      autoComplete="postal-code"
                      required
                      className="min-h-12 w-full rounded-xl border border-[#E9DED6] bg-white px-4 py-3 text-base text-[#2D2723] outline-none transition placeholder:text-[#A39A94] focus:border-[#E98B50] focus:ring-2 focus:ring-[#F3B183]/40"
                    />
                  </div>

                </div>

              </section>

              {/* PAYMENT */}

              <section className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">

                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-base leading-6 text-[#756C65]">
                    Select your preferred payment method.
                  </p>

                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E9DED6] bg-[#FFF9F5] p-4 transition hover:border-[#F3B183] hover:bg-[#FFF1E8]">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    className="mt-1 h-4 w-4 accent-[#E98B50]"
                  />

                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[#2D2723]">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-sm leading-5 text-[#756C65]">
                      Pay when your order arrives.
                    </p>
                  </div>

                </label>

              </section>

            </div>

            {/* =====================================
                RIGHT SUMMARY
            ====================================== */}

            <aside className="min-w-0 lg:sticky lg:top-24">

              <div className="rounded-2xl border border-[#E9DED6] bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between gap-3">

                  <h2 className="text-xl font-bold text-[#2D2723] sm:text-2xl">
                    Order Summary
                  </h2>

                  <span className="shrink-0 text-sm text-[#756C65]">
                    {cartCount}{" "}
                    {cartCount === 1
                      ? "item"
                      : "items"}
                  </span>

                </div>

                {/* ITEMS */}

                <div className="mt-6 space-y-4">

                  {cart.map((product) => {
                    const productId =
                      String(
                        product._id ||
                          product.id
                      );

                    const quantity =
                      Number(
                        product.quantity ||
                          1
                      );

                    const price =
                      Number(
                        product.price ||
                          0
                      );

                    const itemTotal =
                      price *
                      quantity;

                    return (
                      <div
                        key={productId}
                        className="flex min-w-0 gap-3"
                      >

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF1E8]">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <PackageIcon className="h-6 w-6 text-[#E98B50]" />
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-[#2D2723]">
                            {product.name}
                          </p>

                          <p className="mt-1 text-sm text-[#756C65]">
                            Qty: {quantity}
                          </p>

                        </div>

                        <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#C96C35]">
                          ${itemTotal.toFixed(2)}
                        </p>

                      </div>
                    );
                  })}

                </div>

                {/* TOTALS */}

                <div className="mt-6 space-y-3 border-t border-[#E9DED6] pt-6">

                  <div className="flex justify-between gap-4">
                    <span className="text-base text-[#756C65]">
                      Subtotal
                    </span>

                    <span className="text-base font-medium text-[#2D2723]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-base text-[#756C65]">
                      Shipping
                    </span>

                    <span className="text-base font-medium text-[#2D2723]">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#E9DED6] pt-4">

                    <span className="text-lg font-bold text-[#2D2723]">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#C96C35]">
                      ${total.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingAccount ||
                    checkingStock ||
                    stockErrors.length > 0
                  }
                  className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E98B50] px-5 py-3.5 text-base font-semibold text-white transition hover:bg-[#C96C35] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkingStock ? (
                    <>
                      <Spinner />
                      Checking Stock...
                    </>
                  ) : loading ? (
                    <>
                      <Spinner />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRightIcon />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#E9DED6] pt-4 text-sm text-[#756C65]">
                  <LockIcon />
                  Secure checkout
                </div>

              </div>

              {/* BACK TO CART */}

              <Link
                href="/cart"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#756C65] transition hover:text-[#C96C35]"
              >
                <ArrowLeftIcon />
                Return to Cart
              </Link>

            </aside>

          </div>
        </form>

      </div>
    </main>
  );
}