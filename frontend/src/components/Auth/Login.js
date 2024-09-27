import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";
import api from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  

  return (
    <>
      <div className="page-container">
        <h1>SmartUtility System</h1>
        <div className="login-container">
          <form onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
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
    </>
  );
};

export default Login;
