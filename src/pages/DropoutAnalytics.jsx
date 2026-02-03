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

    // --- DATA PROCESSING ---

    // 1. Pie Chart: Risk Distribution
    const riskStats = [
        { name: "High Risk", value: students.filter(s => parseInt(s.riskScore) >= 55).length, color: "#EF4444" },
        { name: "Moderate", value: students.filter(s => parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55).length, color: "#F59E0B" },
        { name: "Low Risk", value: students.filter(s => parseInt(s.riskScore) < 30).length, color: "#10B981" },
    ];

    // 2. Bar Chart: Primary Drivers
    const factorStats = [
        { name: "Low Attd.", count: students.filter(s => parseFloat(s.attendance) < 75).length },
        { name: "Low GPA", count: students.filter(s => parseFloat(s.gpa) < 5.0).length },
        { name: "Long Dist.", count: students.filter(s => parseFloat(s.distance) > 7).length },
        { name: "Arrears", count: students.filter(s => parseInt(s.arrears) >= 2).length },
        { name: "BPL Status", count: students.filter(s => s.familyIncome === "Below Poverty Line").length },
    ];

    // 3. NEW: Line Chart (Trend Analysis)
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

    if (loading) return <div className="p-10 text-center animate-pulse font-black text-blue-600">REFINING PREDICTIVE MODELS...</div>;

    return (
        <div className="p-8 pt-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tighter">Class Risk Intelligence</h1>
                <p className="text-gray-500 font-bold text-xs mb-10 uppercase tracking-widest">
                    {userData?.school} • Grade {userData?.assignedClass} • Live Update Sync
                </p>

                {/* Top Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Risk Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={riskStats} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                        {riskStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Primary Risk Drivers</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={factorStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* NEW: Full Width Trend Chart */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-8">
                    <h3 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Stability Trend (Avg. Risk Over Time)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer>
                            <LineChart data={getTrendData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="avgRisk" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: "#3B82F6" }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="bg-blue-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Automated Intervention Summary</h2>
                        <p className="opacity-80 font-semibold italic text-sm">Real-time telemetry suggests {riskStats[0].value} student(s) require immediate guidance.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/20 text-center min-w-[200px]">
                        <span className="text-xs font-black uppercase opacity-60">Retention Index</span>
                        <div className="text-4xl font-black">{Math.round((riskStats[2].value / (students.length || 1)) * 100)}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropoutAnalytics;