import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import UtilityList from "./components/Utility/UtilityList";
import UtilityForm from "./components/Utility/UtilityForm";
import ServiceList from "./components/Service/ServiceList";
import ServiceForm from "./components/Service/ServiceForm";
import PaymentList from "./components/Payment/PaymentList";
import PaymentForm from "./components/Payment/PaymentForm";
import ReportView from "./components/Report/ReportView";
import AssignServiceProvider from "./components/Service/AssignServiceProvider";
import ReviewService from "./components/Service/ReviewService";
import StartService from "./components/Service/StartService";
import CompleteService from "./components/Service/CompleteService";
import Home from "./components/page/Home";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/utilities"
                element={
                  <PrivateRoute>
                    <UtilityList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/utilities/new"
                element={
                  <PrivateRoute>
                    <UtilityForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <PrivateRoute>
                    <ServiceList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services/new"
                element={
                  <PrivateRoute>
                    <ServiceForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services/:id/assign"
                element={
                  <PrivateRoute>
                    <AssignServiceProvider />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services/:id/review"
                element={
                  <PrivateRoute>
                    <ReviewService />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services/:id/start"
                element={
                  <PrivateRoute>
                    <StartService />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services/:id/complete"
                element={
                  <PrivateRoute>
                    <CompleteService />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <PrivateRoute>
                    <PaymentList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payments/new"
                element={
                  <PrivateRoute>
                    <PaymentForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <ReportView />
                  </PrivateRoute>
                }
              />

              <Route
                path="/payments/new"
                element={
                  <PrivateRoute>
                    <PaymentForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </Elements>
    </AuthProvider>
  );
};

export default App;
