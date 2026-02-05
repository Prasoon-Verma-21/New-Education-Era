"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Activity, BookOpen, MapPin, Award, Rocket, Target, Zap, ChevronRight, X, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudentPortal = () => {
    const { userData } = useAuth();
    const [myStats, setMyStats] = useState(null);
    const [trendData, setTrendData] = useState([]); // State for the progress chart
    const [loading, setLoading] = useState(true);
    const [activePanel, setActivePanel] = useState(null);

    useEffect(() => {
        // We must use the email to find the telemetry saved by the teacher
        if (!userData?.email || !auth.currentUser) return;

        // FIX: Change "students" to "predictions" to match the Early Warning save logic
        const q = query(
            collection(db, "predictions"),
            where("email", "==", userData.email),
            orderBy("timestamp", "desc") // Get the most recent analysis first
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const docs = snapshot.docs.map(doc => doc.data());

                // Set the most recent stats for the dashboard display
                setMyStats(docs[0]);

                // Map all historical records for your trend chart
                const history = docs.map(d => ({
                    month: d.month,
                    risk: parseInt(d.riskScore)
                })).reverse(); // Reverse to show oldest to newest on a chart

                setTrendData(history);
            } else {
                setMyStats(null);
                setTrendData([]);
            }
            setLoading(false);
        }, (err) => {
            console.error("Portal Sync Error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="text-center animate-pulse">
                <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-4 blur-xl opacity-20"></div>
                <h2 className="text-blue-600 dark:text-indigo-400 font-black tracking-widest uppercase">Initializing Neural Link...</h2>
            </div>
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-500 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.3em]">System Identity Verified</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                            Stand By, {userData?.name?.split(' ')[0]} <span className="text-indigo-600 animate-pulse">_</span>
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-3 pr-8 rounded-[30px] border border-white dark:border-slate-800 shadow-2xl">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                            {userData?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Hub</p>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase">{userData?.school}</p>
                        </div>
                    </div>
                </header>

                {myStats ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* --- MAIN INDEX CARD --- */}
                        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 rounded-[50px] p-12 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-8">
                                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Academic Success Index</h2>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-9xl font-black tracking-tighter leading-none">{100 - parseInt(myStats.riskScore)}%</span>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black uppercase tracking-tighter text-indigo-200 leading-none mb-1">Score</span>
                                        <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Base: 100%</span>
                                    </div>
                                </div>

                                <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-[30px] border border-white/10 max-w-xl transition-all group-hover:bg-white/20">
                                    <p className="text-lg font-medium leading-snug italic">
                                        {parseInt(myStats.riskScore) < 30
                                            ? "Your current trajectory is elite. Maintain this momentum to secure your placement goals."
                                            : "A few adjustments to your routine will significantly elevate your standing. Consistency is your best tool."}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute top-10 right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Rocket className="w-48 h-48" />
                            </div>
                        </div>


                        {/* --- INTERACTIVE METRIC STACK --- */}
                        <div className="lg:col-span-4 space-y-6">
                            {[
                                { id: 'gpa', label: "Current GPA", val: myStats.gpa, icon: Target, color: "orange" },
                                { id: 'att', label: "Live Attendance", val: `${myStats.attendance}%`, icon: Activity, color: "emerald" },
                                { id: 'risk', label: "Risk Evaluation", val: myStats.riskLabel, icon: Award, color: "indigo" }
                            ].map((item, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    onClick={() => setActivePanel(item)}
                                    className="w-full bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-transparent hover:border-indigo-500/30 dark:border-slate-800 flex items-center justify-between transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-5 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-950/20`}>
                                            <item.icon className={`w-7 h-7 text-${item.color}-600 dark:text-${item.color}-400`} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                            <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{item.val}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                                </motion.button>
                            ))}
                        </div>

                        {/* --- PROGRESS TREND CHART --- */}
                        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-12 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-2xl transition-all">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-1">Temporal Progress Trend</h3>
                                    <p className="text-lg font-black dark:text-white uppercase tracking-tighter">Academic Risk Reduction</p>
                                </div>
                                {trendData.length > 1 && (
                                    <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${trendData[trendData.length-1].risk < trendData[0].risk ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-red-50 dark:bg-red-950/30 text-red-600'}`}>
                                        {trendData[trendData.length-1].risk < trendData[0].risk ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                        <span className="text-xs font-black uppercase">{Math.abs(trendData[0].risk - trendData[trendData.length-1].risk)}% Delta</span>
                                    </div>
                                )}
                            </div>

                            <div className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.1} />
                                        <XAxis dataKey="month" hide />
                                        <YAxis hide domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '25px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ display: 'none' }}
                                        />
                                        <Line type="monotone" dataKey="risk" stroke="#6366f1" strokeWidth={6} dot={{ r: 8, fill: '#6366f1' }} activeDot={{ r: 12 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* --- FOOTER SPECS --- */}
                        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-12 rounded-[60px] border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-16 text-center shadow-2xl">
                            <div>
                                <MapPin className="mx-auto mb-4 text-indigo-500 w-8 h-8" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Commute Logistics</p>
                                <p className="text-2xl font-black dark:text-white uppercase">{myStats.distance} KM <span className="text-[10px] opacity-40 ml-1">Vector</span></p>
                            </div>
                            <div>
                                <Activity className="mx-auto mb-4 text-emerald-500 w-8 h-8" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Social Sync</p>
                                <p className="text-2xl font-black dark:text-white uppercase">{myStats.participation}/10 <span className="text-[10px] opacity-40 ml-1">Index</span></p>
                            </div>
                            <div>
                                <BookOpen className="mx-auto mb-4 text-orange-500 w-8 h-8" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Module Backlogs</p>
                                <p className="text-2xl font-black dark:text-white uppercase">{myStats.arrears} <span className="text-[10px] opacity-40 ml-1">Critical</span></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[60px] border-4 border-dashed border-slate-100 dark:border-slate-800">
                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Awaiting Faculty Analysis Sync</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPortal;