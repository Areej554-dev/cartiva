"use client";

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CancelIcon({ className = "h-5 w-5" }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export default function OrderTracker({ status }) {
  const steps = [
    {
      name: "Order Placed",
      description: "Your order has been received",
    },
    {
      name: "Processing",
      description: "Your order is being prepared",
    },
    {
      name: "Shipped",
      description: "Your order is on the way",
    },
    {
      name: "Delivered",
      description: "Your order has been delivered",
    },
  ];

  const getCurrentStep = () => {
    switch (status) {
      case "Pending":
        return 0;

      case "Shipped":
        return 2;

      case "Delivered":
        return 3;

      case "Cancelled":
        return -1;

      default:
        return 0;
    }
  };

  const currentStep = getCurrentStep();

  // =========================================
  // CANCELLED
  // =========================================

  if (status === "Cancelled") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6">
        <div className="flex items-start gap-3">

          <div className="mt-0.5 shrink-0 text-red-500">
            <CancelIcon />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-red-700 sm:text-xl">
              Order Cancelled
            </h2>

            <p className="mt-1 text-sm leading-6 text-red-600 sm:text-base">
              This order has been cancelled.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E9DED6] bg-white p-4 sm:p-6 md:p-8">

      <div className="mb-7 sm:mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#E98B50]">
          Progress
        </p>

        <h2 className="mt-1 text-xl font-bold text-[#2D2723] sm:text-2xl">
          Order Status
        </h2>
      </div>

      {/* =====================================
          MOBILE TRACKER
      ====================================== */}

      <div className="sm:hidden">

        <div className="relative space-y-5">

          {/* Vertical line */}

          <div className="absolute bottom-6 left-5 top-6 w-1 -translate-x-1/2 rounded-full bg-[#E9DED6]" />

          <div
            className="absolute left-5 top-6 w-1 -translate-x-1/2 rounded-full bg-[#E98B50] transition-all duration-500"
            style={{
              height:
                currentStep <= 0
                  ? "0%"
                  : `${(currentStep / (steps.length - 1)) * 100}%`,
              maxHeight: "calc(100% - 48px)",
            }}
          />

          {steps.map((step, index) => {
            const completed =
              index <= currentStep;

            const current =
              index === currentStep;

            return (
              <div
                key={step.name}
                className="relative flex min-w-0 items-start gap-4"
              >

                {/* Circle */}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-xs font-bold ${
                    completed
                      ? "border-[#E98B50] bg-[#E98B50] text-white"
                      : "border-[#E9DED6] bg-white text-[#756C65]"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Text */}

                <div className="min-w-0 pb-1 pt-0.5">

                  <p
                    className={`text-base font-semibold ${
                      current || completed
                        ? "text-[#2D2723]"
                        : "text-[#756C65]"
                    }`}
                  >
                    {step.name}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-[#756C65]">
                    {step.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* =====================================
          TABLET / DESKTOP TRACKER
      ====================================== */}

      <div className="relative hidden sm:block">

        {/* Background line */}

        <div className="absolute left-[6%] right-[6%] top-5 h-1 rounded-full bg-[#E9DED6]" />

        {/* Active line */}

        <div
          className="absolute left-[6%] top-5 h-1 rounded-full bg-[#E98B50] transition-all duration-500"
          style={{
            width:
              currentStep <= 0
                ? "0%"
                : `calc(${(
                    currentStep /
                    (steps.length - 1)
                  ) * 88}%)`,
          }}
        />

        <div className="relative grid grid-cols-4 gap-3">

          {steps.map((step, index) => {
            const completed =
              index <= currentStep;

            const current =
              index === currentStep;

            return (
              <div
                key={step.name}
                className="flex min-w-0 flex-col items-center text-center"
              >

                {/* Circle */}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-xs font-bold ${
                    completed
                      ? "border-[#E98B50] bg-[#E98B50] text-white"
                      : "border-[#E9DED6] bg-white text-[#756C65]"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Text */}

                <p
                  className={`mt-3 text-sm font-semibold ${
                    current || completed
                      ? "text-[#2D2723]"
                      : "text-[#756C65]"
                  }`}
                >
                  {step.name}
                </p>

                <p className="mt-1 max-w-[150px] text-xs leading-5 text-[#756C65]">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}