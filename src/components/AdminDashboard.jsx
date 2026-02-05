"use client";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Search, Building2, PieChart, School2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

const AdminDashboard = ({ activeTab }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) { console.error("Sync Error:", err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    // Filters users based on the Sidebar selection and Search box
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

    if (loading) return <div className="ml-64 p-20 text-center font-black animate-pulse">Accessing Registry...</div>;

    return (
        <div className="ml-64 p-10 bg-gray-50 dark:bg-slate-950 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {activeTab === "dashboard" ? "System Overview" : `${activeTab.replace('_', ' ')} Hub`}
                    </h1>
                    {activeTab !== "dashboard" && (
                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text" placeholder="Search registry..."
                                className="w-full p-3 pl-12 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 ring-blue-500/20"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}
                </header>

                {activeTab === "dashboard" ? (
                    /* HOME OVERVIEW - Real counts from Database */
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Students", role: "student", icon: Building2, color: "bg-cyan-500" },
                            { label: "Teachers", role: "teacher", icon: ShieldCheck, color: "bg-indigo-500" },
                            { label: "Principals", role: "headmaster", icon: School2, color: "bg-rose-500" },
                            { label: "Officials", role: "district_official", icon: PieChart, color: "bg-emerald-600" },
                        ].map(stat => (
                            <div key={stat.role} className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-2 h-full ${stat.color}`} />
                                <stat.icon className="w-6 h-6 text-gray-400 mb-4" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-5xl font-black text-slate-900 dark:text-white">
                                    {allUsers.filter(u => u.role === stat.role).length}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* DYNAMIC ACCOUNTS TABLE */
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {getTableHeaders().map(h => (
                                    <th key={h} className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
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

                                    {/* Dynamic Role columns mapping */}
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
                                            <Trash2 className="w-4 h-4" />
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

export default AdminDashboard;