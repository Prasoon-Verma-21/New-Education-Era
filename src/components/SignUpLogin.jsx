"use client";
import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImage from '../assets/login.jpg';
import signupImage from '../assets/signup.jpg';
import Swal from "sweetalert2";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_CLASSES = ["9th", "10th", "11th", "12th"];
const DISTRICTS = ["Lucknow", "Varanasi", "Kanpur"];

const LoginSignupModal = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [verifyingKid, setVerifyingKid] = useState(false);
  const [verifiedKidName, setVerifiedKidName] = useState("");
  const [kidSearchError, setKidSearchError] = useState(false);

  const SCHOOL_DISTRICT_MAP = {
    "Central Academy": "Lucknow",
    "Delhi Public School": "Varanasi",
    "Govt High School": "Kanpur"
  };

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", phone: "",
    school: "", Class: "", rollNo: "", assignedClass: "", district: "",
    kidEmail: ""
  });

  const verifyStudentLive = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setVerifiedKidName("");
      setKidSearchError(false);
      return;
    }
    setVerifyingKid(true);
    setKidSearchError(false);
    try {
      const academicQuery = query(collection(db, "students"), where("email", "==", cleanEmail));
      const academicSnap = await getDocs(academicQuery);
      if (!academicSnap.empty) {
        setVerifiedKidName(academicSnap.docs[0].data().name);
        setKidSearchError(false);
        setVerifyingKid(false);
        return;
      }
      const userAccountQuery = query(collection(db, "users"), where("email", "==", cleanEmail), where("role", "==", "student"));
      const userSnap = await getDocs(userAccountQuery);
      if (!userSnap.empty) {
        setVerifiedKidName(userSnap.docs[0].data().username || userSnap.docs[0].data().name);
        setKidSearchError(false);
      } else {
        setVerifiedKidName("");
        setKidSearchError(true);
      }
    } catch (error) { console.error("Live verify error:", error); } finally { setVerifyingKid(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "phone") { finalValue = value.replace(/\D/g, "").slice(0, 10); }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setErrorMessage("");
    if (name === "kidEmail") {
      clearTimeout(window.kidSearchTimer);
      window.kidSearchTimer = setTimeout(() => { verifyStudentLive(value); }, 800);
    }
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email.trim().toLowerCase(), loginData.password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== userType) {
          await signOut(auth);
          setIsLoggedIn(false);
          throw new Error(`Role Mismatch! Registered as ${userData.role}.`);
        }
        setIsLoggedIn(true);
        navigate(userData.role === 'admin' ? '/admin' : `/${userData.role}-dashboard`);
      } else { setErrorMessage("User profile not found!"); }
    } catch (error) { setErrorMessage(error.message); await signOut(auth); } finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      if (userType === "parent") {
        if (!formData.kidEmail) throw new Error("Please enter your kid's registered email.");
        const cleanKidEmail = formData.kidEmail.trim().toLowerCase();
        const studentQuery = query(collection(db, "students"), where("email", "==", cleanKidEmail));
        const studentSnap = await getDocs(studentQuery);
        if (studentSnap.empty) {
          const userCheckQuery = query(collection(db, "users"), where("email", "==", cleanKidEmail), where("role", "==", "student"));
          const userCheckSnap = await getDocs(userCheckQuery);
          if (userCheckSnap.empty) { throw new Error(`Verification Failed: No student found with email ${cleanKidEmail}.`); }
        }
      }
      const primaryEmail = formData.email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(auth, primaryEmail, formData.password);

      const dataToSave = {
        ...formData,
        email: primaryEmail,
        kidEmail: formData.kidEmail.trim().toLowerCase(),
        name: formData.username
      };
      delete dataToSave.password;

      // Auto-assign district based on school for most roles
      if (["teacher", "headmaster", "student", "parent"].includes(userType)) {
        dataToSave.district = SCHOOL_DISTRICT_MAP[formData.school] || "Other";
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...dataToSave,
        role: userType,
        createdAt: new Date().toISOString()
      });

      await signOut(auth);
      Swal.fire({ title: 'Account Created!', text: 'Please log in with your new credentials.', icon: 'success' });
      setIsSignup(false);
      setFormData({ username: "", email: "", password: "", phone: "", school: "", Class: "", rollNo: "", assignedClass: "", district: "", kidEmail: "" });
    } catch (error) { setErrorMessage(error.message); } finally { setLoading(false); }
  };

  return (
      <div className="bg-gradient-to-b from-gray-50 via-blue-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col lg:flex-row justify-evenly items-center p-12 w-full min-h-screen transition-colors duration-500">
        <div className="flex flex-col pt-12 gap-5 mb-10 lg:mb-0">
          <h1 className="text-center text-3xl font-black text-blue-600 dark:text-indigo-400 tracking-tighter uppercase">
            New Education Era <p className="text-sm font-bold text-gray-500 dark:text-slate-400 tracking-widest uppercase mt-1">Unified Portal</p>
          </h1>
          <img src={isSignup ? signupImage : loginImage} className="object-cover h-[50vh] w-[80vw] lg:w-[30vw] rounded-[40px] shadow-2xl border-8 border-white dark:border-slate-800 transition-all duration-300" alt="visual" />
        </div>

        <div className="relative overflow-auto max-h-[90vh] p-10 bg-white/50 dark:bg-slate-900/80 backdrop-blur-xl rounded-[50px] border border-white dark:border-slate-800 w-full max-w-lg shadow-2xl transition-all duration-300">
          <h2 className="text-4xl font-black mb-8 text-blue-600 dark:text-indigo-400 text-center tracking-tighter uppercase">{isSignup ? "Create Account" : "Access Portal"}</h2>
          {errorMessage && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase text-center rounded-2xl border border-red-100 dark:border-red-900/30">{errorMessage}</div>}

          <form onSubmit={isSignup ? handleSignUp : handleLogin} className="space-y-5">
            <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-4 border-2 border-blue-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800 dark:text-white focus:border-blue-500 outline-none transition-all font-bold text-center appearance-none">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="headmaster">Headmaster (Principal)</option>
              <option value="district_official">District Official</option>
              <option value="parent">Parent</option>
            </select>

            {isSignup ? (
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="username" placeholder="Full Name" value={formData.username} onChange={handleChange} className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                  <input type="text" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />

                  {/* DISTRICT OFFICIAL: District selection */}
                  {userType === "district_official" && (
                      <div className="col-span-2">
                        <select name="district" value={formData.district} onChange={handleChange} className="w-full p-4 border-2 border-indigo-100 dark:border-slate-800 rounded-2xl font-bold bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-indigo-500" required>
                          <option value="">-- Select Assigned District --</option>
                          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                  )}

                  {/* TEACHER: Assigned Class selection */}
                  {userType === "teacher" && (
                      <div className="col-span-2">
                        <select name="assignedClass" value={formData.assignedClass} onChange={handleChange} className="w-full p-4 border-2 border-indigo-100 rounded-2xl font-bold bg-white dark:bg-slate-800 outline-none focus:border-indigo-500" required>
                          <option value="">-- Select Assigned Class --</option>
                          {TARGET_CLASSES.map(c => <option key={c} value={c}>{c} Standard</option>)}
                        </select>
                      </div>
                  )}

                  {/* STUDENT: Class and Roll No */}
                  {userType === "student" && (
                      <>
                        <select name="Class" value={formData.Class} onChange={handleChange} className="p-4 border-2 border-blue-50 rounded-2xl font-bold bg-white dark:bg-slate-800 outline-none focus:border-blue-500" required>
                          <option value="">-- Class --</option>
                          {TARGET_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="text" name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} className="p-4 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none font-bold" required />
                      </>
                  )}

                  {/* PARENT: Verification */}
                  {userType === "parent" && (
                      <div className="col-span-2 space-y-2">
                        <div className="relative group">
                          <input type="email" name="kidEmail" placeholder="Kid's Registered Email" value={formData.kidEmail} onChange={handleChange} className={`w-full p-4 bg-white dark:bg-slate-800 border-2 rounded-2xl outline-none font-bold ${verifiedKidName ? 'border-emerald-500' : kidSearchError ? 'border-red-500' : 'border-blue-50'}`} required />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            {verifyingKid && <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>}
                            {verifiedKidName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                            {kidSearchError && <AlertCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* SCHOOL SELECTION: Shown for school-based roles */}
                  {["student", "parent", "teacher", "headmaster"].includes(userType) && (
                      <div className="col-span-2">
                        <select name="school" value={formData.school} onChange={handleChange} className="w-full p-4 border-2 border-blue-50 dark:border-slate-800 rounded-2xl font-bold bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500" required>
                          <option value="">-- Select School --</option>
                          {Object.keys(SCHOOL_DISTRICT_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                  )}
                </div>
            ) : (
                /* Login Fields */
                <div className="space-y-4">
                  <input type="email" name="email" value={loginData.email} onChange={handleChangeLogin} placeholder="Email" className="w-full p-5 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none font-black" required />
                  <input type="password" name="password" value={loginData.password} onChange={handleChangeLogin} placeholder="Password" className="w-full p-5 bg-white dark:bg-slate-800 border-2 border-blue-50 rounded-2xl outline-none font-black" required />
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl transition-all active:scale-95 uppercase text-[11px] tracking-widest">
              {loading ? "SYNCING..." : (isSignup ? "Register Role" : "Secure Portal Login")}
            </button>
          </form>
          <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-8 text-blue-600 font-black text-[10px] uppercase hover:underline">
            {isSignup ? "Already Registered? Return to Login" : "Create a New Account"}
          </button>
        </div>
      </div>
  );
};

export default LoginSignupModal;