import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Ensure this path correctly points to your firebase.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // This stores role, school, class, etc.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          // 2. Fetch the extra profile data from Firestore
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserData(docSnap.data());
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

  const logout = async () => {
    try {
      await signOut(auth);
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