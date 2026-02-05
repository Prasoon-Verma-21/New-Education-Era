import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setIsLoggedIn(true); // Only set true once data is ready
          }
        } catch (error) {
          console.error("Context Error fetching profile:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- IMPROVED LOGOUT LOGIC ---
  const logout = async () => {
    try {
      // 1. Immediately tell the app we are logged out to trigger redirects
      setIsLoggedIn(false);
      setUserData(null);

      // 2. Clear Firebase session
      await signOut(auth);

      // 3. Force a hard navigation to the root to clear any stuck memory
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};