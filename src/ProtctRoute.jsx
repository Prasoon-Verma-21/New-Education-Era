import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const {user, loading} = useAuth()
  const location = useLocation();

  if(loading) {
    return (
      <div className="flex justify-center mx-auto items-center">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    )
  }

  if (!isLoggedIn) {
    // Redirect to login page if not authenticated
    return <Navigate to="/signup" replace />;
  }

  const isDashboardRoute = location.pathname.includes('/dashboard');
  if(isDashboardRoute) {
    const pathUserType = location.pathname.split('/')[1];
    if (!user || user.userType !== pathUserType) {
        return <Navigate to='/' replace />;
    }
  }

  const isAdmin = location.pathname.includes('/admin');
  if(isAdmin) {
    if (!user || user.userType !== 'admin' && user.userType !== 'subadmin') {
        return <Navigate to='/' replace />;
    }
  } 

  return children;
};

export default ProtectedRoute;