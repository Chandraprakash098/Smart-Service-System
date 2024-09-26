import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";

const StartService = () => {
  const [service, setService] = useState(null);
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

  const handleStart = async () => {
    setError("");
    try {
      await api.patch(`/service/${id}/status`, { status: "in_progress" });
      navigate("/services");
    } catch (error) {
      console.error("Error starting service:", error);
      setError("Failed to start service. Please try again.");
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!service)
    return <div className="text-center text-lg">Service not found.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Start Service</h2>
      <div className="space-y-4">
        <div>
          <strong className="block font-semibold">Service Type:</strong>
          <p className="text-gray-700">{service.type}</p>
        </div>
        <div>
          <strong className="block font-semibold">Description:</strong>
          <p className="text-gray-700">{service.description}</p>
        </div>
        <div>
          <strong className="block font-semibold">Status:</strong>
          <p className="text-gray-700">{service.status}</p>
        </div>
        <div>
          <strong className="block font-semibold">Scheduled Date:</strong>
          <p className="text-gray-700">
            {new Date(service.scheduledDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Start Service
        </button>
        <button
          onClick={() => navigate("/services")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Back to Services
        </button>
      </div>
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
    </div>
  );
};

export default StartService;
