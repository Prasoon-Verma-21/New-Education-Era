"use client";
import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loginImage from '../assets/login.jpg';
import signupImage from '../assets/signup.jpg';
import Swal from "sweetalert2";

const LoginSignupModal = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("student");
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // 1. Strict Mapping for Your 3 Schools
  const SCHOOL_DISTRICT_MAP = {
    "Central Academy": "Lucknow",
    "Delhi Public School": "Varanasi",
    "Govt High School": "Kanpur"
  };

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", phone: "",
    school: "", Class: "", rollNo: "", assignedClass: "", district: ""
  });

  const [expertData, setExpertData] = useState({ username: "", email: "", password: "", phone: "", consultationField: "", experienceYears: "", description: "" });
  const [tutorData, setTutorData] = useState({ username: "", email: "", password: "", phone: "", subject: "", experienceYears: "" });
  const [parentData, setParentData] = useState({ username: "", email: "", password: "", phone: "", school: "", Class: "", rollNo: "" });
  const [adminData, setAdminData] = useState({ name: "", username: "", email: "", password: "", school: "", phone: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const standardRoles = ["student", "teacher", "headmaster", "district_official", "subadmin"];

    if (standardRoles.includes(userType)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    else if (userType === "expert") setExpertData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "tutor") setTutorData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "parent") setParentData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "admin") setAdminData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== userType) {
          throw new Error(`Role mismatch! You are a ${userData.role}, not a ${userType}.`);
        }
        setIsLoggedIn(true);
        const targetPath = userData.role === 'admin' ? '/admin' : `/${userData.role}/dashboard`;
        navigate(targetPath);
      } else {
        setErrorMessage("No user profile found!");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let selectedData;
      const usesFormData = ["student", "teacher", "headmaster", "district_official", "subadmin"];

      if (usesFormData.includes(userType)) {
        selectedData = formData;
      } else if (userType === "expert") {
        selectedData = expertData;
      } else if (userType === "tutor") {
        selectedData = tutorData;
      } else if (userType === "parent") {
        selectedData = parentData;
      } else if (userType === "admin") {
        selectedData = adminData;
      }

      if (!selectedData || !selectedData.email) {
        throw new Error(`Signup data incomplete. Please check all fields.`);
      }

      const userCredential = await createUserWithEmailAndPassword(auth, selectedData.email.trim(), selectedData.password);

      const dataToSave = { ...selectedData };
      delete dataToSave.password;

      // Automatically tag with district before saving
      if (userType === "teacher" || userType === "headmaster") {
        dataToSave.district = SCHOOL_DISTRICT_MAP[selectedData.school] || "Other";
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...dataToSave,
        role: userType,
        createdAt: new Date().toISOString(),
      });

      Swal.fire({ title: 'Success!', text: `Account created as ${userType}!`, icon: 'success' });
      setIsSignup(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-gradient-to-b from-gray-50 via-blue-100 to-white flex justify-evenly p-12 w-full min-h-screen">
        <div className="flex flex-col pt-12 gap-5">
          <h1 className="text-center text-3xl font-black text-blue-600 tracking-tighter uppercase">
            New Education Era <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">Unified Portal</p>
          </h1>
          <img src={isSignup ? signupImage : loginImage} className="object-cover h-[50vh] w-[30vw] rounded-[40px] shadow-2xl border-8 border-white" alt="visual" />
        </div>

        <div className="mt-5 relative overflow-auto max-h-[100vh] p-8 bg-white/50 backdrop-blur-sm rounded-[40px] border border-white w-full max-w-lg shadow-xl">
          <h2 className="text-4xl font-black mb-8 text-blue-600 text-center tracking-tighter uppercase">
            {isSignup ? "Create Account" : "Access Portal"}
          </h2>

          {errorMessage && <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase text-center rounded-2xl border border-red-100">{errorMessage}</div>}

          <form onSubmit={isSignup ? handleSignUp : handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-2 text-center">Identity Your Role</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-3 border-2 border-blue-100 rounded-2xl bg-white focus:border-blue-500 outline-none transition-all font-bold text-center">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="headmaster">Headmaster (Principal)</option>
                <option value="district_official">District Official</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            {isSignup ? (
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="username" placeholder="Full Name" onChange={handleChange} className="p-3 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-semibold" required />
                  <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="p-3 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-semibold" required />
                  <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-3 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-semibold" required />
                  <input type="text" name="phone" placeholder="Contact Number" onChange={handleChange} className="p-3 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-semibold" required />

                  {(userType === "teacher" || userType === "headmaster") && (
                      <div className="col-span-2 space-y-4">
                        <div className="flex gap-2 items-center">
                          <div className="flex-grow">
                            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-2">Assigned School</label>
                            <select name="school" onChange={handleChange} className="w-full p-3 border-2 border-blue-50 rounded-2xl font-bold bg-blue-50/50" required>
                              <option value="">-- Select Your School --</option>
                              {Object.keys(SCHOOL_DISTRICT_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>

                          {/* NEW: Automated District Preview Box */}
                          {formData.school && (
                              <div className="w-32 animate-in slide-in-from-right duration-300">
                                <label className="block text-[9px] font-black text-indigo-400 uppercase mb-1 ml-2">Jurisdiction</label>
                                <div className="p-3 bg-indigo-600 text-white rounded-2xl font-black text-xs text-center shadow-lg shadow-indigo-100">
                                  {SCHOOL_DISTRICT_MAP[formData.school].toUpperCase()}
                                </div>
                              </div>
                          )}
                        </div>

                        {userType === "teacher" && (
                            <select name="assignedClass" onChange={handleChange} className="w-full p-3 border-2 border-blue-50 rounded-2xl font-bold bg-blue-50/50" required>
                              <option value="">-- Choose Assigned Class --</option>
                              {["9", "10", "11", "12"].map(c => <option key={c} value={c}>Grade {c} Monitor</option>)}
                            </select>
                        )}
                      </div>
                  )}

                  {userType === "district_official" && (
                      <div className="col-span-2">
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 ml-2">District Jurisdiction</label>
                        <select name="district" onChange={handleChange} className="w-full p-3 border-2 border-indigo-100 rounded-2xl font-bold bg-indigo-50/50" required>
                          <option value="">-- Select Assigned District --</option>
                          <option value="Lucknow">Lucknow Oversight</option>
                          <option value="Varanasi">Varanasi Oversight</option>
                          <option value="Kanpur">Kanpur Oversight</option>
                        </select>
                      </div>
                  )}
                </div>
            ) : (
                <div className="space-y-4">
                  <input type="email" name="email" value={loginData.email} onChange={handleChangeLogin} placeholder="Email" className="w-full p-4 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                  <input type="password" name="password" value={loginData.password} onChange={handleChangeLogin} placeholder="Password" className="w-full p-4 border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 active:scale-95 uppercase text-[10px] tracking-widest">
              {loading ? "SYNCING CLOUD DATA..." : (isSignup ? "Register Role" : "Secure Portal Login")}
            </button>
          </form>

          <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-6 text-blue-600 font-black text-[10px] uppercase tracking-tighter hover:underline">
            {isSignup ? "Already Registered? Login" : "New User? Create Account"}
          </button>
        </div>
      </div>
  );
};

export default LoginSignupModal;