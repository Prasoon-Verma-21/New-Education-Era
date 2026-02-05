import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Download, Send, History, ShieldCheck } from "lucide-react";
import AdvancedSearch from "../components/AdvancedSearch";

const DistrictDashboard = () => {
    const { userData, loading: authLoading } = useAuth();
    const [districtStats, setDistrictStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ students: 0, critical: 0 });
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [selectedAuditStudent, setSelectedAuditStudent] = useState(null);
    const [broadcastSubject, setBroadcastSubject] = useState("");
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [myNotices, setMyNotices] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [allStudents, setAllStudents] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const districtAvg = totals.students > 0
        ? Math.round(((totals.students - totals.critical) / totals.students) * 100)
        : 0;

    const chartData = districtStats.map(school => ({
        name: school.name,
        stability: school.total > 0 ? Math.round(((school.total - school.highRisk) / school.total) * 100) : 100,
        average: districtAvg
    }));

    // --- FIXED PDF GENERATION LOGIC ---
    const generatePDF = () => {
        // Guard: Prevent crash if data hasn't loaded
        if (!districtStats || districtStats.length === 0) {
            Swal.fire("Data Loading", "Please wait for the metrics to load before exporting.", "warning");
            return;
        }

        try {
            const doc = new jsPDF();
            const districtName = userData?.district || "District";

            // 1. Header & Branding
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59); // Sleek Slate-800
            doc.text("District Education Stability Audit", 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Jurisdiction: ${districtName} | Date: ${new Date().toLocaleDateString()}`, 14, 30);
            doc.line(14, 35, 196, 35);

            // 2. Summary Row
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.text(`Total Enrollment: ${totals.students}`, 14, 45);
            doc.text(`Critical Cases: ${totals.critical}`, 70, 45);
            doc.text(`Stability Index: ${districtAvg}%`, 130, 45);

            // 3. SAFE Data Mapping
            // We map directly from districtStats to avoid "undefined" errors
            const tableRows = districtStats.map(school => {
                const stability = school.total > 0
                    ? Math.round(((school.total - school.highRisk) / school.total) * 100)
                    : 100;
                return [
                    school.name,
                    school.total,
                    school.highRisk,
                    `${stability}%`
                ];
            });

            // 4. Generate Table
            autoTable(doc, {
                head: [["Institution Name", "Total Students", "Critical Cases", "Stability %"]],
                body: tableRows,
                startY: 55,
                theme: 'striped',
                headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 4 }
            });

            // 5. Save with safe filename
            const fileName = `${districtName.replace(/\s+/g, '_')}_Audit.pdf`;
            doc.save(fileName);

            Swal.fire("Success", "Audit report has been downloaded.", "success");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            // Updated error message to help us debug if it happens again
            Swal.fire("Export Failed", `Details: ${error.message}`, "error");
        }
    };

    const fetchData = async () => {
        if (authLoading || !userData?.district) return;
        try {
            const q = query(collection(db, "students"), where("district", "==", userData.district));
            const querySnapshot = await getDocs(q);
            const fetchedStudents = querySnapshot.docs.map(doc => doc.data());

            setAllStudents(fetchedStudents);
            setFilteredData(fetchedStudents);

            const schoolGroups = fetchedStudents.reduce((acc, s) => {
                const schoolName = s.school || "Unassigned";
                if (!acc[schoolName]) {
                    acc[schoolName] = { name: schoolName, total: 0, highRisk: 0, students: [] };
                }
                acc[schoolName].total++;
                acc[schoolName].students.push(s);
                if (parseInt(s.riskScore || 0) >= 55) acc[schoolName].highRisk++;
                return acc;
            }, {});

            setDistrictStats(Object.values(schoolGroups));
            setTotals({
                students: fetchedStudents.length,
                critical: fetchedStudents.filter(s => parseInt(s.riskScore || 0) >= 55).length
            });

            const noticeQ = query(collection(db, "notices"), where("district", "==", userData.district), where("scope", "==", "district"));
            const noticeSnap = await getDocs(noticeQ);
            setMyNotices(noticeSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [userData, authLoading]);

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
        <div className="p-10 pt-32 min-h-screen bg-slate-50 dark:bg-slate-950 text-center font-black text-indigo-600 dark:text-indigo-400 animate-pulse uppercase tracking-widest transition-colors">
            Initializing Command...
        </div>
    );

    return (
        <div className="p-8 pt-24 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">District Oversight</h1>
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-1">Jurisdiction: {userData?.district}</p>
                    </div>
                    <button onClick={generatePDF} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none">
                        <Download className="w-4 h-4" /> Export Audit Report
                    </button>
                </header>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-indigo-600 text-center transition-all">
                        <p className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase mb-2">Total Enrollment</p>
                        <h2 className="text-5xl font-black text-slate-800 dark:text-white">{totals.students}</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-red-600 text-center transition-all">
                        <p className="text-red-400 font-black text-xs uppercase mb-2">Critical Alerts</p>
                        <h2 className="text-5xl font-black text-red-600">{totals.critical}</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border-t-8 border-emerald-500 text-center transition-all">
                        <p className="text-emerald-500 font-black text-xs uppercase mb-2">Stability Index</p>
                        <h2 className="text-5xl font-black text-emerald-600">{totals.students > 0 ? Math.round(((totals.students - totals.critical) / totals.students) * 100) : 100}%</h2>
                    </div>
                </div>

                {/* Directive Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="bg-indigo-700 dark:bg-indigo-900 p-8 rounded-[40px] shadow-2xl text-white transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <Send className="w-5 h-5 text-indigo-300" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">{editingId ? "Edit Directive" : "New Directive"}</h2>
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Subject Line" value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-bold outline-none border-none focus:ring-4 focus:ring-indigo-400" />
                            <textarea placeholder="Instruction Body..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="w-full p-4 rounded-2xl text-slate-900 font-semibold outline-none h-32 border-none focus:ring-4 focus:ring-indigo-400" />
                            <div className="flex gap-4">
                                <button onClick={handleBroadcast} className="flex-grow bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors">{editingId ? "Save Changes" : "Send Broadcast"}</button>
                                {editingId && <button onClick={() => {setEditingId(null); setBroadcastSubject(""); setBroadcastMessage("");}} className="bg-red-500 px-8 rounded-2xl font-bold uppercase text-[10px]">Cancel</button>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <History className="w-5 h-5 text-slate-400" />
                            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Broadcast Registry</h2>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                            {myNotices.map(n => (
                                <div key={n.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 transition-all">
                                    <p className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate max-w-[200px]">{n.subject}</p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {setEditingId(n.id); setBroadcastSubject(n.subject); setBroadcastMessage(n.message);}} className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase">Edit</button>
                                        <button onClick={async () => { if(window.confirm("Delete?")) { await deleteDoc(doc(db, "notices", n.id)); fetchData(); }}} className="text-red-500 font-black text-[10px] uppercase">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analytics Chart */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl mb-12 border border-slate-100 dark:border-slate-800 transition-all">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Stability Trend vs. District Average</h3>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
                                <Bar dataKey="stability" radius={[10, 10, 10, 10]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.stability < districtAvg ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Bar>
                                <ReferenceLine y={districtAvg} stroke="#10b981" strokeDasharray="3 3" strokeWidth={2} />
                                <Line type="monotone" dataKey="stability" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <AdvancedSearch
                    data={allStudents}
                    onFilter={(results) => setFilteredData(results)}
                />

                {/* Search Results */}
                {filteredData.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-10 mb-12 border border-blue-50 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500 transition-all">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-black uppercase text-blue-600 dark:text-indigo-400 tracking-widest">
                                Search Results ({filteredData.length})
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.slice(0, 50).map((student, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-blue-300 dark:hover:border-indigo-500 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="font-black text-slate-800 dark:text-slate-100 text-lg uppercase tracking-tight">{student.name}</p>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${parseInt(student.riskScore) >= 55 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {student.riskLabel}
                                        </span>
                                    </div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">
                                        {student.school} • Grade {student.class}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                            SCORE: {student.riskScore}%
                                        </div>
                                        <button
                                            onClick={() => setSelectedAuditStudent(student)} // Added this
                                            className="opacity-0 group-hover:opacity-100 text-[9px] font-black text-blue-500 dark:text-indigo-400 underline hover:text-blue-700 transition-colors uppercase tracking-widest"
                                        >
                                            View Full Audit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Heatmap */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all">
                    <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white transition-colors">
                        <h3 className="font-bold text-lg uppercase tracking-widest">Inter-School Risk Heatmap</h3>
                    </div>
                    <div className="p-8 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase border-b dark:border-slate-800 pb-4">
                                <th className="pb-4">Institution</th>
                                <th className="pb-4">Risk Distribution</th>
                                <th className="pb-4 text-right pr-4">Audit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {districtStats.map(school => (
                                <tr key={school.name} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                    <td className="py-6 font-black text-slate-800 dark:text-slate-200">{school.name}</td>
                                    <td className="py-6 w-1/2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                                                <div className="bg-red-500 h-full" style={{ width: `${(school.highRisk / school.total) * 100}%` }}></div>
                                                <div className="bg-indigo-400 h-full" style={{ width: `${((school.total - school.highRisk) / school.total) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-red-500 uppercase">{school.highRisk} Critical</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right pr-4">
                                        <button onClick={() => setSelectedSchool(school)} className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all">View Audit</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Selected School Modal */}
            {selectedSchool && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col animate-in zoom-in duration-300">
                        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center shadow-lg">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedSchool.name}</h2>
                            <button onClick={() => setSelectedSchool(null)} className="text-4xl font-light hover:text-indigo-200 transition-colors">×</button>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase border-b dark:border-slate-800">
                                    <th className="pb-3 uppercase tracking-widest">Student Name</th>
                                    <th className="pb-3 text-right uppercase tracking-widest pr-4">Risk Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedSchool.students.map((student, idx) => (
                                    <tr key={idx} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="py-4 font-bold text-slate-800 dark:text-slate-200">{student.name}</td>
                                        <td className="py-4 text-right font-black text-red-600 pr-4">{student.riskScore}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {/* Student Audit Detail Modal */}
            {selectedAuditStudent && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border dark:border-slate-800 animate-in zoom-in duration-300">
                        <div className="p-8 bg-blue-600 dark:bg-indigo-600 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedAuditStudent.name}</h2>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                                    {selectedAuditStudent.school} • Grade {selectedAuditStudent.class}
                                </p>
                            </div>
                            <button onClick={() => setSelectedAuditStudent(null)} className="text-3xl font-light hover:rotate-90 transition-transform">×</button>
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Attendance</p>
                                <p className={`text-xl font-black ${parseInt(selectedAuditStudent.attendance) < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {selectedAuditStudent.attendance}%
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current GPA</p>
                                <p className="text-xl font-black dark:text-white">{selectedAuditStudent.gpa}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Arrears/Backlogs</p>
                                <p className="text-xl font-black dark:text-white">{selectedAuditStudent.arrears}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Commute Dist.</p>
                                <p className="text-xl font-black dark:text-white">{selectedAuditStudent.distance} KM</p>
                            </div>

                            <div className="col-span-2 p-6 bg-blue-50 dark:bg-indigo-950/30 rounded-3xl border border-blue-100 dark:border-indigo-900/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-blue-800 dark:text-indigo-300 uppercase">Risk Evaluation</span>
                                    <span className="text-xs font-black text-blue-600 dark:text-indigo-400">{selectedAuditStudent.riskScore}%</span>
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 italic">
                                    &quot;{selectedAuditStudent.riskLabel}: Student shows potential vulnerability in {parseInt(selectedAuditStudent.attendance) < 75 ? 'attendance' : 'socio-economic'} markers.&quot;
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
                            <button
                                onClick={() => setSelectedAuditStudent(null)}
                                className="bg-slate-900 dark:bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                            >
                                Close Audit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DistrictDashboard;