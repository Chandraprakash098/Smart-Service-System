import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { RefreshCw } from "lucide-react";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/payment");
      setPayments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    if (location.state?.newPayment) {
      fetchPayments();
    }
  }, [location.state, fetchPayments]);

  const handleRefresh = () => {
    fetchPayments();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Payments</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center"
          disabled={loading}
        >
          <RefreshCw className="mr-2" size={18} />
          Refresh
        </button>
        <Link
          to="/payments/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Make New Payment
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b">
                    <td className="px-4 py-2">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">${payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          payment.status === "completed"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
