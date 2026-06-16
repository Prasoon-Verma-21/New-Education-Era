"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, TrendingUp, UserCheck, AlertTriangle, Search, X, FileText, Calendar, Activity, BarChart3 } from "lucide-react";

const StudentMonitoring = () => {
    const { userData } = useAuth();
    const [studentsList, setStudentsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAudit, setShowAudit] = useState(false);

    useEffect(() => {
        const fetchClassData = async () => {
            if (!userData?.school || !userData?.assignedClass) return;

            try {
                // 1. Fetch all students for the school from 'users'
                const studentUsersQuery = query(
                    collection(db, "users"),
                    where("role", "==", "student"),
                    where("school", "==", userData.school)
                );
                const userSnapshot = await getDocs(studentUsersQuery);
                const allSchoolStudents = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 2. Fetch all predictions for the school
                const predictionsQuery = query(
                    collection(db, "predictions"),
                    where("school", "==", userData.school)
                );
                const predSnapshot = await getDocs(predictionsQuery);
                const allPredictions = predSnapshot.docs.map(doc => doc.data());

                // 3. Flexible Filtering (Handling "12th" vs 12) [cite: 2026-01-22]
                const teacherClass = String(userData.assignedClass).replace(/\D/g, "");

                const filteredStudents = allSchoolStudents.filter(s => {
                    const sClass = String(s.class || "").replace(/\D/g, "");
                    return sClass === teacherClass;
                });

                const combinedData = filteredStudents.map(student => {
                    const studentHistory = allPredictions
                        .filter(p => p.email === student.email)
                        .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

                    const latest = studentHistory[studentHistory.length - 1];
                    const previous = studentHistory.length > 1 ? studentHistory[studentHistory.length - 2] : null;

                    // --- BASELINE CALCULATION ---
                    // If no teacher analysis exists yet, calculate baseline from CSV data
                    let baselineRisk = 0;
                    if (parseFloat(student.attendance_percentage) < 75) baselineRisk += 30;
                    if (parseFloat(student.current_gpa) < 5.0) baselineRisk += 30;
                    if (parseInt(student.academic_arrears) >= 2) baselineRisk += 20;

                    const currentRisk = latest ? parseInt(latest.riskScore) : baselineRisk;
                    const prevRisk = previous ? parseInt(previous.riskScore) : currentRisk;

                    return {
                        ...student,
                        name: student.student_name || student.name || "Unknown Student", // CSV Name Mapping
                        currentRisk,
                        attendance: latest ? latest.attendance : (student.attendance_percentage || 0),
                        trend: prevRisk - currentRisk,
                        lastMonth: latest ? latest.month : "Baseline Analysis",
                        fullHistory: studentHistory
                    };
                });

                setStudentsList(combinedData);
            } catch (err) {
                console.error("Monitoring Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [userData]);

    const filteredStudents = studentsList.filter(s => {
        const name = s.name || "";
        const email = s.email || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) return (
        <div className="pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <h2 className="text-blue-600 dark:text-indigo-400 font-black tracking-widest animate-pulse uppercase">Syncing Classroom Telemetry...</h2>
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Student Monitoring Hub</h1>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{userData?.school} — Grade {userData?.assignedClass}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-4 pl-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl font-bold text-slate-800 dark:text-white outline-none focus:border-blue-500 shadow-sm transition-all"
                            />
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Risk Index</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trend</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                    <tr key={s.id} className="border-t border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setSelectedStudent(s)}>
                                        <td className="p-6">
                                            <p className="font-black text-slate-800 dark:text-white uppercase text-sm">{s.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                                        </td>
                                        <td className="p-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${s.currentRisk >= 55 ? 'bg-red-100 text-red-600' : s.currentRisk >= 30 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {s.currentRisk}%
                                                </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            {s.trend > 0 ? (
                                                <div className="flex items-center justify-center gap-1 text-emerald-500 font-black text-xs">
                                                    <TrendingDown className="w-3 h-3" /> {s.trend}%
                                                </div>
                                            ) : s.trend < 0 ? (
                                                <div className="flex items-center justify-center gap-1 text-red-500 font-black text-xs">
                                                    <TrendingUp className="w-3 h-3" /> {Math.abs(s.trend)}%
                                                </div>
                                            ) : <span className="text-slate-300 font-black text-xs">-</span>}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">Select</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">No students matched for this class.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <AnimatePresence mode="wait">
                            {selectedStudent ? (
                                <motion.div key={selectedStudent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white dark:bg-slate-900 rounded-[40px] border border-blue-100 dark:border-slate-800 p-8 shadow-2xl sticky top-24">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black uppercase">
                                            {(selectedStudent.name).charAt(0)}
                                        </div>
                                        {selectedStudent.currentRisk >= 55 ? <AlertTriangle className="text-red-500 w-6 h-6 animate-pulse" /> : <UserCheck className="text-emerald-500 w-6 h-6" />}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-1">{selectedStudent.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Status: {selectedStudent.lastMonth}</p>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                                <span className="text-slate-400">Attendance</span>
                                                <span className="text-slate-800 dark:text-white">{selectedStudent.attendance}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="bg-blue-600 h-full transition-all" style={{ width: `${selectedStudent.attendance}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Intervention Strategy</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">
                                                {selectedStudent.currentRisk >= 55
                                                    ? "Critical: Schedule a parent-teacher meeting immediately."
                                                    : "Stability: Student shows consistent performance."}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setShowAudit(true)}
                                            className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg"
                                        >
                                            Open Full Audit
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800 p-20 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                                    <Search className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-4" />
                                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">Select a student</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {showAudit && selectedStudent && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAudit(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[50px] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col max-h-[90vh]">
                                <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-600 rounded-2xl text-white"><FileText className="w-6 h-6" /></div>
                                        <div>
                                            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Academic Audit Report</h2>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAudit(false)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all"><X className="dark:text-white" /></button>
                                </div>
                                <div className="p-10 overflow-y-auto space-y-10 text-slate-800 dark:text-white">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[30px] border dark:border-slate-800 text-center">
                                            <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Attendance</p>
                                            <p className="text-2xl font-black">{selectedStudent.attendance}%</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[30px] border dark:border-slate-800 text-center">
                                            <Activity className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Participation</p>
                                            <p className="text-2xl font-black">{selectedStudent.class_participation || '5'}/10</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[30px] border dark:border-slate-800 text-center">
                                            <BarChart3 className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Risk Score</p>
                                            <p className="text-2xl font-black">{selectedStudent.currentRisk}%</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-4">Historical Performance Log</h3>
                                        <div className="border dark:border-slate-800 rounded-[30px] overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                <tr><th className="p-4">Month</th><th className="p-4">Risk Score</th><th className="p-4">Status</th></tr>
                                                </thead>
                                                <tbody className="font-bold">
                                                {selectedStudent.fullHistory?.length > 0 ? selectedStudent.fullHistory.map((log, idx) => (
                                                    <tr key={idx} className="border-t dark:border-slate-800"><td className="p-4 uppercase">{log.month}</td><td className="p-4">{log.riskScore}%</td><td className="p-4"><span className={log.riskLabel === 'High Risk' ? 'text-red-500' : 'text-emerald-500'}>{log.riskLabel}</span></td></tr>
                                                )) : (
                                                    <tr className="border-t dark:border-slate-800"><td colSpan="3" className="p-6 text-center italic opacity-40 uppercase">No prior teacher analysis synced</td></tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 text-center">
                                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-lg">Download Audit PDF</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentMonitoring;