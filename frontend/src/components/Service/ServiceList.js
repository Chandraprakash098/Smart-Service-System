import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";

const ServiceList = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/service");
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services. Please try again later.");
      setLoading(false);
    }
  };

  const handleAssign = async (serviceId, serviceProviderId) => {
    try {
      await api.patch(`/service/${serviceId}/assign`, { serviceProviderId });
      fetchServices();
    } catch (error) {
      console.error("Error assigning service:", error);
      setError("Failed to assign service. Please try again.");
    }
  };

  const handleUpdateStatus = async (serviceId, status) => {
    try {
      await api.patch(`/service/${serviceId}/status`, { status });
      fetchServices();
    } catch (error) {
      console.error("Error updating service status:", error);
      setError("Failed to update service status. Please try again.");
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
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
                Services
              </h2>
              {user.role === "resident" && (
                <Link
                  to="/services/new"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto text-center"
                >
                  Request New Service
                </Link>
              )}
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-hidden">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white shadow-md rounded-lg mb-4 p-4"
                    >
                      <div className="mb-2">
                        <span className="font-semibold">Type:</span>{" "}
                        {service.type}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Description:</span>{" "}
                        {service.description}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Status:</span>
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : service.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Scheduled Date:</span>
                        {service.scheduledDate
                          ? new Date(service.scheduledDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {user.role === "admin" &&
                        service.status === "pending" && (
                          <div className="mt-2">
                            <select
                              onChange={(e) =>
                                handleAssign(service._id, e.target.value)
                              }
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Assign to...</option>
                              {/* Add options for service providers here */}
                            </select>
                          </div>
                        )}
                      {user.role === "service_provider" &&
                        service.status !== "completed" && (
                          <div className="mt-2">
                            <select
                              value={service.status}
                              onChange={(e) =>
                                handleUpdateStatus(service._id, e.target.value)
                              }
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="assigned">Assigned</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-blue-600 py-4 mt-auto">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-white text-center sm:text-left mb-4 sm:mb-0">
            &copy; 2024 SmartUtility. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
            <a href="#" className="text-white hover:underline mb-2 sm:mb-0">
              Privacy Policy
            </a>
            <a href="#" className="text-white hover:underline mb-2 sm:mb-0">
              Terms of Service
            </a>
            <a href="#" className="text-white hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceList;
