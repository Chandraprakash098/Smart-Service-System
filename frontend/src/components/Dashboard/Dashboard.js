import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../utils/api";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [user.role]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/dashboard/${user.role}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const DashboardSection = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );

  const ActionLink = ({ to, children, className }) => (
    <Link
      to={to}
      className={`${className} text-sm inline-block mt-2 px-3 py-1 rounded-full`}
    >
      {children}
    </Link>
  );

  const renderDashboard = () => {
    if (!dashboardData)
      return <p className="text-gray-600">Loading dashboard...</p>;

    switch (user.role) {
      case "admin":
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4">
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardSection title="Recent Utility Readings">
                <ul className="space-y-2">
                  {dashboardData.recentUtilities.map((utility) => (
                    <li key={utility._id} className="text-sm">
                      <span className="font-medium">{utility.type}:</span>{" "}
                      {utility.reading} ({utility.status})
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/utilities"
                  className="text-blue-500 hover:bg-blue-100"
                >
                  Manage Utilities
                </ActionLink>
              </DashboardSection>
              <DashboardSection title="Pending Service Requests">
                <ul className="space-y-2">
                  {dashboardData.pendingServices.map((service) => (
                    <li key={service._id} className="text-sm">
                      <span className="font-medium">{service.type}:</span>{" "}
                      {service.status}
                      <ActionLink
                        to={`/services/${service._id}/assign`}
                        className="text-blue-500 hover:bg-blue-100 ml-2"
                      >
                        Assign
                      </ActionLink>
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/services"
                  className="text-blue-500 hover:bg-blue-100"
                >
                  Manage All Services
                </ActionLink>
              </DashboardSection>
              <DashboardSection title="Recent Payments">
                <ul className="space-y-2">
                  {dashboardData.recentPayments.map((payment) => (
                    <li key={payment._id} className="text-sm">
                      <span className="font-medium">${payment.amount}</span> -{" "}
                      {payment.status}
                      <br />
                      <span className="text-blue-600">
                        {payment.userName}
                      </span>{" "}
                      ({payment.userEmail})
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/payments"
                  className="text-blue-500 hover:bg-blue-100"
                >
                  View All Payments
                </ActionLink>
              </DashboardSection>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <ActionLink
                to="/reports"
                className="bg-blue-600 hover:bg-blue-700 text-white text-center flex-grow"
              >
                Generate Reports
              </ActionLink>
              <ActionLink
                to="/home"
                className="bg-gray-600 hover:bg-gray-700 text-white text-center flex-grow"
              >
                Back to Home Page
              </ActionLink>
            </div>
          </>
        );
      case "resident":
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">
              Resident Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardSection title="Your Utility Usage">
                <ul className="space-y-2">
                  {dashboardData.utilities.map((utility) => (
                    <li key={utility._id} className="text-sm">
                      <span className="font-medium">{utility.type}:</span>{" "}
                      {utility.reading} - ${utility.amount}
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/utilities"
                  className="text-green-500 hover:bg-green-100"
                >
                  View Utility History
                </ActionLink>
              </DashboardSection>
              <DashboardSection title="Your Service Requests">
                <ul className="space-y-2">
                  {dashboardData.services.map((service) => (
                    <li key={service._id} className="text-sm">
                      <span className="font-medium">{service.type}:</span>{" "}
                      {service.status}
                      {service.status === "completed" && (
                        <ActionLink
                          to={`/services/${service._id}/review`}
                          className="text-green-500 hover:bg-green-100 ml-2"
                        >
                          Review
                        </ActionLink>
                      )}
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/services"
                  className="text-green-500 hover:bg-green-100"
                >
                  Manage Service Requests
                </ActionLink>
              </DashboardSection>
              <DashboardSection title="Recent Payments">
                <ul className="space-y-2">
                  {dashboardData.payments.map((payment) => (
                    <li key={payment._id} className="text-sm">
                      <span className="font-medium">${payment.amount}</span> -{" "}
                      {payment.status}
                    </li>
                  ))}
                </ul>
                <ActionLink
                  to="/payments"
                  className="text-green-500 hover:bg-green-100"
                >
                  View Payment History
                </ActionLink>
              </DashboardSection>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <ActionLink
                to="/services/new"
                className="bg-green-600 hover:bg-green-700 text-white text-center flex-grow"
              >
                Request New Service
              </ActionLink>
              <ActionLink
                to="/home"
                className="bg-gray-600 hover:bg-gray-700 text-white text-center flex-grow"
              >
                Back to Home Page
              </ActionLink>
            </div>
          </>
        );
      case "service_provider":
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4">
              Service Provider Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DashboardSection title="Assigned Service Requests">
                <ul className="space-y-2">
                  {dashboardData.assignedServices.map((service) => (
                    <li key={service._id} className="text-sm">
                      <span className="font-medium">{service.type}:</span>{" "}
                      {service.status} - {service.scheduledDate}
                      {service.status === "assigned" && (
                        <ActionLink
                          to={`/services/${service._id}/start`}
                          className="text-indigo-500 hover:bg-indigo-100 ml-2"
                        >
                          Start
                        </ActionLink>
                      )}
                      {service.status === "in_progress" && (
                        <ActionLink
                          to={`/services/${service._id}/complete`}
                          className="text-indigo-500 hover:bg-indigo-100 ml-2"
                        >
                          Complete
                        </ActionLink>
                      )}
                    </li>
                  ))}
                </ul>
              </DashboardSection>
              <DashboardSection title="Completed Services">
                <ul className="space-y-2">
                  {dashboardData.completedServices.map((service) => (
                    <li key={service._id} className="text-sm">
                      <span className="font-medium">{service.type}</span> -
                      Completed on: {service.completedDate}
                      {service.status === "confirmed" && service.rating && (
                        <span className="ml-2">Rating: {service.rating}/5</span>
                      )}
                    </li>
                  ))}
                </ul>
              </DashboardSection>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <ActionLink
                to="/services"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-center flex-grow"
              >
                View All Service Requests
              </ActionLink>
              <ActionLink
                to="/home"
                className="bg-gray-600 hover:bg-gray-700 text-white text-center flex-grow"
              >
                Back to Home Page
              </ActionLink>
            </div>
          </>
        );
      default:
        return <p className="text-red-500">Invalid user role</p>;
    }
  };

  return (
    <div className="dashboard max-w-7xl mx-auto mt-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">
          Welcome, {user.name}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
