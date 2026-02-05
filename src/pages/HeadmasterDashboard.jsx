import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

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

    const fetchAllData = async () => {
        if (!userData?.school) return;
        try {
            const schoolName = userData.school;
            const districtName = userData.district;

            const studentQ = query(collection(db, "students"), where("school", "==", schoolName));
            const studentSnap = await getDocs(studentQ);
            const studentList = studentSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const teacherQ = query(collection(db, "users"), where("role", "==", "teacher"), where("school", "==", schoolName));
            const teacherSnap = await getDocs(teacherQ);
            const teacherList = teacherSnap.docs.map(d => ({
                ...d.data(),
                id: d.id,
                reportCount: studentList.filter(s => s.teacherId === d.id || s.addedBy === d.data().username).length
            }));
            setTeachers(teacherList);

            const schoolNoticeQ = query(collection(db, "notices"), where("school", "==", schoolName));
            const districtNoticeQ = query(collection(db, "notices"), where("district", "==", districtName), where("scope", "==", "district"));
            const [sSnap, dSnap] = await Promise.all([getDocs(schoolNoticeQ), getDocs(districtNoticeQ)]);

            setNotices([
                ...sSnap.docs.map(d => ({ ...d.data(), id: d.id, source: "School" })),
                ...dSnap.docs.map(d => ({ ...d.data(), id: d.id, source: "District" }))
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

            const groups = studentList.reduce((acc, s) => {
                const className = s.class || "Unknown";
                if (!acc[className]) acc[className] = { class: className, count: 0, highRisk: 0 };
                acc[className].count++;
                if (parseInt(s.riskScore) >= 55) acc[className].highRisk++;
                return acc;
            }, {});

            setSchoolData({
                totalStudents: studentList.length,
                highRisk: studentList.filter(s => parseInt(s.riskScore) >= 55).length,
                moderateRisk: studentList.filter(s => parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55).length,
                schoolName
            });
            setClassStats(Object.values(groups).sort((a,b) => parseInt(a.class) - parseInt(b.class)));
            setLoading(false);
        } catch (error) {
            console.error(error);
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
            Swal.fire("Success", "Notice has been broadcasted.", "success");
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        /* Added dark mode styles to the loading state */
        <div className="min-h-screen p-10 pt-32 text-center font-black text-blue-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-950 animate-pulse transition-colors uppercase tracking-widest">
            Establishing Command Sync...
        </div>
    );

    return (
        /* MAIN WRAPPER: Added dark:bg-slate-950 */
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{schoolData.schoolName} Administration</h1>
                    <p className="text-blue-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-1">Official Management Portal</p>
                </header>

                {/* Metrics Cards: Added dark:bg-slate-900 and dark borders */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-blue-500 dark:border-slate-800">
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase">Total Enrollment</p>
                        <h3 className="text-3xl font-black text-gray-800 dark:text-white">{schoolData.totalStudents}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-red-500 dark:border-slate-800">
                        <p className="text-red-400 font-black text-[10px] uppercase">High Risk (Critical)</p>
                        <h3 className="text-3xl font-black text-red-600">{schoolData.highRisk}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500 dark:border-slate-800">
                        <p className="text-yellow-500 font-black text-[10px] uppercase">Moderate Risk</p>
                        <h3 className="text-3xl font-black text-yellow-600">{schoolData.moderateRisk}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-8 border-green-500 dark:border-slate-800">
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase">Active Faculty</p>
                        <h3 className="text-3xl font-black text-green-600">{teachers.length}</h3>
                    </div>
                </div>

                {/* Broadcast and Notices Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Broadcast Card: Added dark mode shadow and transition */}
                    <div className={`${editingId ? 'bg-orange-500' : 'bg-blue-600'} p-8 rounded-[40px] shadow-xl dark:shadow-none text-white transition-all`}>
                        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">📢 {editingId ? "Edit Directive" : "Broadcast Scholarship"}</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Subject/Headline" value={noticeSubject} onChange={(e) => setNoticeSubject(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-bold outline-none border-none focus:ring-4 focus:ring-blue-300 transition-all" />
                            <textarea placeholder="Full Details for Faculty..." value={noticeMessage} onChange={(e) => setNoticeMessage(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-semibold outline-none h-24 border-none focus:ring-4 focus:ring-blue-300 transition-all" />
                            <button onClick={handleNoticeSubmit} className="w-full bg-white text-gray-800 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">BROADCAST TO TEACHERS</button>
                        </div>
                    </div>

                    {/* Registry Card: Added dark:bg-slate-900 and dark:border-slate-800 */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 transition-all">
                        <h2 className="text-xl font-black text-gray-800 dark:text-white mb-6 uppercase tracking-tighter">Notification Registry</h2>
                        <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                            {notices.map(n => (
                                <div key={n.id} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${n.source === 'District' ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50' : 'bg-gray-50 dark:bg-slate-800/50 border-transparent dark:border-slate-700 hover:border-blue-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${n.source === 'District' ? 'bg-indigo-600 text-white' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'}`}>{n.source}</span>
                                        <p className="text-sm font-bold text-gray-700 dark:text-slate-300 truncate max-w-[150px]">{n.subject || n.message}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setViewingNotice(n)} className="text-gray-400 dark:text-slate-500 font-black text-[9px] uppercase hover:text-blue-600 transition-colors">Read</button>
                                        {n.source === "School" && (
                                            <>
                                                <button onClick={() => {setEditingId(n.id); setNoticeSubject(n.subject); setNoticeMessage(n.message);}} className="text-blue-500 dark:text-indigo-400 font-black text-[9px] uppercase">Edit</button>
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

                {/* Bottom Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vulnerability Index: Added dark:bg-slate-900 and dark:border-slate-800 */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800 font-black text-gray-700 dark:text-slate-300 uppercase text-xs tracking-widest">School Vulnerability Index</div>
                        <div className="p-8 space-y-6">
                            {classStats.map(stat => (
                                <div key={stat.class}>
                                    <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
                                        <span className="text-gray-400 dark:text-slate-500">Grade {stat.class}</span>
                                        <span className="text-red-600 dark:text-red-400">{stat.highRisk} Critical Cases</span>
                                    </div>
                                    {/* Progress Bar Track: Added dark:bg-slate-800 */}
                                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-500 ${stat.highRisk > 5 ? 'bg-red-500' : 'bg-blue-600 dark:bg-indigo-600'}`} style={{width: `${(stat.highRisk / stat.count) * 100}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Faculty Activity: Added dark:bg-slate-900 and dark:border-slate-800 */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all">
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-800 font-black text-gray-700 dark:text-slate-300 uppercase text-xs tracking-widest">Faculty Activity Metrics</div>
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {teachers.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-transparent dark:border-slate-700">
                                    <p className="font-black text-gray-800 dark:text-slate-200 text-xs uppercase tracking-tight">{t.username}</p>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{t.reportCount} <span className="text-[8px] text-gray-400 dark:text-slate-500">REPORTS</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* View Notice Modal: Integrated dark mode logic */}
            {viewingNotice && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 animate-in zoom-in duration-200">
                        <div className={`p-8 ${viewingNotice.source === 'District' ? 'bg-indigo-600' : 'bg-blue-600'} text-white`}>
                            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Official {viewingNotice.source} Notice</p>
                            <h2 className="text-2xl font-black uppercase tracking-tight">{viewingNotice.subject || "Bulletin Update"}</h2>
                        </div>
                        <div className="p-10 text-slate-700 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-800/50 border-y dark:border-slate-800 transition-colors">
                            {viewingNotice.message}
                        </div>
                        <div className="p-6 bg-white dark:bg-slate-900 flex justify-end">
                            <button onClick={() => setViewingNotice(null)} className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black dark:hover:bg-indigo-700 transition-all">Close Directive</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadmasterDashboard;