import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

export default async function OrderSuccess({
  searchParams,
}) {
  const params = await searchParams;
  const orderId = params.id;

  const session = await getServerSession(
    authOptions
  );

  let order = null;

  if (orderId && session?.user?.id) {
    try {
      await connectDB();

      order = await Order.findOne({
        _id: orderId,
        userId: String(session.user.id),
      }).lean();
    } catch (error) {
      console.error(
        "ORDER SUCCESS LOAD ERROR:",
        error
      );
    }
  }

  return (
    <main className="min-h-[80vh] px-6 py-10 md:px-10 lg:px-16">

      <div className="max-w-4xl mx-auto">

        {/* SUCCESS HEADER */}
        <div className="text-center mb-10">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <span className="text-4xl text-green-600">
              ✓
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Order Confirmed!
          </h1>

          <p className="text-gray-500 text-lg mt-3">
            Thank you for shopping with Cartiva.
            Your order has been placed successfully.
          </p>

        </div>

        {!order ? (
          /* ORDER NOT FOUND */
          <div className="border rounded-2xl p-8 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Order Details Unavailable
            </h2>

            <p className="text-gray-500 mb-6">
              Your order may still have been placed,
              but its details could not be loaded.
            </p>

            {orderId && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold break-all mt-1">
                  {orderId}
                </p>
              </div>
            )}

          </div>
        ) : (
          <>
            {/* ORDER INFORMATION */}
            <section className="border rounded-2xl p-6 md:p-8 mb-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-bold break-all mt-1">
                    {String(order._id)}
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                  {order.status}
                </span>

              </div>

              {/* CUSTOMER */}
              <div className="grid md:grid-cols-2 gap-8">

                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Customer Information
                  </h2>

                  <div className="space-y-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Name
                      </p>

                      <p className="font-semibold">
                        {order.customer?.firstName}{" "}
                        {order.customer?.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Email
                      </p>

                      <p className="font-semibold break-all">
                        {order.customer?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Phone
                      </p>

                      <p className="font-semibold">
                        {order.customer?.phone}
                      </p>
                    </div>

                  </div>
                </div>

                {/* SHIPPING */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Shipping Address
                  </h2>

                  <div className="space-y-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Address
                      </p>

                      <p className="font-semibold">
                        {order.shippingAddress?.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        City
                      </p>

                      <p className="font-semibold">
                        {order.shippingAddress?.city}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Postal Code
                      </p>

                      <p className="font-semibold">
                        {order.shippingAddress?.postalCode}
                      </p>
                    </div>

                  </div>
                </div>

              </div>

            </section>


            {/* ORDERED PRODUCTS */}
            <section className="border rounded-2xl overflow-hidden mb-8">

              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">
                  Ordered Products
                </h2>
              </div>

              <div className="divide-y">

                {order.items?.map(
                  (item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                    >

                      {/* IMAGE */}
                      <div className="w-24 h-24 border rounded-xl flex items-center justify-center overflow-hidden shrink-0">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-3xl">
                            📦
                          </span>
                        )}

                      </div>

                      {/* PRODUCT */}
                      <div className="flex-1">

                        <h3 className="font-bold text-lg">
                          {item.name}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                      </div>

                      {/* PRICE */}
                      <div className="sm:text-right">

                        <p className="text-sm text-gray-500">
                          Price
                        </p>

                        <p className="font-semibold">
                          $
                          {Number(
                            item.price || 0
                          ).toFixed(2)}
                        </p>

                      </div>

                      {/* ITEM TOTAL */}
                      <div className="sm:text-right sm:min-w-28">

                        <p className="text-sm text-gray-500">
                          Total
                        </p>

                        <p className="font-bold">
                          $
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 1
                            )
                          ).toFixed(2)}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </section>


            {/* PAYMENT + SUMMARY */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">

              {/* PAYMENT */}
              <section className="border rounded-2xl p-6">

                <h2 className="text-xl font-bold mb-5">
                  Payment
                </h2>

                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <p className="font-semibold mt-1">
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </p>

              </section>

              {/* SUMMARY */}
              <section className="border rounded-2xl p-6">

                <h2 className="text-xl font-bold mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      $
                      {Number(
                        order.subtotal || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Shipping
                    </span>

                    <span className="font-semibold">
                      $
                      {Number(
                        order.shipping || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4 flex justify-between">

                    <span className="text-lg font-bold">
                      Total
                    </span>

                    <span className="text-xl font-bold">
                      $
                      {Number(
                        order.total || 0
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </section>

            </div>


            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4">

              <Link
                href="/orders"
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg text-center hover:bg-gray-800 transition"
              >
                View My Orders
              </Link>

              <Link
                href="/products"
                className="flex-1 border border-black px-6 py-3 rounded-lg text-center hover:bg-gray-100 transition"
              >
                Continue Shopping
              </Link>

            </div>
          </>
        )}

      </div>

    </main>
  );
}