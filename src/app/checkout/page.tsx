"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay?: new (
      options: Record<string, unknown>
    ) => RazorpayInstance;
  }
}

type RazorpayInstance = {
  open: () => void;

  on: (
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailedResponse) => void
  ) => void;
};

type GuestDetails = {
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
};

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailedResponse = {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

const blankGuestDetails: GuestDetails = {
  name: "",
  email: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(Boolean(window.Razorpay))
      );

      existingScript.addEventListener("error", () =>
        resolve(false)
      );

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () =>
      resolve(Boolean(window.Razorpay));

    script.onerror = () =>
      resolve(false);

    document.body.appendChild(script);
  });

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    subtotal,
    shipping,
    total,
    clearCart,
  } = useCart();

  const [guest, setGuest] =
    useState<GuestDetails>(
      blankGuestDetails
    );

  const [error, setError] =
    useState("");

  const [paying, setPaying] =
    useState(false);

  const idempotencyKey =
    useRef("");

  const updateGuest = (
    field: keyof GuestDetails,
    value: string
  ) => {
    setGuest((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const startCheckout = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!cart.length) {
      router.replace("/shop");
      return;
    }

    if (!guest.name.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        guest.email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!/^\d{10}$/.test(guest.phone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (
      guest.addressLine.trim().length < 8
    ) {
      setError(
        "Please enter your complete delivery address."
      );
      return;
    }

    if (guest.city.trim().length < 2) {
      setError(
        "Please enter your city."
      );
      return;
    }

    if (guest.state.trim().length < 2) {
      setError(
        "Please enter your state."
      );
      return;
    }

    if (!/^\d{6}$/.test(guest.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    setPaying(true);

    try {
      /*
       * Generate the idempotency key only once
       * for this checkout attempt.
       */
      if (!idempotencyKey.current) {
        idempotencyKey.current =
          window.crypto?.randomUUID?.() ||
          `${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`;
      }

      const payload = {
        cart: cart.map(
          ({ id, size, quantity }) => ({
            id,
            size,
            quantity,
          })
        ),

        address: {
          name: guest.name.trim(),

          email:
            guest.email
              .trim()
              .toLowerCase(),

          phone: guest.phone,

          addressLine:
            guest.addressLine.trim(),

          city:
            guest.city.trim(),

          state:
            guest.state.trim(),

          pincode:
            guest.pincode,

          landmark:
            guest.landmark.trim(),
        },

        paymentMethod:
          "RAZORPAY",
      };

      /*
       * Create local order + Razorpay order.
       */
      const response = await fetch(
        "/api/checkout",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            "Idempotency-Key":
              idempotencyKey.current,
          },

          body:
            JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to start payment."
        );
      }

      /*
       * Load Razorpay Checkout.
       */
      if (
        !(await loadRazorpay()) ||
        !window.Razorpay
      ) {
        throw new Error(
          "Secure payment window could not load. Please check your internet connection and try again."
        );
      }

      const razorpay =
        new window.Razorpay({
          key: data.key,

          amount:
            data.amount,

          currency:
            data.currency,

          name:
            "Jannat Elegance",

          description:
            "Secure order payment",

          order_id:
            data.razorpayOrderId,

          prefill: {
            name:
              guest.name.trim(),

            email:
              guest.email.trim(),

            contact:
              guest.phone,
          },

          notes: {
            orderId:
              data.orderId,

            customerOrderId:
              data.customerOrderId,
          },

          theme: {
            color: "#5c0620",
          },

          modal: {
            ondismiss: () => {
              console.log(
                "[RAZORPAY] Checkout dismissed by customer."
              );

              setPaying(false);
            },
          },

          handler: async (
            payment: RazorpayPaymentResponse
          ) => {
            /*
             * IMPORTANT:
             * Do NOT clear the cart here.
             *
             * Cart is cleared only after backend
             * successfully verifies the payment.
             */

            console.log(
              "========== RAZORPAY PAYMENT SUCCESS =========="
            );

            console.log(
              "Payment ID:",
              payment.razorpay_payment_id
            );

            console.log(
              "Razorpay Order ID:",
              payment.razorpay_order_id
            );

            console.log(
              "Signature received:",
              Boolean(
                payment.razorpay_signature
              )
            );

            console.log(
              "==============================================="
            );

            try {
              const verifyResponse =
                await fetch(
                  "/api/checkout/verify",
                  {
                    method: "POST",

                    credentials:
                      "include",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify(
                        payment
                      ),
                  }
                );

              const verified =
                await verifyResponse.json();

              if (
                !verifyResponse.ok
              ) {
                throw new Error(
                  verified?.error ||
                    "Payment verification failed. Please contact support."
                );
              }

              /*
               * Backend has confirmed payment.
               * It is now safe to clear the cart.
               */
              clearCart();

              router.replace(
                `/checkout/success?orderId=${encodeURIComponent(
                  verified.orderId
                )}`
              );
            } catch (
              verificationError
            ) {
              console.error(
                "========== PAYMENT VERIFICATION ERROR =========="
              );

              console.error(
                verificationError
              );

              console.error(
                "==============================================="
              );

              setError(
                verificationError instanceof
                  Error
                  ? verificationError.message
                  : "Payment verification failed. Please contact support."
              );

              setPaying(false);
            }
          },
        });

      /*
       * =====================================================
       * RAZORPAY PAYMENT FAILED
       *
       * This is the important diagnostic section.
       * =====================================================
       */

      razorpay.on(
        "payment.failed",
        async (
          response: RazorpayPaymentFailedResponse
        ) => {
          const razorpayError =
            response?.error || {};

          const paymentId =
            razorpayError?.metadata
              ?.payment_id;

          const razorpayOrderId =
            razorpayError?.metadata
              ?.order_id ||
            data.razorpayOrderId;

          console.error(
            "========== RAZORPAY PAYMENT FAILED =========="
          );

          console.error(
            "Payment ID:",
            paymentId || "Not provided"
          );

          console.error(
            "Razorpay Order ID:",
            razorpayOrderId ||
              "Not provided"
          );

          console.error(
            "Error Code:",
            razorpayError?.code ||
              "Not provided"
          );

          console.error(
            "Error Description:",
            razorpayError?.description ||
              "Not provided"
          );

          console.error(
            "Error Source:",
            razorpayError?.source ||
              "Not provided"
          );

          console.error(
            "Error Step:",
            razorpayError?.step ||
              "Not provided"
          );

          console.error(
            "Error Reason:",
            razorpayError?.reason ||
              "Not provided"
          );

          console.error(
            "Full Razorpay Error:",
            razorpayError
          );

          console.error(
            "=============================================="
          );

          /*
           * Send the failure information to the backend.
           *
           * The backend will then call Razorpay's API
           * using the secret key and fetch the authoritative
           * payment details.
           */
          if (paymentId) {
            try {
              const diagnosticResponse =
                await fetch(
                  "/api/checkout/payment-failed",
                  {
                    method: "POST",

                    credentials:
                      "include",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        paymentId,

                        orderId:
                          data.orderId,

                        razorpayOrderId,

                        error: {
                          code:
                            razorpayError?.code,

                          description:
                            razorpayError?.description,

                          source:
                            razorpayError?.source,

                          step:
                            razorpayError?.step,

                          reason:
                            razorpayError?.reason,
                        },
                      }),
                  }
                );

              /*
               * Diagnostic failure must never
               * block the customer's UI.
               */
              if (
                !diagnosticResponse.ok
              ) {
                console.warn(
                  "[RAZORPAY] Backend payment-failed logging request returned:",
                  diagnosticResponse.status
                );
              }
            } catch (
              diagnosticError
            ) {
              console.warn(
                "[RAZORPAY] Could not send payment failure diagnostics to backend:",
                diagnosticError
              );
            }
          } else {
            console.warn(
              "[RAZORPAY] No payment ID was supplied by Checkout, so backend payment lookup was skipped."
            );
          }

          /*
           * Do NOT clear the cart.
           */
          setError(
            razorpayError?.description ||
              "Payment failed. Please try again or use another payment method."
          );

          setPaying(false);
        }
      );

      /*
       * Finally open Razorpay.
       */
      razorpay.open();
    } catch (reason) {
      console.error(
        "========== CHECKOUT ERROR =========="
      );

      console.error(reason);

      console.error(
        "===================================="
      );

      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to start payment."
      );

      setPaying(false);
    }
  };

  if (!cart.length) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-maroon-950">
            Your cart is empty
          </h1>

          <button
            onClick={() =>
              router.replace("/shop")
            }
            className="mt-6 rounded-full bg-maroon-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8fa] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
            Shopping Bag → Checkout
          </p>

          <h1 className="mt-2 font-serif text-4xl text-maroon-950">
            Secure Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your delivery details and
            complete your payment securely
            with Razorpay.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <form
            onSubmit={startCheckout}
            className="rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-green-700">
                <Truck size={22} />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-800">
                  Delivery
                </p>

                <p className="font-semibold text-maroon-950">
                  DTDC · Free Shipping
                </p>
              </div>
            </div>

            <h2 className="font-serif text-2xl text-maroon-950">
              Delivery Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              No account or saved address is
              required.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Full Name *
                </label>

                <input
                  required
                  autoComplete="name"
                  value={guest.name}
                  onChange={(event) =>
                    updateGuest(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Email Address *
                </label>

                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={guest.email}
                  onChange={(event) =>
                    updateGuest(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Phone Number *
                </label>

                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={guest.phone}
                  onChange={(event) =>
                    updateGuest(
                      "phone",
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Pincode *
                </label>

                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={guest.pincode}
                  onChange={(event) =>
                    updateGuest(
                      "pincode",
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="6-digit pincode"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Complete Address *
                </label>

                <textarea
                  required
                  autoComplete="street-address"
                  value={guest.addressLine}
                  onChange={(event) =>
                    updateGuest(
                      "addressLine",
                      event.target.value
                    )
                  }
                  placeholder="House / Flat / Street / Area"
                  className="min-h-28 w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  City *
                </label>

                <input
                  required
                  autoComplete="address-level2"
                  value={guest.city}
                  onChange={(event) =>
                    updateGuest(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="City"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  State *
                </label>

                <input
                  required
                  autoComplete="address-level1"
                  value={guest.state}
                  onChange={(event) =>
                    updateGuest(
                      "state",
                      event.target.value
                    )
                  }
                  placeholder="State"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-maroon-900">
                  Landmark
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  value={guest.landmark}
                  onChange={(event) =>
                    updateGuest(
                      "landmark",
                      event.target.value
                    )
                  }
                  placeholder="Nearby landmark"
                  className="w-full rounded-xl border border-maroon-100 bg-white p-3 text-sm outline-none transition focus:border-maroon-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                paying || !cart.length
              }
              className="mt-8 w-full rounded-full bg-maroon-800 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-maroon-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying
                ? "Opening Secure Payment..."
                : `Pay ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck
                size={15}
                className="text-green-600"
              />

              Secure payment powered by
              Razorpay
            </p>
          </form>

          <aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm lg:sticky lg:top-8">
            <h2 className="border-b border-maroon-100 pb-4 font-serif text-2xl text-maroon-950">
              Order Summary
            </h2>

            <div className="divide-y divide-maroon-50">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-3 py-4"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-maroon-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-maroon-950">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Size {item.size} · Qty{" "}
                      {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-bold text-maroon-800">
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 space-y-2 border-t border-maroon-100 pt-4 text-sm">
              <p className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </p>

              <p className="flex justify-between text-gray-600">
                <span>Shipping</span>

                <span>
                  {shipping
                    ? `₹${shipping.toLocaleString(
                        "en-IN"
                      )}`
                    : "Free"}
                </span>
              </p>

              <p className="flex justify-between pt-2 text-lg font-bold text-maroon-950">
                <span>Total</span>

                <span>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}