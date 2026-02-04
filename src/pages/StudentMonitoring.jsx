import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StudentMonitoring = () => {
    const { isLoggedIn } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState({ student: "" });

    // 1. Fetch the Teacher's Profile
    useEffect(() => {
        const fetchTeacherProfile = async () => {
            if (auth.currentUser) {
                const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
            setLoading(false);
        };
        fetchTeacherProfile();
    }, [isLoggedIn]);

    // 2. Mock Database of Students
    const allStudents = [
        { name: "Nishant Kumar", class: "10", attendance: 65, risk: 78 },
        { name: "Parth Sarthi", class: "12", attendance: 95, risk: 12 },
        { name: "Rahul Sharma", class: "10", attendance: 82, risk: 25 },
        { name: "Priya Singh", class: "12", attendance: 40, risk: 85 }
    ];

    // 3. Logic: Filter students based on Teacher's assigned class
    const filteredStudents = allStudents.filter(s => {
        if (userData?.role === 'teacher') {
            return s.class === userData.assignedClass;
        }
        return true;
    });

    const selectedStudent = allStudents.find(s => s.name === selection.student);

    if (loading) return (
        /* Loading state background fix */
        <div className="pt-32 min-h-screen bg-gray-50 dark:bg-slate-950 text-center text-blue-600 dark:text-indigo-400 font-black tracking-widest uppercase transition-colors">
            Loading classroom telemetry...
        </div>
    );

    return (
        /* OUTER WRAPPER: Responsive background */
        <div className="p-10 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Header Section: Added dark text classes */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-blue-600 dark:text-indigo-400 uppercase tracking-tighter">Student Monitoring</h1>
                    <p className="text-gray-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                        Currently viewing: <span className="text-blue-700 dark:text-white font-black">Class {userData?.assignedClass || "All"}</span>
                    </p>
                </div>

                {/* 4. Selection Dropdown Card: Added dark:bg-slate-900 and dark:border-slate-800 */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-blue-100 dark:border-slate-800 mb-10 transition-all">
                    <label className="block text-[10px] font-black text-gray-700 dark:text-slate-400 mb-3 uppercase tracking-widest ml-1">Select Active Student</label>
                    <select
                        className="w-full p-4 border-2 border-blue-100 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 dark:text-white font-bold focus:border-blue-500 outline-none transition-all appearance-none"
                        onChange={(e) => setSelection({ student: e.target.value })}
                        value={selection.student}
                    >
                        <option value="">-- Choose Student from Class {userData?.assignedClass} --</option>
                        {filteredStudents.map(s => (
                            <option key={s.name} value={s.name} className="dark:bg-slate-800">{s.name} (Grade {s.class})</option>
                        ))}
                    </select>
                </div>

                {/* 5. Interactive Risk Card */}
                {selectedStudent ? (
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-2xl dark:shadow-none border-l-[10px] border-blue-600 dark:border-indigo-600 border dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">{selectedStudent.name}</h2>
                                <p className="text-gray-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest mt-1">Registry ID: EDU-2026-0{Math.floor(Math.random()*100)}</p>
                            </div>
                            {/* Risk Badge: Added dark theme variants */}
                            <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedStudent.risk > 50 ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400'}`}>
                                Risk Level: {selectedStudent.risk}%
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-[10px] mb-3 font-black uppercase tracking-widest">
                                    <span className="text-gray-400 dark:text-slate-500">Live Attendance Rate</span>
                                    <span className={selectedStudent.attendance < 75 ? 'text-red-500' : 'text-emerald-500'}>{selectedStudent.attendance}%</span>
                                </div>
                                {/* Progress Bar Track: Added dark:bg-slate-800 */}
                                <div className="w-full bg-gray-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${selectedStudent.attendance < 75 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                        style={{width: `${selectedStudent.attendance}%`}}
                                    ></div>
                                </div>
                            </div>

                            {/* System Suggestion Box: Added dark:bg-indigo-950/20 and dark:border-indigo-900/50 */}
                            <div className="p-6 bg-blue-50 dark:bg-indigo-950/20 rounded-[30px] border border-blue-100 dark:border-indigo-900/50 backdrop-blur-sm">
                                <p className="text-sm text-blue-800 dark:text-indigo-300 italic font-semibold leading-relaxed">
                                    &quot;System suggests immediate {selectedStudent.risk > 50 ? 'intervention' : 'monitoring'} protocol based on current academic and socio-economic telemetry.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Placeholder: Added dark theme support */
                    <div className="text-center p-24 bg-white dark:bg-slate-900 rounded-[50px] border-4 border-dashed border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-600 font-black uppercase text-xs tracking-[0.2em] transition-all">
                        Awaiting student selection...
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMonitoring;