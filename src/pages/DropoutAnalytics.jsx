import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from "recharts";

const DropoutAnalytics = () => {
    const { userData } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData?.school) return;

        const q = query(
            collection(db, "students"),
            where("school", "==", userData.school),
            where("class", "==", userData.assignedClass)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

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
        { name: "BPL Status", count: students.filter(s => s.familyIncome === "Below Poverty Line").length },
    ];

    const getTrendData = () => {
        const dates = {};
        students.forEach(s => {
            if (s.lastAnalyzed) {
                const date = new Date(s.lastAnalyzed).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
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
            REFINING PREDICTIVE MODELS...
        </div>
    );

    return (
        /* OUTER WRAPPER: Responsive page background */
        <div className="p-8 pt-24 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-2 uppercase tracking-tighter">Class Risk Intelligence</h1>
                <p className="text-gray-500 dark:text-slate-400 font-bold text-xs mb-10 uppercase tracking-widest">
                    {userData?.school} • Grade {userData?.assignedClass} • Live Update Sync
                </p>

                {/* Top Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pie Card: Added dark:bg-slate-900 and dark:border-slate-800 */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border border-gray-100 dark:border-slate-800 transition-all">
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

                    {/* Bar Card: Added dark:bg-slate-900 and dark:border-slate-800 */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border border-gray-100 dark:border-slate-800 transition-all">
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

                {/* Trend Chart: Added dark:bg-slate-900 and dark:border-slate-800 */}
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[50px] shadow-sm border border-gray-100 dark:border-slate-800 mb-8 transition-all">
                    <h3 className="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase mb-10 tracking-widest">Stability Trend (Avg. Risk Over Time)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <LineChart data={getTrendData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-10" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} domain={[0, 100]} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                                <Line type="monotone" dataKey="avgRisk" stroke="#3B82F6" strokeWidth={5} dot={{ r: 7, fill: "#3B82F6" }} activeDot={{ r: 10 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Footer Summary Banner */}
                <div className="bg-blue-600 dark:bg-indigo-700 rounded-[50px] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-blue-200 dark:shadow-none transition-all">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Automated Intervention Summary</h2>
                        <p className="opacity-80 font-semibold italic text-sm mt-1">Real-time telemetry suggests {riskStats[0].value} student(s) require immediate guidance.</p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-[35px] border border-white/20 text-center min-w-[220px] backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Retention Index</span>
                        <div className="text-5xl font-black mt-1">{Math.round((riskStats[2].value / (students.length || 1)) * 100)}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropoutAnalytics;