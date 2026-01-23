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


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    school: "",
    Class: "",
    rollNo: "",
    assignedClass: ""
  });

  const [expertData, setExpertData] = useState({ username: "", email: "", password: "", phone: "", consultationField: "", experienceYears: "", description: "" });
  const [tutorData, setTutorData] = useState({ username: "", email: "", password: "", phone: "", subject: "", experienceYears: "" });
  const [parentData, setParentData] = useState({ username: "", email: "", password: "", phone: "", school: "", Class: "", rollNo: "" });
  const [adminData, setAdminData] = useState({ name: "", username: "", email: "", password: "", school: "", phone: "" });
  const [subAdminData, setSubAdminData] = useState({ name: "", username: "", email: "", password: "", school: "", Class: "", phone: "" });


  const handleChange = (e) => {
    const { name, value } = e.target;

    // List all roles that use the standard 'formData' state
    const standardRoles = ["student", "teacher", "headmaster", "district_official", "subadmin"];

    if (standardRoles.includes(userType)) {
      setFormData((prev) => ({ ...prev, [name]: value })); // Using functional update for reliability
    }
    else if (userType === "expert") setExpertData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "tutor") setTutorData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "parent") setParentData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "admin") setAdminData((prev) => ({ ...prev, [name]: value }));
    else if (userType === "subadmin") setSubAdminData((prev) => ({ ...prev, [name]: value }));

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
        setErrorMessage("No user profile found in Firestore!");
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
    setErrorMessage(""); // Clear previous errors

    try {
      // 1. IMPROVED MAPPING: Determine which data object to use
      let selectedData;

      // All these roles use the 'formData' state
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

      // 2. Critical Check
      if (!selectedData || !selectedData.email) {
        console.log("Current userType:", userType); // Debugging
        console.log("SelectedData content:", selectedData);
        throw new Error(`Data mapping failed for role: ${userType}. Please check if email is entered.`);
      }

      const cleanEmail = selectedData.email.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, selectedData.password);

      // 3. Prepare data for Firestore
      const dataToSave = { ...selectedData };
      delete dataToSave.password; // Security: Don't store passwords

      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...dataToSave,
        role: userType, // This ensures the role is saved correctly
        createdAt: new Date().toISOString(),
      });

      Swal.fire({ title: 'Success!', text: `Account created as ${userType}!`, icon: 'success' });
      setIsSignup(false);
    } catch (error) {
      console.error("Signup Error:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
      <div className="bg-gradient-to-b from-gray-50 via-blue-100 to-white flex justify-evenly p-12 w-full">
        <div className="flex flex-col pt-12 gap-5">
          <h1 className="text-center text-3xl font-semibold text-blue-500">Empowering the Education <p>at all Stages</p></h1>
          <img
              src={isSignup ? signupImage : loginImage}
              className="object-cover h-[50vh] w-[30vw] rounded-lg shadow-xl shadow-gray-600"
              alt="auth-visual"
          />
        </div>

        <div className="mt-5 relative overflow-auto max-h-[100vh] p-5">
          <h1 className="text-3xl font-semibold mb-4 text-blue-500 text-center">
            {isSignup ? "Sign Up" : "Login"}
          </h1>

          <div className="p-4">
            {errorMessage && <div className="mb-4 text-red-600 text-sm font-medium text-center">{errorMessage}</div>}

            <form onSubmit={isSignup ? handleSignUp : handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-blue-500"
                    required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="headmaster">Headmaster (Principal)</option>
                  <option value="district_official">District Official</option>
                  <option value="expert">Expert</option>
                  <option value="tutor">Tutor</option>
                  <option value="parent">Parent</option>
                  <option value="subadmin">Sub-Admin</option>
                </select>
              </div>

              {isSignup ? (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} className="p-2 border border-blue-500 rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border border-blue-500 rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border border-blue-500 rounded" required />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} className="p-2 border border-blue-500 rounded" required />

                    {/* Conditional Fields: Student, Parent, Subadmin */}
                    {(userType === "student" || userType === "parent" || userType === "subadmin") && (
                        <>
                          <input type="text" name="school" placeholder="School" onChange={handleChange} className="p-2 border border-blue-500 rounded" required />
                          <select name="Class" onChange={handleChange} className="p-2 border border-blue-500 rounded">
                            {["Nur", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </>
                    )}


                    {userType === "teacher" && (
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-blue-600 mb-1">Select Your Assigned Class</label>
                          <select
                              name="assignedClass"
                              onChange={handleChange}
                              className="w-full p-2 border border-blue-500 rounded bg-blue-50 font-semibold"
                              required
                          >
                            <option value="">-- Choose Class --</option>
                            {["9", "10", "11", "12"].map(c => (
                                <option key={c} value={c}>Class {c}</option>
                            ))}
                          </select>
                        </div>
                    )}
                    {userType === "headmaster" && (
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-blue-600 mb-1">Affiliated School Name</label>
                          <select
                              name="school"
                              onChange={handleChange}
                              className="w-full p-2 border border-blue-500 rounded bg-blue-50 font-semibold"
                              required
                          >
                            <option value="">-- Select Your School --</option>
                            <option value="Govt High School">Govt High School</option>
                            <option value="City Public School">City Public School</option>
                            <option value="Modern Academy">Modern Academy</option>
                          </select>
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="flex flex-col gap-4 mb-4">
                    <input type="email" name="email" value={loginData.email} onChange={handleChangeLogin} placeholder="Email" className="p-2 border border-blue-500 rounded w-[30vw]" required />
                    <input type="password" name="password" value={loginData.password} onChange={handleChangeLogin} placeholder="Password" className="p-2 border border-blue-500 rounded" required />
                  </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                {loading ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
              </button>
            </form>

            <div className="text-center mt-6">
              <button onClick={() => setIsSignup(!isSignup)} className="text-blue-600 hover:underline">
                {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginSignupModal;