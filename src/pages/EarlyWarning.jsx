"use client";
import { useState, useEffect } from 'react';
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { CheckCircle} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EarlyWarning = () => {
  const { userData } = useAuth();
  const [inputMode, setInputMode] = useState("manual");
  const [students, setStudents] = useState([]);
  const [isStudentFound, setIsStudentFound] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState({ label: '', score: 0 });

  const [formData, setFormData] = useState({
    name: '', email: '', attendance: '', distance: '', parentJob: 'Agriculture',
    parentEdu: 'Primary', gpa: '', participation: '5', areaType: 'Rural',
    pwd: 'No', familyIncome: 'Low', arrears: '0'
  });

  // 1. SECURE Live Lookup for Name based on Email
  const lookupStudentByName = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setIsStudentFound(false);
      return;
    }

    try {
      const userQuery = query(
          collection(db, "users"),
          where("email", "==", cleanEmail),
          where("role", "==", "student")
      );

      const userSnap = await getDocs(userQuery);

      if (!userSnap.empty) {
        const studentData = userSnap.docs[0].data();

        // Data Normalization for matching
        const sSchool = String(studentData.school || "").trim().toLowerCase();
        const tSchool = String(userData.school || "").trim().toLowerCase();

        // Extract only digits to match "11th" with "11"
        const sClass = String(studentData.class || "").replace(/\D/g, "");
        const tClass = String(userData.assignedClass || "").replace(/\D/g, "");

        // Debug logs for your MacBook M2 console
        console.log("Teacher Auth Check:", { tSchool, tClass });
        console.log("Student Record:", { sSchool, sClass });

        if (sSchool === tSchool && sClass === tClass) {
          // SUCCESS: Match found within authorized scope
          setFormData(prev => ({
            ...prev,
            name: studentData.student_name || studentData.name,
            attendance: studentData.attendance_percentage || '',
            gpa: studentData.current_gpa || '',
            arrears: studentData.academic_arrears || '0',
            distance: studentData.distance_from_school_km || '',
            familyIncome: studentData.family_income || 'Middle',
            parentJob: studentData.parent_occupation || 'Salaried',
            parentEdu: studentData.parent_education || 'Primary',
            areaType: studentData.area_type || 'Urban',
            pwd: studentData.special_needs || 'No',
            participation: studentData.class_participation || '5'
          }));
          setIsStudentFound(true);
        } else {
          // RESTRICTED: Student exists but belongs to another class/school
          setIsStudentFound(false);
          setFormData(prev => ({ ...prev, name: '' }));
          Swal.fire({
            icon: 'warning',
            title: 'Unauthorized Access',
            html: `
              <div class="text-left text-sm">
                <p><b>Student:</b> ${studentData.school} (Class ${studentData.class})</p>
                <p><b>Your Access:</b> ${userData.school} (Class ${userData.assignedClass})</p>
                <hr class="my-2 border-slate-200 dark:border-slate-700">
                <p class="text-xs text-red-500 font-bold uppercase">Cross-class data entry is strictly prohibited.</p>
              </div>
            `,
          });
        }
      } else {
        setIsStudentFound(false);
        setFormData(prev => ({ ...prev, name: '' }));
      }
    } catch (error) {
      console.error("Lookup error:", error);
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    clearTimeout(window.lookupTimer);
    window.lookupTimer = setTimeout(() => {
      lookupStudentByName(val);
    }, 800);
  };

  useEffect(() => {
    const fetchClassStudents = async () => {
      if (inputMode !== "database" || !userData?.school) return;

      try {
        console.log("--- STARTING REGISTRY SEARCH ---");
        const studentsRef = collection(db, "users");
        const q = query(studentsRef, where("role", "==", "student"));
        const querySnapshot = await getDocs(q);

        const allStudentsInSystem = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const filtered = allStudentsInSystem.filter(s => {
          const sSchool = String(s.school || "").toLowerCase().trim();
          const tSchool = String(userData.school || "").toLowerCase().trim();

          const sClass = String(s.class || "").replace(/\D/g, "");
          const tClass = String(userData.assignedClass || "").replace(/\D/g, "");

          return sSchool === tSchool && sClass === tClass;
        });

        console.log(`✅ MATCHES FOUND: ${filtered.length} for ${userData.school} Class ${userData.assignedClass}`);
        setStudents(filtered);
      } catch (err) {
        console.error("Registry Sync Error:", err);
      }
    };
    fetchClassStudents();
  }, [inputMode, userData]);

  const handleStudentSelect = (e) => {
    const student = students.find(s => s.email === e.target.value);
    if (student) {
      setFormData({
        ...formData,
        name: student.name || student.student_name,
        email: student.email,
        attendance: student.attendance_percentage || '',
        gpa: student.current_gpa || '',
        arrears: student.academic_arrears || '0',
        distance: student.distance_from_school_km || '',
        familyIncome: student.family_income || 'Middle',
        parentJob: student.parent_occupation || 'Salaried',
        parentEdu: student.parent_education || 'Primary',
        areaType: student.area_type || 'Urban',
        pwd: student.special_needs || 'No',
        participation: student.class_participation || '5'
      });
      setIsStudentFound(true);
    }
  };

  const handlePredict = (e) => {
    e.preventDefault();
    if (!isStudentFound) {
      Swal.fire("Error", "Please verify a valid student from your class before analyzing.", "error");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      let score = 0;
      if (parseFloat(formData.attendance) < 75) score += 25;
      if (parseFloat(formData.gpa) < 5.0) score += 15;
      if (parseInt(formData.arrears) >= 2) score += 15;
      if (parseFloat(formData.distance) > 7) score += 10;
      if (formData.familyIncome === 'Below Poverty Line') score += 10;
      if (parseFloat(formData.participation) <= 4) score += 10;

      setResult({
        label: score >= 55 ? "High Risk" : score >= 30 ? "Moderate Risk" : "Low Risk",
        score
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const saveStudent = async () => {
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const recordId = `${formData.email}_${currentMonth.replace(/\s+/g, '_')}`;

      await setDoc(doc(db, "predictions", recordId), {
        ...formData,
        riskScore: result.score,
        riskLabel: result.label,
        teacherEmail: auth.currentUser.email,
        school: userData?.school,
        class: userData?.assignedClass,
        month: currentMonth,
        timestamp: serverTimestamp()
      }, { merge: true });

      Swal.fire("Success", `Data for ${formData.name} updated for ${currentMonth}`, "success");
    } catch (err) { Swal.fire("Error", err.message, "error"); }
  };

  const inputBase = "w-full p-3 border-2 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-800 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors";
  const selectBase = "w-full p-3 border-2 dark:border-slate-700 rounded-2xl font-bold bg-white dark:bg-slate-800 text-gray-800 dark:text-white outline-none focus:border-blue-500 transition-colors";

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 pt-24 transition-colors duration-300">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-[40px] p-10 border dark:border-slate-800">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-8 text-center uppercase tracking-tighter">EARLY WARNING SYSTEM</h2>

          <div className="flex justify-center gap-4 mb-10">
            <button onClick={() => {setInputMode("manual"); setIsStudentFound(false); setFormData({...formData, name:'', email:''});}} className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${inputMode === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>Manual Entry</button>
            <button onClick={() => setInputMode("database")} className={`px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${inputMode === 'database' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>Load from Class</button>
          </div>

          {inputMode === "database" && (
              <div className="mb-8 p-6 bg-blue-50 dark:bg-indigo-950/20 border border-blue-100 dark:border-indigo-900/50 rounded-3xl text-center">
                <select onChange={handleStudentSelect} className={selectBase}>
                  <option value="">-- {students.length > 0 ? `Select from ${students.length} Students` : "No Students Found for your Class"} --</option>
                  {students.map(s => (
                      <option key={s.id} value={s.email}>
                        {s.student_name || s.name || "Unknown Student"} ({s.email})
                      </option>
                  ))}
                </select>
              </div>
          )}

          <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 bg-blue-50 dark:bg-slate-800/40 p-6 rounded-[30px] border border-blue-100 dark:border-slate-700">
              <h3 className="font-black text-blue-800 dark:text-indigo-400 text-[10px] uppercase tracking-widest mb-4">Academic Profile</h3>
              <input type="email" placeholder="Student Email" value={formData.email} onChange={handleEmailChange} className={inputBase} />
              <div className="relative">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={formData.name}
                    required
                    // 1. "Explicit ReadOnly": This tells React exactly when it's NOT editable
                    readOnly={isStudentFound}
                    // 2. "Conditional onChange": This handles typing ONLY when a student is NOT found
                    onChange={(e) => {
                      if (!isStudentFound) {
                        setFormData({ ...formData, name: e.target.value });
                      }
                    }}
                    className={`${inputBase} ${isStudentFound ? 'bg-gray-100 dark:bg-slate-700/50 border-emerald-500 text-emerald-600 dark:text-emerald-400' : ''}`}
                />
                {isStudentFound && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
              </div>
              <input type="number" placeholder="Attendance %" value={formData.attendance} required className={inputBase} onChange={(e) => setFormData({...formData, attendance: e.target.value})} />
              <input type="number" step="0.1" placeholder="Current GPA" value={formData.gpa} required className={inputBase} onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
              <input type="number" placeholder="No. of Arrears" value={formData.arrears} required className={inputBase} onChange={(e) => setFormData({...formData, arrears: e.target.value})} />
            </div>

            <div className="space-y-4 bg-green-50 dark:bg-slate-800/40 p-6 rounded-[30px] border border-green-100 dark:border-slate-700">
              <h3 className="font-black text-green-800 dark:text-emerald-400 text-[10px] uppercase tracking-widest mb-4">Socio-Economic</h3>
              <select className={selectBase} value={formData.familyIncome} onChange={(e) => setFormData({...formData, familyIncome: e.target.value})}>
                <option value="Middle">Middle Income</option>
                <option value="Low">Low Income</option>
                <option value="Below Poverty Line">Below Poverty Line (BPL)</option>
              </select>
              <select className={selectBase} value={formData.parentJob} onChange={(e) => setFormData({...formData, parentJob: e.target.value})}>
                <option value="Salaried">Salaried</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Daily Wage">Daily Wage Labor</option>
                <option value="Migrant Labor">Migrant Labor</option>
              </select>
              <select className={selectBase} value={formData.parentEdu} onChange={(e) => setFormData({...formData, parentEdu: e.target.value})}>
                <option value="Secondary">Secondary Education</option>
                <option value="Illiterate">No Formal Education</option>
                <option value="Primary">Primary Education</option>
              </select>
            </div>

            <div className="space-y-4 bg-purple-50 dark:bg-slate-800/40 p-6 rounded-[30px] border border-purple-100 dark:border-slate-700">
              <h3 className="font-black text-purple-800 dark:text-purple-400 text-[10px] uppercase tracking-widest mb-4">Environment</h3>
              <input type="number" placeholder="Distance (km)" value={formData.distance} required className={inputBase} onChange={(e) => setFormData({...formData, distance: e.target.value})} />
              <select className={selectBase} value={formData.areaType} onChange={(e) => setFormData({...formData, areaType: e.target.value})}>
                <option value="Rural">Rural</option>
                <option value="Urban">Urban</option>
              </select>
              <select className={selectBase} value={formData.pwd} onChange={(e) => setFormData({...formData, pwd: e.target.value})}>
                <option value="No">Special Needs: No</option>
                <option value="Yes">Special Needs: Yes</option>
              </select>
              <div className="pt-2">
                <label className="text-[9px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest block mb-2 text-center">Class Participation (1-10)</label>
                <input type="range" min="1" max="10" value={formData.participation} className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" onChange={(e) => setFormData({...formData, participation: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={isAnalyzing || !isStudentFound} className="md:col-span-3 py-5 bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-400">
              {isAnalyzing ? "Processing Analytics..." : "Analyze Dropout Risk"}
            </button>
          </form>

          <AnimatePresence>
            {result.label && !isAnalyzing && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 p-10 rounded-[40px] text-center border-4 border-dashed border-gray-100 dark:border-slate-800">
                  <h3 className={`text-5xl font-black tracking-tighter ${result.label === 'High Risk' ? 'text-red-600' : 'text-emerald-500'}`}>
                    {result.label.toUpperCase()} ({result.score}/100)
                  </h3>
                  <div className="flex justify-center gap-6 mt-10">
                    <button onClick={saveStudent} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95">Update Monthly Telemetry</button>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default EarlyWarning;