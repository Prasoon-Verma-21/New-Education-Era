import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const TeacherDashboard = () => {
    const { userData } = useAuth();
    const [classData, setClassData] = useState({ total: 0, atRisk: 0, moderate: 0 });
    const [recentStudents, setRecentStudents] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewingNotice, setViewingNotice] = useState(null);

    // 1. Fetch Notices (School + District Directives)
    useEffect(() => {
        const fetchNotices = async () => {
            if (!userData) return;
            try {
                const schoolNoticeQ = query(collection(db, "notices"), where("school", "==", userData.school));
                const districtNoticeQ = query(collection(db, "notices"),
                    where("district", "==", userData.district),
                    where("scope", "==", "district")
                );

                const [sSnap, dSnap] = await Promise.all([getDocs(schoolNoticeQ), getDocs(districtNoticeQ)]);
                const combined = [
                    ...sSnap.docs.map(d => ({ ...d.data(), id: d.id, source: "Principal" })),
                    ...dSnap.docs.map(d => ({ ...d.data(), id: d.id, source: "District Official" }))
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setNotices(combined);
            } catch (err) { console.error("Notice Error:", err); }
        };
        fetchNotices();
    }, [userData]);

    // 2. SINGLE Real-time Student Sync
    useEffect(() => {
        if (!userData?.school || !auth.currentUser) return;

        const q = query(
            collection(db, "students"),
            where("school", "==", userData.school),
            where("class", "==", userData.assignedClass)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentStudents(studentList);
            setClassData({
                total: studentList.length,
                atRisk: studentList.filter(s => parseInt(s.riskScore) >= 55).length,
                moderate: studentList.filter(s => parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55).length
            });
            setLoading(false);
        }, (error) => {
            console.error("Firestore Listener Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    if (loading) return (
        /* Added dark:bg-slate-950 and updated text for dark mode visibility */
        <div className="p-10 pt-32 text-center animate-pulse text-blue-600 dark:text-indigo-400 font-black tracking-widest bg-gray-50 dark:bg-slate-950 min-h-screen">
            ESTABLISHING SECURE CLASSROOM SYNC...
        </div>
    );

    return (
        /* MAIN WRAPPER: Added dark:bg-slate-950 */
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header Section: Added dark text classes */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">Grade {userData?.assignedClass} Teacher</h1>
                        <p className="text-blue-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-widest">{userData?.school} ({userData?.district})</p>
                    </div>
                    {/* Status Pill: Added dark:bg-slate-900 dark:border-slate-800 */}
                    <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Live Database Sync</span>
                    </div>
                </header>

                {/* 1. Directives Banner: Added dark shadow-none */}
                {notices.length > 0 && (
                    <div className="mb-10 bg-blue-600 rounded-[40px] p-2 shadow-2xl shadow-blue-100 dark:shadow-none transition-all">
                        <div className="bg-blue-600 text-white p-8 rounded-[35px] border-2 border-white/20">
                            <h2 className="text-xl font-bold mb-6 uppercase tracking-tighter">📣 Active Directives & Scholarships</h2>
                            <div className="space-y-4">
                                {notices.map(n => (
                                    <div key={n.id} className="p-5 rounded-3xl flex justify-between items-center border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[8px] font-black uppercase px-2 py-1 rounded bg-white text-blue-600">FROM: {n.source}</span>
                                            <p className="font-bold text-sm truncate max-w-[500px]">{n.subject || n.message}</p>
                                        </div>
                                        <button onClick={() => setViewingNotice(n)} className="bg-white text-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform">INTERVENE NOW</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Real-time Metrics Row: Added dark:bg-slate-900, dark:border-slate-800, and dark text */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border-b-8 border-blue-500 dark:border-slate-800 text-center">
                        <p className="text-gray-400 font-black text-[10px] uppercase mb-2">Total Enrollment</p>
                        <h3 className="text-5xl font-black text-gray-800 dark:text-white">{classData.total}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border-b-8 border-red-500 dark:border-slate-800 text-center">
                        <p className="text-red-400 font-black text-[10px] uppercase mb-2">Critical (High Risk)</p>
                        <h3 className="text-5xl font-black text-red-600">{classData.atRisk}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border-b-8 border-yellow-500 dark:border-slate-800 text-center">
                        <p className="text-yellow-500 font-black text-[10px] uppercase mb-2">Moderate Risk</p>
                        <h3 className="text-5xl font-black text-yellow-600">{classData.moderate}</h3>
                    </div>
                </div>

                {/* 3. Live Student Registry Table: Added dark:bg-slate-900, dark:border-slate-800, and row colors */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
                    <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800 font-black text-gray-700 dark:text-slate-300 uppercase text-xs tracking-widest">Student Risk Registry</div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-slate-800/30">
                        <tr className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase border-b dark:border-slate-800">
                            <th className="p-6">Student Name</th>
                            <th className="p-6">Risk Factor</th>
                            <th className="p-6 text-right pr-10">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentStudents.map(s => (
                            /* Added dark hover and text colors */
                            <tr key={s.id} className="border-b last:border-0 border-gray-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => setSelectedStudent(s)}>
                                <td className="p-6 font-bold text-gray-800 dark:text-slate-200">{s.name}</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-500 ${parseInt(s.riskScore) > 55 ? 'bg-red-500' : 'bg-yellow-400'}`} style={{width: `${s.riskScore}%`}}></div>
                                        </div>
                                        <span className="text-xs font-black text-blue-600 dark:text-indigo-400 underline decoration-dotted">{s.riskScore}%</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right pr-10">
                                    {/* Status badge: Added dark bg-red-950/20 and dark text-red-400 */}
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${parseInt(s.riskScore) > 55 ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-500'}`}>
                                            {parseInt(s.riskScore) > 55 ? 'Critical Action' : 'Stable'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Notice Detail Modal: Added dark mode logic */}
                {viewingNotice && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl border dark:border-slate-800 overflow-hidden animate-in zoom-in duration-200">
                            <div className={`p-8 ${viewingNotice.source === 'District Official' ? 'bg-indigo-600' : 'bg-blue-600'} text-white`}>
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Official {viewingNotice.source} Notice</p>
                                <h2 className="text-2xl font-black uppercase tracking-tight">{viewingNotice.subject || "Policy Update"}</h2>
                            </div>
                            <div className="p-10 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                                {viewingNotice.message}
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 flex justify-end">
                                <button onClick={() => setViewingNotice(null)} className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black dark:hover:bg-indigo-700 transition-all">Close Directive</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;