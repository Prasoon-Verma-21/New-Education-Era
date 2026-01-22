import React from "react";
import { Users, Settings, UserPlus, Shield, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";



const SideNav = ({ onPageChange, currentPage }) => {
  // const user = { role: "subAdmin", name: "Ayush" };
  // const user = { role: "admin", name: "Rahul"};
  // const user = { role: "subAdmin", name: "Manoj"};

   const {user, loading} = useAuth()

  return (
    <div className="w-64 bg-gray-800 text-white h-screen  left-0 mt-1 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-semibold">Name: {user.name} <hr /> Role: {user.userType}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span>{user.name}</span>
        
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onPageChange("dashboard")}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
              currentPage === "dashboard"
                ? "text-blue-400 bg-gray-900"
                : "hover:bg-gray-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <div className="mt-4">
            <div className="space-y-2">
{/* SUPER ADMIN CASE */}
              {user.userType === "superAdmin" && (
                <>
                  <button
                    onClick={() => onPageChange("superadmins")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "superadmins"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>SuperAdmins</span>
                  </button>

                  <button
                onClick={() => onPageChange("admins")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                  currentPage === "admins"
                    ? "text-blue-400 bg-gray-900"
                    : "hover:bg-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Admins(Principal)</span>
              </button>
              <button
                onClick={() => onPageChange("subadmins")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                  currentPage === "subadmins"
                    ? "text-blue-400 bg-gray-900"
                    : "hover:bg-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>SubAdmins (Class Teacher)</span>
              </button>
              
                 
                    <button
                    onClick={() => onPageChange("parents")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "parents"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Parents</span>
                  </button>

                  <button
                    onClick={() => onPageChange("students")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "students"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Students</span>
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={() => onPageChange("admin-approval")}
                      className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                        currentPage === "admin-approval"
                          ? "text-blue-400 bg-gray-900"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5" />
                          <span>Admin Approval</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
 {/*  ADMIN CASE */}
 {user.userType === "admin" && (
                <>
           
              <button
                onClick={() => onPageChange("subadmins")}
                className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                  currentPage === "subadmins"
                    ? "text-blue-400 bg-gray-900"
                    : "hover:bg-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>SubAdmins</span>
              </button>
              {/* <button
                    onClick={() => onPageChange("parents")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "parents"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Parents</span>
                  </button> */}
              </>
               )}

 {/* SUB ADMIN CASE */}
              {user.userType === "subadmin" && (
                <>
                  <button
                    onClick={() => onPageChange("parents")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "parents"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Parents</span>
                  </button>

                  <button
                    onClick={() => onPageChange("students")}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg ${
                      currentPage === "students"
                        ? "text-blue-400 bg-gray-900"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Students</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
