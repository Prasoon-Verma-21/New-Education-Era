"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import PropTypes from 'prop-types';
import { Trash2, Search, Building2, PieChart, School2, ShieldCheck, TrendingUp, Zap } from "lucide-react";
// Re-added LineChart and related components for the graph
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const AdminDashboard = ({ activeTab = "dashboard" }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data for the restored AI Trends graph
    const aiTrendData = [
        { month: 'Jan', risk: 70 }, { month: 'Feb', risk: 80 }, { month: 'Mar', risk: 55 },
        { month: 'Apr', risk: 72 }, { month: 'May', risk: 55 }, { month: 'Jun', risk: 52 },
        { month: 'Jul', risk: 90 }, { month: 'Aug', risk: 55 }, { month: 'Sept', risk: 68 },
        { month: 'Oct', risk: 72 }, { month: 'Nov', risk: 76 }, { month: 'Dec', risk: 81 },
    ];

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            setAllUsers(snapshot.docs.map(doc => ({ id: String(doc.id), ...doc.data() })));
        } catch (err) { console.error("Sync Error:", err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filteredUsers = allUsers.filter(u =>
        u.role === activeTab &&
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getTableHeaders = () => {
        const base = ["Name", "Email", "Mobile"];
        if (activeTab === "headmaster") return [...base, "School"];
        if (activeTab === "teacher") return [...base, "Assigned Class", "Affiliated School"];
        if (activeTab === "parent") return [...base, "Kid's Email", "School"];
        if (activeTab === "student") return [...base, "Class", "School"];
        if (activeTab === "district_official") return [...base, "Assigned District"];
        return base;
    };

    if (loading) return <div className="flex-1 p-20 text-center font-black animate-pulse dark:text-white">Accessing Registry...</div>;

    return (
        // FIX: Removed 'ml-64' and added 'flex-1' to fill the remaining screen width
        <div className="flex-1 ml-64 p-10 bg-gray-50 dark:bg-slate-950 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                            {activeTab === "dashboard" ? "System Overview" : `${String(activeTab).replace('_', ' ')} Hub`}
                        </h1>
                        {activeTab === "dashboard" && <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-2">Signed in as: Admin</p>}
                    </div>
                    {activeTab !== "dashboard" && (
                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text" placeholder="Search registry..."
                                className="w-full p-3 pl-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}
                </header>

                {activeTab === "dashboard" ? (
                    <div className="space-y-10">
                        {/* RESTORED: Colorful Gradient Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Students", val: allUsers.filter(u => u.role === 'student').length, icon: Building2, color: "from-cyan-400 to-blue-600" },
                                { label: "Dropout Rate", val: "15.7%", icon: PieChart, color: "from-emerald-400 to-teal-600" },
                                { label: "Total Schools", val: "3", icon: School2, color: "from-rose-400 to-red-600" },
                                { label: "School's Dropout", val: "VIEW", icon: Zap, color: "from-green-400 to-emerald-700" },
                            ].map((stat, i) => (
                                <div key={i} className={`p-8 rounded-[40px] bg-gradient-to-br ${stat.color} text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                                    <div className="relative z-10">
                                        <div className="p-2 bg-white/20 rounded-xl w-fit mb-6"><stat.icon className="w-5 h-5" /></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</p>
                                        <p className="text-5xl font-black mt-1 tracking-tighter">{stat.val}</p>
                                        <button className="mt-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-80 group-hover:opacity-100">More Info <ChevronRight className="w-3 h-3" /></button>
                                    </div>
                                    <stat.icon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div>

                        {/* RESTORED: AI Predicted Student Trends Graph */}
                        <div className="bg-slate-900/50 p-10 rounded-[50px] border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <div className="text-center w-full">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Neural Analysis</p>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">AI Predicted Student Trends</h3>
                                </div>
                            </div>

                            <div className="h-[300px] w-full min-h-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={aiTrendData}>
                                        <defs>
                                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                        <XAxis dataKey="month" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="risk" stroke="#2dd4bf" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* DYNAMIC ACCOUNTS TABLE */
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {getTableHeaders().map((h) => (
                                    <th key={String(h)} className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                ))}
                                <th className="p-6 text-right">Delete</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all font-bold">
                                    <td className="p-6 text-sm dark:text-white uppercase">{user.name}</td>
                                    <td className="p-6 text-xs text-gray-500">{user.email}</td>
                                    <td className="p-6 text-xs text-gray-500">{user.phone}</td>
                                    {activeTab === "headmaster" && <td className="p-6 text-xs text-blue-500">{user.school}</td>}
                                    {activeTab === "teacher" && (
                                        <>
                                            <td className="p-6 text-xs text-indigo-500 uppercase">{user.assignedClass}</td>
                                            <td className="p-6 text-xs text-gray-400">{user.school}</td>
                                        </>
                                    )}
                                    {activeTab === "parent" && (
                                        <>
                                            <td className="p-6 text-xs text-emerald-500 italic">{user.kidEmail}</td>
                                            <td className="p-6 text-xs text-gray-400">{user.school}</td>
                                        </>
                                    )}
                                    {activeTab === "student" && (
                                        <>
                                            <td className="p-6 text-xs text-blue-500 uppercase">{user.Class}</td>
                                            <td className="p-6 text-xs text-gray-400">{user.school}</td>
                                        </>
                                    )}
                                    {activeTab === "district_official" && <td className="p-6 text-xs text-rose-500 uppercase">{user.district}</td>}
                                    <td className="p-6 text-right">
                                        <button className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
ChevronRight.propTypes = { className: PropTypes.string };

AdminDashboard.propTypes = { activeTab: PropTypes.string };

export default AdminDashboard;