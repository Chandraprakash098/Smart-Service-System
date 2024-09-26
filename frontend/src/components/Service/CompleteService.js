import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";

const CompleteService = () => {
  const [service, setService] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role !== "service_provider") {
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

  const handleComplete = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.patch(`/service/${id}/status`, { status: "completed", notes });
      navigate("/services");
    } catch (error) {
      console.error("Error completing service:", error);
      setError("Failed to complete service. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!service)
    return <div className="text-center py-6">Service not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Complete Service
      </h2>
      <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-6">
        <p className="text-lg">
          <strong>Service Type:</strong> {service.type}
        </p>
        <p className="text-lg">
          <strong>Description:</strong> {service.description}
        </p>
        <p className="text-lg">
          <strong>Status:</strong> {service.status}
        </p>
        <p className="text-lg">
          <strong>Scheduled Date:</strong>{" "}
          {new Date(service.scheduledDate).toLocaleDateString()}
        </p>
      </div>

      <form onSubmit={handleComplete} className="space-y-4">
        <div className="form-group">
          <label
            htmlFor="notes"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Completion Notes:
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
        >
          Complete Service
        </button>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      <button
        onClick={() => navigate("/services")}
        className="mt-4 w-full text-center bg-gray-500 text-white py-2 rounded-md shadow-md hover:bg-gray-600 transition-all"
      >
        Back to Services
      </button>
    </div>
  );
};

export default CompleteService;
