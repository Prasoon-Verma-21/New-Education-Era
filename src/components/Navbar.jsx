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
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-950/50 z-50 flex justify-between items-center px-4 py-3 border-b dark:border-slate-800 transition-colors duration-300">

        {/* 1. LOGO SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">New Education Era</span>
        </div>

        {/* 2. CENTER LINKS (Full Restoration) */}
        <div className="flex items-center gap-1 lg:gap-2 flex-grow justify-center">
          <Link to="/" className={getLinkStyle("/")}>Home</Link>
          <Link to="/about" className={getLinkStyle("/about")}>About</Link>
          <Link to="/contact" className={getLinkStyle("/contact")}>Contact Us</Link>

          {isLoggedIn && (userData?.role === 'teacher' || userData?.role === 'admin' || userData?.role === 'subadmin') && (
              <>
                <Link to="/early-warning" className={getLinkStyle("/early-warning")}>Early Warning</Link>
                <Link to="/dropout-analytics" className={getLinkStyle("/dropout-analytics")}>Dropout Analytics</Link>
                <Link to="/student-monitoring" className={getLinkStyle("/student-monitoring")}>Student Monitoring</Link>
              </>
          )}
        </div>

        {/* 3. PROFILE & THEME TOGGLE */}
        <div className="flex items-center gap-3 flex-shrink-0 border-l dark:border-slate-800 pl-3 ml-2 relative">

          {/* THEME TOGGLE BUTTON */}
          <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 transition-all hover:ring-2 hover:ring-blue-400"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isLoggedIn && userData ? (
              <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="text-right hidden md:block">
                  {userData.school && (
                      <p className="text-[9px] font-bold text-blue-500 uppercase leading-none mb-0.5">
                        {userData.school}
                      </p>
                  )}
                  <p className="text-gray-800 dark:text-white font-extrabold text-[11px] leading-none uppercase group-hover:text-blue-600">
                    {userData.username || userData.name}
                  </p>
                  <p className="text-[9px] uppercase text-gray-400 font-bold">({userData.role})</p>
                </div>

                <svg
                    className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>

                {showDropdown && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl rounded-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
                      <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Account Menu</p>
                      </div>

                      <Link
                          to={userData.role === 'admin' ? '/admin' : `/${userData.role}-dashboard`}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 font-bold"
                          onClick={() => setShowDropdown(false)}
                      >
                        📊 View Dashboard
                      </Link>

                      <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                      <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold"
                      >
                        Logout
                      </button>
                    </div>
                )}
              </div>
          ) : (
              <button onClick={() => navigate("/signin")} className="border-2 border-blue-600 text-blue-600 px-4 py-1 rounded-md text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                Sign In
              </button>
          )}
        </div>
      </nav>
  );
};

export default Navbar;