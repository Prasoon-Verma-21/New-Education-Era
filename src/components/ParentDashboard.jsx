import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, CheckCircle2, BookOpen, Link2, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const { userData } = useAuth();
  const [childStats, setChildStats] = useState(null);
  const [trendData, setTrendData] = useState([]); // New state for progress chart
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.kidEmail) {
      console.warn("No linked child email found in parent profile.");
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    // UPDATED: Query the 'predictions' collection for the specific kid's history
    const q = query(
        collection(db, "predictions"),
        where("email", "==", userData.kidEmail),
        orderBy("timestamp", "asc") // Sort by time to show the trend
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(doc => doc.data());

        // Latest prediction for the hero cards
        const latestData = docs[docs.length - 1];
        setChildStats(latestData);

        // Map data for the Trend Chart (Risk Progress)
        const chartData = docs.map(d => ({
          month: d.month,
          risk: parseInt(d.riskScore)
        }));
        setTrendData(chartData);

        // EMERGENCY TRIGGER
        if (parseInt(latestData.riskScore) >= 70) {
          toast.error(`EMERGENCY ALERT: High risk detected for ${latestData.name}!`, {
            duration: 6000,
            position: 'top-right',
            style: { background: '#ef4444', color: '#fff', fontWeight: 'bold', borderRadius: '20px' }
          });
        }
      } else {
        setChildStats(null);
        setTrendData([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  const getIntervention = (score) => {
    const risk = parseInt(score);
    if (risk >= 55) return {
      msg: "Urgent Intervention Required: Contact school counselor.",
      color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
      icon: <AlertCircle className="w-4 h-4" />
    };
    if (risk >= 30) return {
      msg: "Moderate Risk: Review study schedule and attendance.",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
      icon: <BookOpen className="w-4 h-4" />
    };
    return {
      msg: "Student is stable. Continue regular monitoring.",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
      icon: <CheckCircle2 className="w-4 h-4" />
    };
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p className="font-black uppercase tracking-tighter text-slate-800 dark:text-white">Securing Student Link...</p>
        </div>
    );
  }

  const intervention = childStats ? getIntervention(childStats.riskScore) : null;

  return (
      <div className="p-8 pt-24 min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-2xl rounded-[40px] p-10 border border-gray-100 dark:border-slate-800">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Parental Oversight</h1>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Link2 className="w-3 h-3 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Linked To: {userData?.kidEmail}</span>
            </div>
          </div>

          <hr className="mb-8 border-gray-100 dark:border-slate-800" />

          {childStats ? (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-tight transition-all ${intervention.color}`}>
                  {intervention.icon}
                  {intervention.msg}
                </div>

                <div className="p-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[35px] text-white shadow-2xl relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-2 relative z-10">Stability Index (Improvement Target)</p>
                  <h2 className="text-8xl font-black tracking-tighter relative z-10">{100 - parseInt(childStats.riskScore)}%</h2>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* NEW: Risk Progress Trend Chart */}
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Dropout Risk Trend</h3>
                    {trendData.length > 1 && (
                        <div className="flex items-center gap-1">
                          {trendData[trendData.length-1].risk < trendData[0].risk ?
                              <TrendingDown className="text-emerald-500 w-4 h-4" /> :
                              <TrendingUp className="text-red-500 w-4 h-4" />}
                          <span className={`text-[10px] font-black ${trendData[trendData.length-1].risk < trendData[0].risk ? 'text-emerald-500' : 'text-red-500'}`}>
                             {Math.abs(trendData[trendData.length-1].risk - trendData[0].risk)}% Change
                           </span>
                        </div>
                    )}
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '15px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[30px] border border-gray-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kid's Full Name</p>
                    <p className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">{childStats.name}</p>
                    <p className="text-[10px] font-bold text-indigo-500 mt-1">{childStats.school} • Grade {childStats.class}</p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-slate-800/50 rounded-[30px] border border-gray-100 dark:border-slate-700">
                    <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Attendance Telemetry</p>
                    <p className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">{childStats.attendance}%</p>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{width: `${childStats.attendance}%`}}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <button className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900 group hover:bg-indigo-600 transition-all text-left">
                    <p className="text-indigo-900 dark:text-indigo-300 group-hover:text-white font-black uppercase text-[10px] tracking-widest mb-1">Intervention</p>
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-white font-bold">Schedule Counselor Meet</p>
                  </button>
                  <button className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-3xl border border-blue-100 dark:border-blue-900 group hover:bg-blue-600 transition-all text-left">
                    <p className="text-blue-900 dark:text-blue-300 group-hover:text-white font-black uppercase text-[10px] tracking-widest mb-1">Resources</p>
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-white font-bold">Access Support Modules</p>
                  </button>
                </div>
              </div>
          ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs mb-2">Registry Linkage Pending</p>
                <p className="text-slate-400 font-medium italic">Your account is linked to <span className="font-bold">{userData?.kidEmail}</span>, but the teacher has not uploaded any telemetry yet.</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default ParentDashboard;