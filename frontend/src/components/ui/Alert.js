// src/components/ui/Alert.js
import React from "react";

const Alert = ({ className, children }) => (
  <div className={`p-4 rounded-lg shadow-md ${className}`}>{children}</div>
);

const AlertTitle = ({ className, children }) => (
  <h2 className={`font-bold text-lg ${className}`}>{children}</h2>
);

const AlertDescription = ({ className, children }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);

export { Alert, AlertTitle, AlertDescription };
