import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const StudentMonitoring = () => {
    const { isLoggedIn } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selection, setSelection] = useState({ student: "" });

    // 1. Fetch the Teacher's Profile to see their "assignedClass"
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

    // 2. Mock Database of Students (We will connect this to Firestore later)
    const allStudents = [
        { name: "Nishant Kumar", class: "10", attendance: 65, risk: 78 },
        { name: "Parth Sarthi", class: "12", attendance: 95, risk: 12 },
        { name: "Rahul Sharma", class: "10", attendance: 82, risk: 25 },
        { name: "Priya Singh", class: "12", attendance: 40, risk: 85 }
    ];

    // 3. Logic: Filter students based on Teacher's assigned class
    const filteredStudents = allStudents.filter(s => {
        // If user is a teacher, only show their class
        if (userData?.role === 'teacher') {
            return s.class === userData.assignedClass;
        }
        // Admins or Officials can see everyone
        return true;
    });

    const selectedStudent = allStudents.find(s => s.name === selection.student);

    if (loading) return <div className="pt-32 text-center text-blue-600 font-bold text-xl">Loading your class data...</div>;

    return (
        <div className="p-10 pt-24 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header showing the specific class */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Student Monitoring Portal</h1>
                    <p className="text-gray-500 font-medium">
                        Currently viewing: <span className="text-blue-700 font-bold">Class {userData?.assignedClass || "All"}</span>
                    </p>
                </div>

                {/* 4. Student Selection Dropdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Student</label>
                    <select
                        className="w-full p-3 border-2 border-blue-100 rounded-lg focus:border-blue-500 outline-none transition-all"
                        onChange={(e) => setSelection({ student: e.target.value })}
                    >
                        <option value="">-- Choose a Student from Class {userData?.assignedClass} --</option>
                        {filteredStudents.map(s => (
                            <option key={s.name} value={s.name}>{s.name} (Class {s.class})</option>
                        ))}
                    </select>
                </div>

                {/* 5. Interactive Risk Card */}
                {selectedStudent ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-blue-600 animate-fade-in">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Student ID: EDU-2026-0{Math.floor(Math.random()*100)}</p>
                            </div>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold ${selectedStudent.risk > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                Risk Level: {selectedStudent.risk}%
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-bold">
                                    <span>Attendance Rate</span>
                                    <span className={selectedStudent.attendance < 75 ? 'text-red-500' : 'text-green-600'}>{selectedStudent.attendance}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${selectedStudent.attendance < 75 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{width: `${selectedStudent.attendance}%`}}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800 italic">
                                    &quot;System suggests immediate {selectedStudent.risk > 50 ? 'intervention' : 'monitoring'} based on current academic trends.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                        Please select a student from the dropdown to view their performance metrics.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMonitoring;