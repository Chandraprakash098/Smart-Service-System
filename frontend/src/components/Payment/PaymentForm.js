import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../../utils/api";
import { Lock } from "lucide-react";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Payment system has not loaded yet. Please try again.");
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent
      const {
        data: { clientSecret },
      } = await api.post("/payment/create-payment-intent", {
        amount: parseFloat(amount),
      });

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Create payment record
      const paymentData = {
        amount: parseFloat(amount),
        paymentMethod: "debit_card",
        paymentIntentId: result.paymentIntent.id,
        // Remove type, utilityId, and serviceId
      };

      const response = await api.post("/payment", paymentData);
      console.log("Payment created:", response.data);

      setSuccess(true);
      setTimeout(
        () => navigate("/payments", { state: { newPayment: true } }),
        3000
      );
    } catch (error) {
      console.error("Error making payment:", error);
      setError(
        error.message || "An error occurred while processing your payment."
      );
    }

    setProcessing(false);
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-600">
            Thank you for your payment. You will be redirected shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto p-8 bg-white shadow-md rounded-lg space-y-6"
      >
        <div className="flex items-center justify-center mb-6">
          <Lock className="text-gray-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Secure Payment</h2>
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1 "
          >
            Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-black text-blue-600"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="card-element"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Credit or debit card
          </label>
          <div className="mt-1">
            <CardElement
              id="card-element"
              options={cardStyle}
              className="p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {processing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
