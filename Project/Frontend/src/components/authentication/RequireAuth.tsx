import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles: string[]; // Define allowed roles
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole"); // Get role from localStorage

    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    if (!allowedRoles.includes(userRole || "")) {
      navigate("/login"); // Redirect to unauthorized page if role mismatch
      return;
    }
  }, [navigate, allowedRoles]);

  return children; // If authenticated & authorized, render children
};

export default RequireAuth;
