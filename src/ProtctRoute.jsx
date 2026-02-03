import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );
  }

  // 1. Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Extract role from URL (Handles both /parent-dashboard and /parent/dashboard)
  const currentPath = location.pathname;

  if (currentPath.includes('-dashboard')) {
    // Extract 'parent' from '/parent-dashboard'
    const requiredRole = currentPath.split('-')[0].replace('/', '');

    // Safety Check: Check if userData role matches URL role
    if (userData?.role !== requiredRole) {
      console.error(`Security Block: Path needs ${requiredRole}, but user is ${userData?.role}`);
      return <Navigate to="/" replace />;
    }
  }

  // 3. Admin/Subadmin check
  if (currentPath.includes('/admin')) {
    if (userData?.role !== 'admin' && userData?.role !== 'subadmin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;