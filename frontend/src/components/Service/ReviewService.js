import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";
import { StarIcon } from "@heroicons/react/solid";

const ReviewService = () => {
  const [service, setService] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role !== "resident") {
      navigate("/");
    } else {
      fetchService();
    }
  }, [user, navigate]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/service/${id}`);
      setService(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching service:", error);
      setError("Failed to load service data. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/service/${id}/review`, { rating, review });
      navigate("/services");
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        {error}
      </div>
    );

  if (!service)
    return <div className="text-center text-gray-600">Service not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Review Service
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">Service Details</h3>
              <p>
                <strong>Type:</strong> {service.type}
              </p>
              <p>
                <strong>Description:</strong> {service.description}
              </p>
              <p>
                <strong>Status:</strong> {service.status}
              </p>
              <p>
                <strong>Completed Date:</strong>{" "}
                {new Date(service.completedDate).toLocaleDateString()}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating:
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <StarIcon
                      key={value}
                      className={`h-8 w-8 ${
                        value <= rating ? "text-yellow-400" : "text-gray-300"
                      } cursor-pointer`}
                      onClick={() => setRating(value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Review:
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  rows="4"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Write your review here..."
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Services
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Review
                </button>
              </div>
            </form>
            {error && <div className="mt-4 text-red-600">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewService;
