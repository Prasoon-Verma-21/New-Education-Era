"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
// Added 'Bell' icon for notices
import { Activity, BookOpen, MapPin, Award, Rocket, Target, Zap, ChevronRight, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StudentPortal = () => {
    const { userData } = useAuth();
    const [myStats, setMyStats] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [notices, setNotices] = useState([]); // NEW: State for notices
    const [loading, setLoading] = useState(true);
    const [viewingNotice, setViewingNotice] = useState(null); // Modal for reading notices

    useEffect(() => {
        if (!userData?.email || !userData?.school) return;

        // 1. Prediction Listener (Existing)
        const qPred = query(
            collection(db, "predictions"),
            where("email", "==", userData.email),
            orderBy("timestamp", "asc")
        );

        const unsubPred = onSnapshot(qPred, (snapshot) => {
            if (!snapshot.empty) {
                const history = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    displayDate: new Date(doc.data().timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                }));
                setTrendData(history);
                const latest = history[history.length - 1];
                setMyStats({
                    gpa: userData.current_gpa || "0.0",
                    attendance: userData.attendance_percentage || "0",
                    arrears: userData.academic_arrears || "0",
                    participation: userData.class_participation || "0",
                    distance: userData.distance_from_school_km || "0",
                    riskScore: latest.riskScore,
                    riskLabel: latest.riskLabel
                });
            } else {
                setMyStats({
                    gpa: userData.current_gpa || "N/A",
                    attendance: userData.attendance_percentage || "0",
                    arrears: userData.academic_arrears || "0",
                    participation: userData.class_participation || "0",
                    distance: userData.distance_from_school_km || "0",
                    riskScore: "0",
                    riskLabel: "AWAITING ANALYSIS"
                });
            }
            setLoading(false);
        });

        // 2. NEW: Notice Registry Listener
        // Fetches notices for this student's specific school OR district-wide notices
        const qNotice = query(collection(db, "notices"), orderBy("createdAt", "desc"));

        const unsubNotice = onSnapshot(qNotice, (snapshot) => {
            const allNotices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            // Filter notices meant for this specific student's jurisdiction
            const filtered = allNotices.filter(n =>
                n.school === userData.school ||
                (n.district === userData.district && n.scope === "district")
            );

            setNotices(filtered);
        });

        return () => {
            unsubPred();
            unsubNotice();
        };
    }, [userData]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <h2 className="text-blue-600 dark:text-indigo-400 font-black uppercase tracking-widest animate-pulse">Initializing Neural Link...</h2>
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-500 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.3em]">System Identity Verified</span>
                        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mt-4 leading-none">
                            Stand By, {userData?.name?.split(' ')[0]} <span className="text-indigo-600 animate-pulse">_</span>
                        </h1>
                    </motion.div>
                </header>

                {myStats && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* --- MAIN INDEX CARD --- */}
                        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="text-9xl font-black tracking-tighter leading-none">{myStats.gpa} <span className="text-4xl uppercase">GPA</span></span>
                                <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-[30px] border border-white/10 max-w-xl italic">
                                    {parseInt(myStats.riskScore) < 30 ? "Your trajectory is elite." : "A few adjustments will significantly elevate your standing."}
                                </div>
                            </div>
                            <div className="absolute top-10 right-10 opacity-10"><Rocket className="w-48 h-48" /></div>
                        </div>

                        {/* --- NOTICES SECTION (NEW) --- */}
                        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border dark:border-slate-800 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Broadcast Registry</h3>
                            </div>

                            <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                {notices.length > 0 ? notices.map(n => (
                                    <button
                                        key={n.id}
                                        onClick={() => setViewingNotice(n)}
                                        className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
                                    >
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${n.scope === 'district' ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                            {n.scope === 'district' ? 'District' : 'School'}
                                        </span>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-2 truncate">{n.subject}</p>
                                    </button>
                                )) : (
                                    <p className="text-[10px] text-slate-400 uppercase font-bold italic py-10 text-center">No active directives found.</p>
                                )}
                            </div>
                        </div>

                        {/* --- PROGRESS TREND CHART --- */}
                        <div className="lg:col-span-12 h-[400px] bg-slate-900/50 rounded-[40px] p-10 border border-slate-800 shadow-2xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Temporal Progress Trend: Academic Risk Reduction</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="displayDate" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px' }} />
                                    <Area type="monotone" dataKey="riskScore" stroke="#6366f1" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* --- FOOTER SPECS --- */}
                        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-12 rounded-[60px] border dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-16 text-center shadow-2xl">
                            <div><MapPin className="mx-auto mb-4 text-indigo-500 w-8 h-8" /><p className="text-2xl font-black dark:text-white uppercase">{userData.distance_from_school_km || 0} KM</p></div>
                            <div><Activity className="mx-auto mb-4 text-emerald-500 w-8 h-8" /><p className="text-2xl font-black dark:text-white uppercase">{userData.class_participation || 0}/10</p></div>
                            <div><BookOpen className="mx-auto mb-4 text-orange-500 w-8 h-8" /><p className="text-2xl font-black dark:text-white uppercase">{userData.academic_arrears || 0}</p></div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- NOTICE MODAL --- */}
            <AnimatePresence>
                {viewingNotice && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col">
                            <div className={`p-8 ${viewingNotice.scope === 'district' ? 'bg-indigo-600' : 'bg-blue-600'} text-white flex justify-between items-center`}>
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">{viewingNotice.scope === 'district' ? 'District Official' : 'Principal'} Directive</p>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">{viewingNotice.subject}</h2>
                                </div>
                                <button onClick={() => setViewingNotice(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="p-10 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-900/50 min-h-[200px]">
                                {viewingNotice.message}
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 flex justify-end border-t dark:border-slate-800">
                                <button onClick={() => setViewingNotice(null)} className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Close Bulletin</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentPortal;