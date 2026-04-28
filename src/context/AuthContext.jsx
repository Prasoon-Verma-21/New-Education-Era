import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setPersistence(auth, browserSessionPersistence)
        .then(() => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) {
                  setUserData(docSnap.data());
                  setIsLoggedIn(true);
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
        })
        .catch((error) => {
          console.error("Persistence Error:", error);
          setLoading(false);
        });
  }, []);

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUserData(null);
      await signOut(auth);
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


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};