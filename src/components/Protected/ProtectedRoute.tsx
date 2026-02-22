// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  return document.cookie.includes("access_token=");
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;