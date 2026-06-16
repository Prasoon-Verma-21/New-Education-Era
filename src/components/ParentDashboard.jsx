import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle2, BookOpen, Link2, TrendingDown, TrendingUp, Bell, X, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const { userData } = useAuth();
  const [childStats, setChildStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [notices, setNotices] = useState([]);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Normalize the email to lowercase to prevent matching errors
    const rawEmail = userData?.kidEmail || "";
    const cleanEmail = rawEmail.trim().toLowerCase();

    if (!cleanEmail) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    // 2. Query predictions for the specific student
    const q = query(
        collection(db, "predictions"),
        where("email", "==", cleanEmail),
        orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(doc => doc.data());
        const latestData = docs[docs.length - 1];
        setChildStats(latestData);

        const chartData = docs.map(d => ({
          month: d.month,
          risk: parseInt(d.riskScore || 0)
        }));
        setTrendData(chartData);

        if (parseInt(latestData.riskScore || 0) >= 70) {
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
      console.error("Firestore Prediction Error:", err);
      setLoading(false);
    });

    // 3. Separate Notice Listener to avoid dependency loops
    const qNotice = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsubNotice = onSnapshot(qNotice, (snapshot) => {
      const allNotices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const filtered = allNotices.filter(n =>
          n.school === childStats?.school ||
          (n.district === userData?.district && n.scope === "district")
      );
      setNotices(filtered);
    });

    return () => {
      unsubscribe();
      unsubNotice();
    };
    // Removed childStats?.school from dependencies to prevent infinite loops
  }, [userData?.kidEmail, userData?.district, childStats?.school]);

  const getIntervention = (score) => {
    const risk = parseInt(score || 0);
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
                  <h2 className="text-8xl font-black tracking-tighter relative z-10">{100 - parseInt(childStats.riskScore || 0)}%</h2>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Broadcasting Registry */}
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[35px] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Official Broadcast Registry</h3>
                  </div>

                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {notices.length > 0 ? notices.map(n => (
                        <button
                            key={n.id}
                            onClick={() => setViewingNotice(n)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100"
                        >
                          <div className="flex flex-col">
                          <span className={`text-[8px] font-black uppercase w-fit px-2 py-0.5 rounded ${n.scope === 'district' ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                            {n.scope === 'district' ? 'District' : 'School'}
                          </span>
                            <p className="text-sm font-bold text-gray-700 dark:text-slate-200 mt-1">{n.subject}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                    )) : (
                        <p className="text-[10px] text-slate-400 uppercase font-bold italic text-center py-4">No Jurisdictional Notices.</p>
                    )}
                  </div>
                </div>

                {/* Risk Progress Trend Chart - FIXED HEIGHT CONTAINER */}
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
                  {/* Recharts needs a div with a specific height here */}
                  {/* Updated wrapper with specific height to satisfy Recharts */}
                  <div className="h-[250px] w-full min-h-[250px] relative">
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
                    <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kid&apos;s Full Name</p>
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
              </div>
          ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs mb-2">Registry Linkage Pending</p>
                <p className="text-slate-400 font-medium italic">Your account is linked to <span className="font-bold">{userData?.kidEmail}</span>, but the teacher has not uploaded any telemetry yet.</p>
              </div>
          )}
        </div>

        <AnimatePresence>
          {viewingNotice && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800">
                  <div className={`p-8 ${viewingNotice.scope === 'district' ? 'bg-indigo-600' : 'bg-blue-600'} text-white flex justify-between items-center`}>
                    <div>
                      <p className="text-[10px] font-black uppercase opacity-60 mb-1">{viewingNotice.scope === 'district' ? 'District Level' : 'School Level'} Bulletin</p>
                      <h2 className="text-2xl font-black uppercase tracking-tight">{viewingNotice.subject}</h2>
                    </div>
                    <button onClick={() => setViewingNotice(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="p-8 text-gray-700 dark:text-slate-300 leading-relaxed font-semibold bg-gray-50 dark:bg-slate-900/50">
                    {viewingNotice.message}
                  </div>
                  <div className="p-6 bg-white dark:bg-slate-900 flex justify-end">
                    <button onClick={() => setViewingNotice(null)} className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Close Bulletin</button>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
};

const ChevronRightInternal = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
ChevronRightInternal.propTypes = { className: PropTypes.string };

export default ParentDashboard;