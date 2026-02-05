import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { seedSampleData } from "../adminDashboard/utils/DataSeeder";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line} from "recharts";
import { ArrowLeft, Filter } from "lucide-react";

// Matches your registration constants
const DISTRICTS = ["Lucknow", "Varanasi", "Kanpur"];
const SCHOOLS = ["Central Academy", "Delhi Public School", "Govt High School"];

const DropoutAnalytics = ({ onBack }) => {
    const { userData } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Admin filters
    const [selectedDistrict, setSelectedDistrict] = useState("Lucknow");
    const [selectedSchool, setSelectedSchool] = useState("Central Academy");

    useEffect(() => {
        setLoading(true);
        console.log(`Fetching data for: ${selectedDistrict} - ${selectedSchool}`); // DEBUG LOG

        let q;
        if (userData?.role === 'admin') {
            q = query(
                collection(db, "predictions"),
                where("district", "==", selectedDistrict),
                where("school", "==", selectedSchool)
            );
        } else {
            q = query(
                collection(db, "predictions"),
                where("school", "==", userData?.school),
                where("class", "==", userData?.assignedClass)
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log("Documents Found:", data.length); // DEBUG LOG
            if (data.length > 0) console.log("Sample Data:", data[0]);

            setStudents(data);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Query Error:", error); // ERROR LOG
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData, selectedDistrict, selectedSchool]);

    // --- RECHARTS LOGIC ---
    const riskStats = [
        { name: "High Risk", value: students.filter(s => parseInt(s.riskScore) >= 55).length, color: "#EF4444" },
        { name: "Moderate", value: students.filter(s => parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55).length, color: "#F59E0B" },
        { name: "Low Risk", value: students.filter(s => parseInt(s.riskScore) < 30).length, color: "#10B981" },
    ];

    const factorStats = [
        { name: "Low Attd.", count: students.filter(s => parseFloat(s.attendance) < 75).length },
        { name: "Low GPA", count: students.filter(s => parseFloat(s.gpa) < 5.0).length },
        { name: "Long Dist.", count: students.filter(s => parseFloat(s.distance) > 7).length },
        { name: "Arrears", count: students.filter(s => parseInt(s.arrears) >= 2).length },
    ];

    const getTrendData = () => {
        const dates = {};
        students.forEach(s => {
            if (s.timestamp) {
                const dateObj = s.timestamp.toDate ? s.timestamp.toDate() : new Date(s.timestamp);
                const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                if (!dates[date]) dates[date] = { date, totalScore: 0, count: 0 };
                dates[date].totalScore += parseInt(s.riskScore);
                dates[date].count += 1;
            }
        });
        return Object.values(dates).map(d => ({
            date: d.date,
            avgRisk: Math.round(d.totalScore / d.count)
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    if (loading) return (
        <div className="p-10 pt-32 text-center animate-pulse font-black text-blue-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-950 min-h-screen uppercase tracking-widest">
            SYNCHRONIZING DISTRICT TELEMETRY...
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <button onClick={onBack} className="flex items-center text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2 hover:translate-x-[-4px] transition-transform">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Overview
                        </button>
                        <h1 className="text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none">Intelligence Feed</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                            {userData?.role === 'admin' ? `Admin View: ${selectedDistrict} District` : `${userData?.school} Monitoring`}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={seedSampleData}
                            className="px-6 py-2 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
                        >
                            Prime Sample Data
                        </button>
                    </div>

                    {/* Admin Filters: Hidden for non-admins */}
                    {userData?.role === 'admin' && (
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border dark:border-slate-800">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none dark:text-white cursor-pointer"
                            >
                                {DISTRICTS.map(d => <option key={d} value={d} className="bg-white dark:bg-slate-900">{d}</option>)}
                            </select>
                            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                            <select
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none dark:text-white cursor-pointer"
                            >
                                {SCHOOLS.map(s => <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* --- Visual Charts Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase mb-10 tracking-widest">Risk Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={riskStats} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                        {riskStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase mb-10 tracking-widest">Primary Risk Drivers</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={factorStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-10" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[15, 15, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 dark:bg-indigo-700 rounded-[50px] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl transition-all">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Intervention Feed</h2>
                        <p className="opacity-80 font-semibold italic text-xs uppercase tracking-widest">
                            Based on {students.length} data points from {selectedSchool}
                        </p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-[35px] border border-white/20 text-center min-w-[220px] backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Retention Index</span>
                        <div className="text-5xl font-black mt-1">
                            {students.length > 0 ? Math.round((riskStats[2].value / students.length) * 100) : 0}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

DropoutAnalytics.propTypes = {
    onBack: PropTypes.func.isRequired
};

export default DropoutAnalytics;