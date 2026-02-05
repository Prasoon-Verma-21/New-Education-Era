import React, { useState } from "react";
import {
    Users, Shield, Home, ChevronDown, ChevronRight,
    GraduationCap, UserCircle, MapPin, UserCog,
    LogOut // Added LogOut icon
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "./LogoutModal";
import { auth } from "../../firebase"; // Added for logout functionality [cite: 2026-01-21]
import { signOut } from "firebase/auth"; // Added for logout functionality [cite: 2026-01-21]

const SideNav = ({ onPageChange, currentPage }) => {
    // Added setIsLoggedIn to destructuring to handle session termination [cite: 2026-01-21]
    const { userData, loading, setIsLoggedIn } = useAuth();
    const [isAccountsOpen, setIsAccountsOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false); // State for the new modal

    if (loading || !userData) {
        return <div className="w-64 bg-[#1a222f] h-screen animate-pulse" />;
    }

    const { logout } = useAuth();

    const handleFinalLogout = async () => {
        try {
            await logout(); // Calls the optimized cleanup logic
            setIsLogoutOpen(false); // Closes the confirmation modal
        } catch (error) {
            console.error("Logout Sync Error:", error);
        }
    };

    return (
        <div className="w-64 bg-[#1a222f] text-white h-screen fixed left-0 top-0 overflow-y-auto z-50 flex flex-col justify-between">
            <div>
                {/* RESTORED HEADER DESIGN */}
                <div className="p-6 border-b border-gray-700/50">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600/10 rounded-lg">
                                <Shield className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Name:</p>
                                <p className="text-sm font-black truncate w-32">{userData?.name || "Admin 1"}</p>
                            </div>
                        </div>
                        <div className="pl-12">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Role:</p>
                            <p className="text-xs font-black text-blue-400 uppercase">{userData?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Admin Avatar Circle */}
                    <div className="flex items-center space-x-3 mb-8 px-2">
                        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm">
                            {userData?.name?.charAt(0) || "A"}
                        </div>
                        <span className="font-bold text-sm">{userData?.name || "Admin 1"}</span>
                    </div>

                    {/* HOME BUTTON */}
                    <button
                        onClick={() => onPageChange("dashboard")}
                        className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
                            currentPage === "dashboard" ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500" : "hover:bg-gray-800 text-gray-400"
                        }`}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Home</span>
                    </button>

                    {/* ACCOUNTS DROPDOWN */}
                    <div>
                        <button
                            onClick={() => setIsAccountsOpen(!isAccountsOpen)}
                            className="flex items-center justify-between w-full p-3 rounded-xl text-gray-400 hover:bg-gray-800 transition-all"
                        >
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5" />
                                <span className="text-xs font-black uppercase tracking-widest">Accounts</span>
                            </div>
                            {isAccountsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                            {isAccountsOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-6 mt-2 space-y-1 overflow-hidden">
                                    {[
                                        { id: "admins", label: "Principals", icon: UserCog },
                                        { id: "subadmins", label: "Teachers", icon: GraduationCap },
                                        { id: "parents", label: "Parents", icon: UserCircle },
                                        { id: "students", label: "Students", icon: Users },
                                        { id: "district_officials", label: "District Officials", icon: MapPin },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => onPageChange(item.id)}
                                            className={`flex items-center space-x-3 w-full p-2.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${
                                                currentPage === item.id ? "text-blue-400 bg-blue-600/10" : "text-gray-500 hover:text-white"
                                            }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* LOGOUT BUTTON SECTION - Added at the bottom for better UX */}
            <div className="p-4 border-t border-gray-700/50">
                <button
                    type="button" // Added type to prevent accidental form submissions
                    onClick={() => setIsLogoutOpen(true)} // THIS MUST ONLY SET THE STATE TO TRUE
                    className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Logout</span>
                </button>
            </div>

            {/* MODAL RENDER */}
            <LogoutModal
                isOpen={isLogoutOpen}
                onConfirm={handleFinalLogout}
                onCancel={() => setIsLogoutOpen(false)}
            />
        </div>
    );
};

export default SideNav;