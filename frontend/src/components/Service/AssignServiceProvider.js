import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";

const AssignServiceProvider = () => {
  const [service, setService] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [serviceResponse, providersResponse] = await Promise.all([
        api.get(`/service/${id}`),
        api.get("/dashboard/service-providers"),
      ]);
      setService(serviceResponse.data);
      setServiceProviders(providersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load necessary data. Please try again.");
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.patch(`/service/${id}/assign`, {
        serviceProviderId: selectedProvider,
      });
      navigate("/services");
    } catch (error) {
      console.error("Error assigning service provider:", error);
      setError("Failed to assign service provider. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
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
    return <div className="text-center text-gray-700">Service not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Assign Service Provider
      </h2>
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p className="mb-2">
          <span className="font-semibold">Service Type:</span> {service.type}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Description:</span>{" "}
          {service.description}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Status:</span> {service.status}
        </p>
        <p>
          <span className="font-semibold">Scheduled Date:</span>{" "}
          {new Date(service.scheduledDate).toLocaleDateString()}
        </p>
      </div>
      <form onSubmit={handleAssign} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="serviceProvider"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Service Provider:
          </label>
          <select
            id="serviceProvider"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            required
            className="block shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
          >
            <option value="">Choose a service provider</option>
            {serviceProviders.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!selectedProvider}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !selectedProvider && "opacity-50 cursor-not-allowed"
          }`}
        >
          Assign Provider
        </button>
      </form>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}
      <button
        onClick={() => navigate("/services")}
        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back to Services
      </button>
    </div>
  );
};

export default AssignServiceProvider;
