import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Zap, Calendar, MessageCircle } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105">
    <Icon className="text-blue-600 w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-white text-2xl font-bold sm:text-3xl mb-4 sm:mb-0">
            SmartUtility System
          </h1>
          <nav className="flex space-x-4">
            {user ? (
              // If user is logged in, show Dashboard button
              <button
                onClick={() => navigate("/dashboard")}
                className="text-white bg-blue-500 border border-blue-500 py-2 px-4 rounded-full transition duration-300 hover:bg-white hover:text-blue-600 shadow-lg text-sm sm:text-base"
              >
                Go To Dashboard
              </button>
            ) : (
              // If user is not logged in, show Login and Register buttons
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-white bg-transparent border border-white py-2 px-4 rounded-full transition duration-300 hover:bg-white hover:text-blue-600 shadow-lg text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="text-white bg-blue-500 border border-blue-500 py-2 px-4 rounded-full transition duration-300 hover:bg-white hover:text-blue-600 shadow-lg text-sm sm:text-base"
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <section className="text-center py-12 bg-gray-100 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simplify Your Society Management
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6">
            Effortlessly manage utilities, services, and communication in one
            place.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg sm:text-xl shadow-lg transition duration-300 hover:bg-blue-700"
          >
            Click To Go To Dashboard
          </button>
        </section>

        {/* Features section */}
        <section className="py-12 px-4">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Building}
              title="Smart Utility Tracking"
              description="Monitor and optimize utility usage without complex IoT setups."
            />
            <FeatureCard
              icon={Zap}
              title="Quick Service Booking"
              description="Book maintenance services with just a few taps."
            />
            <FeatureCard
              icon={Calendar}
              title="Streamlined Billing"
              description="Automated billing and easy payment options for residents."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Unified Communication"
              description="Stay connected with management and neighbors effortlessly."
            />
          </div>
        </section>

        {/* Info section */}
        <section className="bg-gray-100 py-12 px-4">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">For Residents</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Easy utility tracking and bill payments</li>
                <li>Quick service requests and bookings</li>
                <li>Stay updated with community announcements</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">For Management</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Centralized utility and service management</li>
                <li>Efficient communication with residents</li>
                <li>Simplified billing and payment collection</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 py-4">
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

export default Home;
