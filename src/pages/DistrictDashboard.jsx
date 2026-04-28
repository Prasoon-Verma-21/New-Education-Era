import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Download, Send, History, ShieldCheck, X, ArrowUpDown, School } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdvancedSearch from "../components/AdvancedSearch";

const DistrictDashboard = () => {
    const { userData, loading: authLoading } = useAuth();
    const [districtStats, setDistrictStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ students: 0, critical: 0 });
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [broadcastSubject, setBroadcastSubject] = useState("");
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [myNotices, setMyNotices] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [sortType, setSortType] = useState("alphabetical");
    const [modalFilter, setModalFilter] = useState("all");

    const districtAvg = totals.students > 0
        ? Math.round(((totals.students - totals.critical) / totals.students) * 100)
        : 0;

    const chartData = districtStats.map(school => ({
        name: school.name,
        stability: school.total > 0 ? Math.round(((school.total - school.highRisk) / school.total) * 100) : 100,
        average: districtAvg
    }));

    // --- PDF LOGIC 1: District Summary ---
    const generateDistrictSummaryPDF = () => {
        if (!districtStats.length) return;
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text("District Stability Summary", 14, 20);
            doc.setFontSize(10);
            doc.text(`Jurisdiction: ${userData?.district} | Date: ${new Date().toLocaleDateString()}`, 14, 28);

            const tableRows = districtStats.map(s => [
                s.name, s.total, s.highRisk, `${Math.round(s.riskRate)}%`
            ]);

            autoTable(doc, {
                head: [["Institution", "Total Students", "Critical Cases", "Risk Rate"]],
                body: tableRows,
                startY: 35,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229] }
            });

            doc.save(`${userData.district}_Summary.pdf`);
        } catch (err) { console.error(err); }
    };

    // --- PDF LOGIC 2: School-Specific High-Risk Audit ---
    const generateSchoolAuditPDF = (school) => {
        try {
            const doc = new jsPDF();
            // Branding
            doc.setFillColor(79, 70, 229);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.text("INSTITUTIONAL RISK AUDIT", 14, 25);

            // Metrics
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(16);
            doc.text(school.name.toUpperCase(), 14, 55);
            doc.setFontSize(10);
            doc.text(`Total Students: ${school.total} | Critical Cases: ${school.highRisk}`, 14, 62);
            doc.line(14, 65, 196, 65);

            // Filter for Priority Students (Risk >= 30%)
            const priorityStudents = school.students
                .filter(s => parseInt(s.riskScore) >= 30)
                .sort((a, b) => b.riskScore - a.riskScore);

            const rows = priorityStudents.map(s => [
                s.name, `Grade ${s.class}`, `${s.riskScore}%`,
                parseInt(s.riskScore) >= 55 ? "CRITICAL" : "MODERATE"
            ]);

            autoTable(doc, {
                head: [["Student Name", "Class", "Risk Score", "Status"]],
                body: rows,
                startY: 75,
                headStyles: { fillColor: [79, 70, 229] },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 3) {
                        if (data.cell.raw === "CRITICAL") doc.setTextColor(220, 38, 38);
                        else doc.setTextColor(217, 119, 6);
                    }
                }
            });

            doc.save(`${school.name}_Risk_Audit.pdf`);
            Swal.fire("Audit Downloaded", `Priority report for ${school.name} is ready.`, "success");
        } catch (err) { console.error(err); }
    };

    const fetchData = async () => {
        if (authLoading || !userData?.district) return;
        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("role", "==", "student"), where("district", "==", userData.district));
            const querySnapshot = await getDocs(q);

            const fetchedStudents = querySnapshot.docs.map(doc => {
                const s = doc.data();
                let risk = 0;
                // Risk Engine logic
                if (parseFloat(s.attendance_percentage) < 75) risk += 30;
                if (parseFloat(s.current_gpa) < 5.0) risk += 30;
                if (parseInt(s.academic_arrears) >= 2) risk += 20;

                return {
                    id: doc.id, ...s,
                    name: s.student_name || s.name || "Unknown Student",
                    riskScore: s.riskScore || risk,
                };
            });

            const schoolGroups = fetchedStudents.reduce((acc, s) => {
                const schoolName = s.school || "Unassigned";
                if (!acc[schoolName]) {
                    acc[schoolName] = { name: schoolName, total: 0, highRisk: 0, moderate: 0, stable: 0, students: [] };
                }
                acc[schoolName].total++;
                acc[schoolName].students.push(s);
                const score = parseInt(s.riskScore);
                if (score >= 55) acc[schoolName].highRisk++;
                else if (score >= 30) acc[schoolName].moderate++;
                else acc[schoolName].stable++;
                acc[schoolName].riskRate = (acc[schoolName].highRisk / acc[schoolName].total) * 100;
                return acc;
            }, {});

            setDistrictStats(Object.values(schoolGroups));
            setTotals({
                students: fetchedStudents.length,
                critical: fetchedStudents.filter(s => parseInt(s.riskScore) >= 55).length
            });

            const noticeQ = query(collection(db, "notices"), where("district", "==", userData.district), where("scope", "==", "district"));
            const noticeSnap = await getDocs(noticeQ);
            setMyNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [userData, authLoading]);

    const sortedSchools = [...districtStats].sort((a, b) => {
        if (sortType === "risk") return b.riskRate - a.riskRate;
        return a.name.localeCompare(b.name);
    });

    const handleBroadcast = async () => {
        if (!broadcastSubject || !broadcastMessage) return;
        try {
            if (editingId) {
                await updateDoc(doc(db, "notices", editingId), { subject: broadcastSubject, message: broadcastMessage, updatedAt: new Date().toISOString() });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "notices"), { subject: broadcastSubject, message: broadcastMessage, district: userData.district, scope: "district", author: userData.username, createdAt: new Date().toISOString() });
            }
            setBroadcastSubject(""); setBroadcastMessage(""); fetchData();
            Swal.fire("Success", "Directive broadcasted.", "success");
        } catch (err) { console.error(err); }
    };

    if (authLoading || loading) return (
        <div className="p-10 pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 text-center font-black text-indigo-600 animate-pulse uppercase tracking-widest">
            Synchronizing Command Center...
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">District Oversight</h1>
                        <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest mt-1">Jurisdiction: {userData?.district}</p>
                    </div>
                    {/* Fixed: Now calls the District Summary Function */}
                    <button onClick={generateDistrictSummaryPDF} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
                        <Download className="w-4 h-4" /> Export District Summary
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-indigo-600 text-center">
                        <p className="text-slate-400 font-black text-xs uppercase mb-2">District Enrollment</p>
                        <h2 className="text-5xl font-black dark:text-white">{totals.students}</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-red-600 text-center">
                        <p className="text-red-400 font-black text-xs uppercase mb-2">Total Critical</p>
                        <h2 className="text-5xl font-black text-red-600">{totals.critical}</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500 text-center">
                        <p className="text-emerald-500 font-black text-xs uppercase mb-2">Stability Index</p>
                        <h2 className="text-5xl font-black text-emerald-600">{districtAvg}%</h2>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Institutional Health</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage schools across {userData?.district}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setSortType("alphabetical")} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${sortType === 'alphabetical' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border dark:border-slate-800'}`}>
                                <ArrowUpDown className="w-3 h-3" /> Sort A-Z
                            </button>
                            <button onClick={() => setSortType("risk")} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${sortType === 'risk' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border dark:border-slate-800'}`}>
                                <ArrowUpDown className="w-3 h-3" /> Rank by Risk
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedSchools.map((school, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border dark:border-slate-800 hover:border-indigo-500 transition-all group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-indigo-600"><School className="w-6 h-6" /></div>
                                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter truncate">{school.name}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                        <p className="text-[8px] font-black text-slate-400 uppercase">Enrolled</p>
                                        <p className="text-lg font-black dark:text-white">{school.total}</p>
                                    </div>
                                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl">
                                        <p className="text-[8px] font-black text-red-400 uppercase">Critical</p>
                                        <p className="text-lg font-black text-red-600">{school.highRisk}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedSchool(school); setModalFilter("all"); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all">
                                    View Deep Audit →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Directive & Chart Sections remain unchanged */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-indigo-700 dark:bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white">
                        <div className="flex items-center gap-3 mb-6"><Send className="w-5 h-5 text-indigo-300" /><h2 className="text-2xl font-black uppercase tracking-tighter">New District Directive</h2></div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Subject" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-bold outline-none" />
                            <textarea placeholder="Instruction Body..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-semibold outline-none h-32" />
                            <button onClick={handleBroadcast} className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">Deploy Broadcast</button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border dark:border-slate-800 flex flex-col">
                        <div className="flex items-center gap-3 mb-6"><History className="w-5 h-5 text-slate-400" /><h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Directive History</h2></div>
                        <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                            {myNotices.map(n => (
                                <div key={n.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center group border border-transparent hover:border-indigo-100 transition-all">
                                    <p className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate max-w-[200px]">{n.subject}</p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {setEditingId(n.id); setBroadcastSubject(n.subject); setBroadcastMessage(n.message);}} className="text-indigo-600 font-black text-[10px] uppercase">Edit</button>
                                        <button onClick={async () => { if(window.confirm("Delete?")) { await deleteDoc(doc(db, "notices", n.id)); fetchData(); }}} className="text-red-500 font-black text-[10px] uppercase">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl mb-12 border dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-8"><ShieldCheck className="w-5 h-5 text-emerald-500" /><h3 className="font-black dark:text-white uppercase tracking-tighter">Inter-School Performance</h3></div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="stability" radius={[10, 10, 10, 10]} barSize={40}>
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.stability < districtAvg ? '#ef4444' : '#6366f1'} />)}
                                </Bar>
                                <ReferenceLine y={districtAvg} stroke="#10b981" strokeDasharray="3 3" strokeWidth={2} />
                                <Line type="monotone" dataKey="stability" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* DEEP AUDIT MODAL: Internal School Monitoring */}
            <AnimatePresence>
                {selectedSchool && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[60px] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col">

                            {/* Header with Export School Audit Button */}
                            <div className="p-10 bg-indigo-600 text-white flex justify-between items-center shadow-2xl">
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-[0.2em]">Institutional Audit Feed</p>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedSchool.name}</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* NEW: Export School Audit Button */}
                                    <button
                                        onClick={() => generateSchoolAuditPDF(selectedSchool)}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Export School Audit
                                    </button>
                                    <button onClick={() => setSelectedSchool(null)} className="p-4 hover:bg-white/10 rounded-full transition-all group">
                                        <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Bar and Table remains same as your design fix */}
                            <div className="px-10 py-8 bg-slate-50 dark:bg-slate-950/50 border-b dark:border-slate-800 flex gap-4">
                                {[{ id: 'all', label: 'All Registry', active: 'bg-indigo-600 text-white' }, { id: 'critical', label: 'Critical', active: 'bg-red-600 text-white' }, { id: 'moderate', label: 'Moderate', active: 'bg-amber-500 text-white' }, { id: 'stable', label: 'Stable', active: 'bg-emerald-600 text-white' }].map(f => (
                                    <button key={f.id} onClick={() => setModalFilter(f.id)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg ${modalFilter === f.id ? `${f.active}` : 'bg-white dark:bg-slate-800 text-slate-400 border dark:border-slate-700'}`}>{f.label}</button>
                                ))}
                            </div>

                            <div className="p-10 overflow-y-auto flex-grow custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="text-[11px] font-black text-slate-400 uppercase border-b dark:border-slate-800 pb-6"><th className="pb-6 px-4">Student Profile</th><th className="pb-6 px-4 text-center">Risk score</th><th className="pb-6 px-4 text-right">Grade</th></tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-800">
                                    {selectedSchool.students
                                        .filter(s => {
                                            if (modalFilter === "critical") return parseInt(s.riskScore) >= 55;
                                            if (modalFilter === "moderate") return parseInt(s.riskScore) >= 30 && parseInt(s.riskScore) < 55;
                                            if (modalFilter === "stable") return parseInt(s.riskScore) < 30;
                                            return true;
                                        })
                                        .map((student, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-7 px-4"><p className="font-black text-slate-800 dark:text-slate-100 text-lg uppercase tracking-tight">{student.name}</p><p className="text-[10px] font-bold text-slate-400 lowercase opacity-60">{student.email}</p></td>
                                                <td className="py-7 px-4 text-center"><span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${parseInt(student.riskScore) >= 55 ? 'bg-red-100 text-red-600' : parseInt(student.riskScore) >= 30 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{student.riskScore}% Risk</span></td>
                                                <td className="py-7 px-4 text-right"><span className="font-black text-slate-400 uppercase text-xs">Grade {student.class}</span></td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DistrictDashboard;