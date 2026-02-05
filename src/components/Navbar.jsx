import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // 1. Theme Hook
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react"; // 2. Icons
import logo from "../assets/logo.webp";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // 3. Theme State
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [setIsLoggedIn]);

  const handleLogout = async () => {
    setShowDropdown(false);
    await signOut(auth);
    navigate("/signin");
  };

  const getLinkStyle = (path) => {
    const normalizedCurrent = location.pathname.replace(/\/$/, "").toLowerCase() || "/";
    const normalizedPath = path.replace(/\/$/, "").toLowerCase() || "/";
    const isActive = normalizedCurrent === normalizedPath;

    // Added dark:text-gray-300 and dark:hover:bg-slate-800
    const baseClasses = "px-3 py-1.5 rounded-md transition-all whitespace-nowrap text-xs lg:text-sm font-bold tracking-tight";

    return isActive
        ? `${baseClasses} bg-blue-600 text-white shadow-lg ring-1 ring-blue-400`
        : `${baseClasses} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800`;
  };

  return (
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-slate-900 shadow-md z-50 flex justify-between items-center px-4 py-3 border-b dark:border-slate-800 transition-colors duration-300">

        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">New Education Era</span>
        </div>

        <div className="flex items-center gap-1 lg:gap-2 flex-grow justify-center">
          <Link to="/" className={getLinkStyle("/")}>Home</Link>
          <Link to="/about" className={getLinkStyle("/about")}>About</Link>
          <Link to="/contact" className={getLinkStyle("/contact")}>Contact Us</Link>

          {/* UPDATED: Only show these operational tools to the Teacher */}
          {isLoggedIn && userData?.role === 'teacher' && (
              <>
                <Link to="/early-warning" className={getLinkStyle("/early-warning")}>Early Warning</Link>
                <Link to="/dropout-analytics" className={getLinkStyle("/dropout-analytics")}>Dropout Analytics</Link>
                <Link to="/student-monitoring" className={getLinkStyle("/student-monitoring")}>Student Monitoring</Link>
              </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 border-l dark:border-slate-800 pl-3 ml-2 relative">
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:ring-2 hover:ring-blue-400">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn && userData ? (
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowDropdown(!showDropdown)}>
                <div className="text-right hidden md:block">
                  <p className="text-gray-800 dark:text-white font-extrabold text-[11px] leading-none uppercase group-hover:text-blue-600">
                    {userData.name}
                  </p>
                  <p className="text-[9px] uppercase text-gray-400 font-bold">({userData.role})</p>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl rounded-xl py-2 z-50">
                      <Link
                          to={userData.role === 'admin' ? '/admin' : `/${userData.role}-dashboard`}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-bold"
                          onClick={() => setShowDropdown(false)}
                      >
                        📊 View Dashboard
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">
                        Logout
                      </button>
                    </div>
                )}
              </div>
          ) : (
              <button onClick={() => navigate("/signin")} className="border-2 border-blue-600 text-blue-600 px-4 py-1 rounded-md text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Sign In</button>
          )}

          {isLoggedIn && userData?.role === 'admin' && (
              <Link to="/admin" className="bg-red-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-pulse hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
                Command Center
              </Link>
          )}
        </div>
      </nav>
  );
};

export default Navbar;