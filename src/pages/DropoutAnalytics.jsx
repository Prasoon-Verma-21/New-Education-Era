import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowLeft, Filter } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import html2canvas from "html2canvas";

const DISTRICTS = ["Lucknow", "Varanasi", "Kanpur"];
const SCHOOLS = ["Central Academy", "Delhi Public School", "Seth M. R. Jaipuria School"];

const DropoutAnalytics = ({ onBack }) => {
    const { userData } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef();
    const [isExporting, setIsExporting] = useState(false);

    const [selectedDistrict, setSelectedDistrict] = useState("Lucknow");
    const [selectedSchool, setSelectedSchool] = useState("Central Academy");

    useEffect(() => {
        if (!userData?.school) return;
        setLoading(true);

        const studentRef = collection(db, "users");
        const q = query(
            studentRef,
            where("role", "==", "student"),
            where("school", "==", userData.school)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allSchoolStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const filtered = allSchoolStudents.filter(s => {
                if (userData.role === 'admin') {
                    return s.district === selectedDistrict && s.school === selectedSchool;
                }
                const sClass = String(s.class || "").replace(/\D/g, "");
                const tClass = String(userData.assignedClass || "").replace(/\D/g, "");
                return sClass === tClass;
            }).map(s => {
                let risk = 0;
                if (parseFloat(s.attendance_percentage) < 75) risk += 30;
                if (parseFloat(s.current_gpa) < 5.0) risk += 30;
                if (parseInt(s.academic_arrears) >= 2) risk += 20;

                return { ...s, calcRisk: s.riskScore || risk };
            });

            setStudents(filtered);
            setLoading(false);
        }, (error) => {
            console.error("Chart Sync Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData, selectedDistrict, selectedSchool]);

    // --- SIMPLE PDF EXPORT LOGIC ---
    const handleExportPDF = async () => {
        setIsExporting(true);
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();

        // 1. SIMPLE TEXT HEADER
        pdf.setFillColor(30, 41, 59); // Dark Slate
        pdf.rect(0, 0, pageWidth, 40, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.text("STUDENT RETENTION INTELLIGENCE REPORT", pageWidth / 2, 20, { align: "center" });
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`GENERATED ON: ${new Date().toLocaleDateString()} | BATCH 2026`, pageWidth / 2, 30, { align: "center" });

        // 2. EXECUTIVE SUMMARY [cite: 13, 14, 15]
        pdf.setTextColor(40, 40, 40);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("EXECUTIVE SUMMARY", 15, 55);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const summary = [
            `Institution: ${selectedSchool}`,
            `Region: ${selectedDistrict}`,
            `Population Analyzed: ${students.length} Students`,
            `Retention Index: ${students.length > 0 ? Math.round((riskStats[2].value / students.length) * 100) : 0}%`
        ];
        pdf.text(summary, 15, 65);

        // 3. CAPTURE VISUAL CHARTS [cite: 16, 18, 19]
        const chartElement = document.querySelector(".grid");
        if (chartElement) {
            const canvas = await html2canvas(chartElement, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 10, 95, 190, 80);
        }

        // 4. INTERVENTION LIST TABLE [cite: 24, 25]
        const highRisk = [...students]
            .filter(s => s.calcRisk >= 55)
            .sort((a, b) => b.calcRisk - a.calcRisk)
            .slice(0, 10);

        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("PRIORITY INTERVENTION LIST (TOP 10 AT-RISK)", 15, 190);

        autoTable(pdf, {
            startY: 195,
            head: [['Student Name', 'Class', 'Attendance', 'GPA', 'Risk Score']],
            body: highRisk.map(s => [
                s.student_name || s.name,
                s.class,
                `${s.attendance_percentage}%`,
                s.current_gpa,
                `${s.calcRisk}%`
            ]),
            headStyles: { fillColor: [239, 68, 68] },
            theme: 'striped'
        });

        // 5. FOOTER [cite: 26]
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Generated by New Education Era AI Analytics Engine", pageWidth / 2, 285, { align: "center" });

        pdf.save(`Intelligence_Report_${selectedSchool.replace(/\s+/g, '_')}.pdf`);
        setIsExporting(false);
    };

    const riskStats = [
        { name: "High Risk", value: students.filter(s => s.calcRisk >= 55).length, color: "#EF4444" },
        { name: "Moderate", value: students.filter(s => s.calcRisk >= 30 && s.calcRisk < 55).length, color: "#F59E0B" },
        { name: "Low Risk", value: students.filter(s => s.calcRisk < 30).length, color: "#10B981" },
    ];

    const factorStats = [
        { name: "Low Attd.", count: students.filter(s => parseFloat(s.attendance_percentage) < 75).length },
        { name: "Low GPA", count: students.filter(s => parseFloat(s.current_gpa) < 5.0).length },
        { name: "Long Dist.", count: students.filter(s => parseFloat(s.distance_from_school_km) > 7).length },
        { name: "Arrears", count: students.filter(s => parseInt(s.academic_arrears) >= 2).length },
    ];

    if (loading) return (
        <div className="p-10 pt-32 text-center animate-pulse font-black text-blue-600 dark:text-indigo-400 bg-gray-50 dark:bg-slate-950 min-h-screen uppercase tracking-widest">
            SYNCHRONIZING ANALYTIC ENGINE...
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <button onClick={onBack} className="flex items-center text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2 hover:translate-x-[-4px] transition-transform no-print">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Overview
                        </button>
                        <h1 className="text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter leading-none">Intelligence Feed</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                            {userData?.role === 'admin' ? `District: ${selectedDistrict}` : `Live: ${userData?.school} (Class ${userData?.assignedClass})`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {userData?.role === 'admin' && (
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border dark:border-slate-800">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none dark:text-white cursor-pointer">
                                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none dark:text-white cursor-pointer">
                                    {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                        >
                            {isExporting ? "Generating..." : "Download Report"}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border dark:border-slate-800 flex flex-col">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase mb-10 tracking-widest">Risk Distribution</h3>
                        <div className="h-[350px] w-full min-h-[350px] relative mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={riskStats} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" animationDuration={1000}>
                                        {riskStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] shadow-sm border dark:border-slate-800 flex flex-col">
                        <h3 className="font-black text-gray-400 text-[10px] uppercase mb-10 tracking-widest">Primary Risk Drivers</h3>
                        <div className="h-[350px] w-full min-h-[350px] relative mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={factorStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-10" />
                                    <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '15px', border: 'none', fontWeight: 'bold' }} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[15, 15, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-600 dark:bg-indigo-700 rounded-[50px] p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Intervention Feed</h2>
                        <p className="opacity-80 font-semibold text-xs uppercase tracking-widest italic">
                            Analyzing {students.length} Total Students
                        </p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-[35px] border border-white/20 text-center backdrop-blur-md min-w-[200px]">
                        <span className="text-[10px] font-black uppercase opacity-60">Retention Index</span>
                        <div className="text-5xl font-black">
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