import { useState, useEffect } from "react"; // Removed 'React' to fix ESLint (no-unused-vars)
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, CheckCircle2, BookOpen } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

const ParentDashboard = () => {
  const { userData } = useAuth();
  const [childStats, setChildStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Component Mounted. UserData Status:", !!userData);

    if (!userData?.name) {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }

    const q = query(
        collection(db, "students"),
        where("name", "==", userData.name),
        where("school", "==", userData.school)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setChildStats(snapshot.docs[0].data());
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setLoading(false);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setChildStats(data);

          // EMERGENCY TRIGGER
          if (parseInt(data.riskScore) >= 70) {
            toast.error(`EMERGENCY ALERT: High risk detected for ${data.name}!`, {
              duration: 6000,
              position: 'top-right',
              style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '20px'
              }
            });
          }
        }
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, [userData]);

  // NEW: Intervention Engine Logic
  const getIntervention = (score) => {
    const risk = parseInt(score);
    if (risk >= 55) return {
      msg: "Urgent Intervention Required: Contact school counselor.",
      color: "text-red-600 bg-red-50",
      icon: <AlertCircle className="w-4 h-4" />
    };
    if (risk >= 30) return {
      msg: "Moderate Risk: Review study schedule and attendance.",
      color: "text-amber-600 bg-amber-50",
      icon: <BookOpen className="w-4 h-4" />
    };
    return {
      msg: "Student is stable. Continue regular monitoring.",
      color: "text-emerald-600 bg-emerald-50",
      icon: <CheckCircle2 className="w-4 h-4" />
    };
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-900 text-white">
          <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mb-4"></div>
          <p className="font-black uppercase tracking-tighter">Initializing Guardian Portal...</p>
        </div>
    );
  }

  const intervention = childStats ? getIntervention(childStats.riskScore) : null;

  return (
      // Changed bg-gray-50 to dark:bg-slate-950
      <div className="p-8 pt-24 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">

        {/* Changed bg-white to dark:bg-slate-900 and border-gray-100 to dark:border-slate-800 */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-2xl rounded-[40px] p-10 border border-gray-100 dark:border-slate-800">

          <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
            Parental Oversight
          </h1>
          <hr className="my-6 border-gray-100 dark:border-slate-800" />

          {childStats ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-tight ${intervention.color}`}>
                  {intervention.icon}
                  {intervention.msg}
                </div>

                <div className="p-8 bg-indigo-600 rounded-[30px] text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Child Stability Index</p>
                  <h2 className="text-6xl font-black tracking-tighter">{100 - parseInt(childStats.riskScore)}%</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Changed bg-gray-50 to dark:bg-slate-800/50 */}
                  <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Registered Name</p>
                    <p className="text-xl font-black text-gray-800 dark:text-gray-100">{childStats.name}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Current Attendance</p>
                    <p className="text-xl font-black text-gray-800 dark:text-gray-100">{childStats.attendance}%</p>
                  </div>
                </div>

                {/* Bottom Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900 group hover:bg-indigo-600 transition-all duration-300">
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-white font-bold">Schedule Teacher Meet</p>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-3xl border border-blue-100 dark:border-blue-900 group hover:bg-blue-600 transition-all duration-300">
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-white font-bold">View Learning Support</p>
                  </div>
                </div>
              </div>
          ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 font-bold italic">No child data linked to profile: &quot;{userData?.name || 'Unknown'}&quot;</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default ParentDashboard;