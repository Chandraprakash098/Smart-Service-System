import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import  {AuthContext}  from "../contexts/AuthContext";

const PrivateRoute = ({ element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
