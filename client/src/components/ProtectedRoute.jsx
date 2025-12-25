import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/auth/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
