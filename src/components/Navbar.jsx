import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.webp";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    await signOut(auth);
    navigate("/signin");
  };

  // ROBUST PATH MATCHING LOGIC
  const getLinkStyle = (path) => {
    // Normalize both paths by removing trailing slashes and making lowercase
    const normalizedCurrent = location.pathname.replace(/\/$/, "").toLowerCase() || "/";
    const normalizedPath = path.replace(/\/$/, "").toLowerCase() || "/";

    const isActive = normalizedCurrent === normalizedPath;

    const baseClasses = "px-3 py-1.5 rounded-md transition-all whitespace-nowrap text-xs lg:text-sm font-bold tracking-tight";

    return isActive
        ? `${baseClasses} bg-blue-600 text-white shadow-lg ring-1 ring-blue-400` // High contrast "Blue Box"
        : `${baseClasses} text-gray-600 hover:text-blue-600 hover:bg-blue-50`;
  };

  return (
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-4 py-3">

        {/* 1. LOGO SECTION */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gray-800 hidden sm:block">New Education Era</span>
        </div>

        {/* 2. CENTER LINKS */}
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

        {/* 3. PROFILE SECTION */}
        <div className="flex items-center gap-3 flex-shrink-0 border-l pl-3 ml-2">
          {isLoggedIn && userData ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden md:block">
                  <p className="text-blue-600 font-extrabold text-[11px] leading-none uppercase">
                    {userData.username || userData.name}
                  </p>
                  <p className="text-[9px] uppercase text-gray-400 font-bold">
                    ({userData.role})
                  </p>
                </div>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-600 shadow-sm transition-all">
                  Logout
                </button>
              </div>
          ) : (
              <button onClick={() => navigate("/signin")} className="border-2 border-blue-600 text-blue-600 px-4 py-1 rounded-md text-xs font-bold hover:bg-blue-600 transition-all">
                Sign In
              </button>
          )}
        </div>
      </nav>
  );
};

export default Navbar;