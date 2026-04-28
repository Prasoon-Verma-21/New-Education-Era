import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const HeadmasterDashboard = () => {
    const { userData } = useAuth();
    const [schoolData, setSchoolData] = useState({ totalStudents: 0, highRisk: 0, moderateRisk: 0, schoolName: "" });
    const [classStats, setClassStats] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noticeSubject, setNoticeSubject] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [viewingNotice, setViewingNotice] = useState(null);
    const [inspectingTeacher, setInspectingTeacher] = useState(null);
    const [allStudents, setAllStudents] = useState([]);

    const fetchAllData = async () => {
        if (!userData?.school) return;
        setLoading(true);
        try {
            const schoolName = userData.school;
            const districtName = userData.district;

            // Fetch Students from 'users' and apply baseline risk
            const studentSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
            const studentList = studentSnap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(s => String(s.school).trim().toLowerCase() === schoolName.trim().toLowerCase())
                .map(s => {
                    let risk = 0;
                    if (parseFloat(s.attendance_percentage) < 75) risk += 30;
                    if (parseFloat(s.current_gpa) < 5.0) risk += 30;
                    if (parseInt(s.academic_arrears) >= 2) risk += 20;
                    return { ...s, riskScore: s.riskScore || risk };
                });

            // Fetch Teachers
            const teacherSnap = await getDocs(query(collection(db, "users"), where("role", "==", "teacher")));
            setTeachers(teacherSnap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(t => String(t.school).trim().toLowerCase() === schoolName.trim().toLowerCase())
            );

            // FIXED: Fetch and Tag Notices by Source
            const noticeSnap = await getDocs(collection(db, "notices"));
            const mappedNotices = noticeSnap.docs.map(d => {
                const data = d.data();
                // If it has a district scope, it's from the District Official
                const source = (data.scope === "district" || !data.school) ? "District" : "School";
                return { ...data, id: d.id, source };
            });

            setNotices(mappedNotices.filter(n =>
                n.school === schoolName || (n.district === districtName && n.scope === "district")
            ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

            // Group by Class for Analytics
            const groups = studentList.reduce((acc, s) => {
                const className = String(s.class || s.Class || "9").replace(/\D/g, "");
                if (!acc[className]) acc[className] = { class: className, count: 0, highRisk: 0 };
                acc[className].count++;
                if (parseInt(s.riskScore) >= 55) acc[className].highRisk++;
                return acc;
            }, {});

            setAllStudents(studentList);
            setSchoolData({
                totalStudents: studentList.length,
                highRisk: studentList.filter(s => parseInt(s.riskScore) >= 55).length,
                moderateRisk: studentList.filter(s => parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55).length,
                schoolName
            });

            setClassStats(Object.values(groups).sort((a,b) => parseInt(a.class) - parseInt(b.class)));
            setLoading(false);
        } catch (error) {
            console.error("Dashboard Sync Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllData(); }, [userData]);

    const handleNoticeSubmit = async () => {
        if (!noticeSubject || !noticeMessage) return;
        try {
            if (editingId) {
                await updateDoc(doc(db, "notices", editingId), {
                    subject: noticeSubject,
                    message: noticeMessage,
                    updatedAt: new Date().toISOString()
                });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "notices"), {
                    subject: noticeSubject,
                    message: noticeMessage,
                    school: userData.school,
                    scope: "school",
                    createdAt: new Date().toISOString()
                });
            }
            setNoticeSubject(""); setNoticeMessage(""); fetchAllData();
            Swal.fire("Success", "Notice Updated.", "success");
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="min-h-screen p-10 pt-32 text-center font-black text-blue-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-950 animate-pulse uppercase tracking-widest">
            Synchronizing Command Feed...
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{schoolData.schoolName} Administration</h1>
                    <p className="text-blue-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-1">Institutional Oversight Hub</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
                        <p className="text-gray-400 text-[10px] font-black uppercase">Total Enrollment</p>
                        <h3 className="text-3xl font-black dark:text-white">{schoolData.totalStudents}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-red-500">
                        <p className="text-red-400 font-black text-[10px] uppercase">High Risk</p>
                        <h3 className="text-3xl font-black text-red-600">{schoolData.highRisk}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500">
                        <p className="text-yellow-500 font-black text-[10px] uppercase">Moderate Risk</p>
                        <h3 className="text-3xl font-black text-yellow-600">{schoolData.moderateRisk}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-green-500">
                        <p className="text-gray-400 text-[10px] font-black uppercase">Faculty Strength</p>
                        <h3 className="text-3xl font-black text-green-600">{teachers.length}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className={`${editingId ? 'bg-orange-500' : 'bg-blue-600'} p-8 rounded-[40px] text-white shadow-xl`}>
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">📢 {editingId ? "Update Directive" : "Create New Notice"}</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Subject" value={noticeSubject} onChange={(e) => setNoticeSubject(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-bold outline-none" />
                            <textarea placeholder="Notice Body..." value={noticeMessage} onChange={(e) => setNoticeMessage(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-semibold outline-none h-24" />
                            <button onClick={handleNoticeSubmit} className="w-full bg-white text-gray-800 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">Broadcast to Faculty</button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border dark:border-slate-800">
                        <h2 className="text-xl font-black dark:text-white mb-6 uppercase tracking-tighter">Official Registry</h2>
                        <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                            {notices.map(n => (
                                <div key={n.id} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${n.source === 'District' ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900' : 'bg-gray-50 dark:bg-slate-800/50 border-transparent dark:border-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${n.source === 'District' ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                            {n.source}
                                        </span >
                                        <p className="text-sm font-bold dark:text-slate-200 truncate max-w-[150px]">{n.subject}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setViewingNotice(n)} className="text-gray-400 font-black text-[9px] uppercase hover:text-blue-600">Read</button>

                                        {/* FIXED: Restored admin controls only for School-level notices */}
                                        {n.source === "School" && (
                                            <>
                                                <button onClick={() => {setEditingId(n.id); setNoticeSubject(n.subject); setNoticeMessage(n.message);}} className="text-blue-500 font-black text-[9px] uppercase">Edit</button>
                                                <button onClick={async () => {
                                                    if(window.confirm("Delete Notice?")){
                                                        await deleteDoc(doc(db, "notices", n.id));
                                                        fetchAllData();
                                                    }
                                                }} className="text-red-500 font-black text-[9px] uppercase">Del</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Visuals logic remained unchanged */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border dark:border-slate-800">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase mb-8 tracking-widest">Vulnerability by Grade</h3>
                        <div className="space-y-6">
                            {classStats.map(stat => (
                                <div key={stat.class}>
                                    <div className="flex justify-between text-[10px] mb-2 font-black uppercase">
                                        <span className="dark:text-slate-400">Grade {stat.class}</span>
                                        <span className="text-red-600">{stat.highRisk} Critical</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                        <div className={`h-full ${stat.highRisk > 5 ? 'bg-red-500' : 'bg-blue-600'}`} style={{width: `${(stat.highRisk / stat.count) * 100}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Faculty Activity Registry */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800 font-black text-gray-700 dark:text-slate-300 uppercase text-xs tracking-widest">Faculty Activity Metrics</div>
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {teachers.map(t => (
                                /* We added onClick and hover effects here to make it interactive */
                                <div
                                    key={t.id}
                                    onClick={() => setInspectingTeacher(t)}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-transparent dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-all active:scale-95 group"
                                >
                                    <div>
                                        {/* Using the teacher name from your database */}
                                        <p className="font-black text-gray-800 dark:text-slate-200 text-xs uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                            {t.name || t.username || "Faculty Member"}
                                        </p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                            Grade {t.assignedClass || "N/A"} Teacher
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {/* Added a clear call-to-action */}
                                        <span className="text-blue-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest block leading-none">
                View Class →
            </span>
                                        <span className="text-[8px] text-gray-400 dark:text-slate-500 font-bold uppercase">
                Registry Online
            </span>
                                    </div>
                                </div>
                            ))}
                            {teachers.length === 0 && (
                                <p className="p-10 text-center text-xs font-bold text-slate-400 uppercase italic">No faculty records found for this institution.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal remains same */}
            {viewingNotice && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className={`p-8 ${viewingNotice.source === 'District' ? 'bg-indigo-600' : 'bg-blue-600'} text-white`}>
                            <p className="text-[10px] font-black uppercase opacity-60 mb-1">{viewingNotice.source} Directive</p>
                            <h2 className="text-2xl font-black uppercase">{viewingNotice.subject}</h2>
                        </div>
                        <div className="p-10 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-800/20 border-y dark:border-slate-800">
                            {viewingNotice.message}
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-900 flex justify-end">
                            <button onClick={() => setViewingNotice(null)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Close</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Teacher Inspection Modal */}
            <AnimatePresence>
                {inspectingTeacher && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[250] flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 animate-in zoom-in duration-200">
                            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Class Oversight: Grade {inspectingTeacher.assignedClass}</p>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Faculty: {inspectingTeacher.name || inspectingTeacher.username}</h2>
                                </div>
                                <button onClick={() => setInspectingTeacher(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800">
                                        <th className="pb-4">Student Name</th>
                                        <th className="pb-4 text-center">Risk Index</th>
                                        <th className="pb-4 text-right">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-800">
                                    {/* Filter global student list by the teacher's assigned class */}
                                    {allStudents.filter(s => String(s.class).replace(/\D/g, "") === String(inspectingTeacher.assignedClass).replace(/\D/g, "")).map(s => (
                                        <tr key={s.id} className="group">
                                            <td className="py-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                {s.student_name}
                                                <p className="text-[9px] font-medium opacity-50 lowercase">{s.email}</p>
                                            </td>
                                            <td className="py-4 text-center font-black text-xs">
                                        <span className={parseInt(s.riskScore) >= 55 ? 'text-red-500' : 'text-blue-500'}>
                                            {s.riskScore}%
                                        </span>
                                            </td>
                                            <td className="py-4 text-right">
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${parseInt(s.riskScore) >= 55 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {parseInt(s.riskScore) >= 55 ? 'Critical' : 'Stable'}
                                        </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
                                <button onClick={() => setInspectingTeacher(null)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Close Oversight</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeadmasterDashboard;