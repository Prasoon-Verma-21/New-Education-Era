import React, { useState } from 'react';
import jsPDF from 'jspdf';

const EarlyWarning = () => {
  const [formData, setFormData] = useState({
    name: '', attendance: '', distance: '', parentJob: 'Agriculture',
    parentEdu: 'Primary', gpa: '', participation: '5', areaType: 'Rural',
    pwd: 'No', familyIncome: 'Low', arrears: '0'
  });

  const [result, setResult] = useState({ label: '', score: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedName, setAnalyzedName] = useState('');

  const handlePredict = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult({ label: '', score: 0 });

    setTimeout(() => {
      setAnalyzedName(formData.name);
      let riskScore = 0;

      // Weighted Logic
      if (parseFloat(formData.attendance) < 75) riskScore += 25;
      if (parseFloat(formData.gpa) < 5.0) riskScore += 15;
      if (parseInt(formData.arrears) >= 2) riskScore += 15;
      if (parseFloat(formData.distance) > 7) riskScore += 10;
      if (formData.familyIncome === 'Below Poverty Line') riskScore += 10;
      if (formData.parentJob === 'Daily Wage' || formData.parentJob === 'Migrant Labor') riskScore += 10;
      if (parseFloat(formData.participation) <= 4) riskScore += 10;

      let riskLabel = riskScore >= 55 ? "High Risk" : riskScore >= 30 ? "Moderate Risk" : "Low Risk";
      setResult({ label: riskLabel, score: riskScore });
      setIsAnalyzing(false);
    }, 800);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const startX = 20;

    // 1. Background
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Color Logic
    const getColor = (type, val) => {
      if (type === 'att') return val < 75 ? [255, 0, 0] : val < 85 ? [218, 165, 32] : [0, 128, 0];
      if (type === 'gpa') return val < 5.0 ? [255, 0, 0] : val < 7.0 ? [218, 165, 32] : [0, 128, 0];
      if (type === 'arr') return val >= 5 ? [255, 0, 0] : val >= 2 ? [218, 165, 32] : [0, 128, 0];
      if (type === 'inc') return val === 'Below Poverty Line' ? [255, 0, 0] : val === 'Low' ? [218, 165, 32] : [0, 128, 0];
      if (type === 'job') return (val === 'Daily Wage' || val === 'Migrant Labor') ? [255, 0, 0] : val === 'Agriculture' ? [218, 165, 32] : [0, 128, 0];
      if (type === 'edu') return (val === 'Illiterate' || val === 'No Formal Education') ? [255, 0, 0] : val === 'Primary' ? [218, 165, 32] : [0, 128, 0];
      if (type === 'pwd') return val === 'Yes' ? [255, 0, 0] : [0, 128, 0];
      return [0, 0, 0];
    };

    const drawLine = (label, val, y, type, rawVal) => {
      doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal');
      doc.text(label, startX + 5, y);
      const color = getColor(type, rawVal);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(val, startX + 5 + doc.getTextWidth(label) + 2, y);
      doc.setTextColor(0, 0, 0);
    };

    // Header
    doc.setFontSize(22); doc.setTextColor(0, 51, 102); doc.setFont(undefined, 'bold');
    doc.text("New Education Era: Risk Assessment Report", 20, 20);

    // Bold Name Snapshot
    doc.setFontSize(14); doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal');
    doc.text("Student Name: ", 20, 35);
    doc.setFont(undefined, 'bold'); doc.text(analyzedName, 20 + doc.getTextWidth("Student Name: ") + 2, 35);
    doc.line(20, 38, 190, 38);

    // RESTORED SECTIONS
    doc.setFont(undefined, 'bold'); doc.text("1. Academic History", 20, 50);
    drawLine("Attendance %: ", `${formData.attendance}%`, 60, 'att', parseFloat(formData.attendance));
    drawLine("Current GPA: ", `${formData.gpa}`, 70, 'gpa', parseFloat(formData.gpa));
    drawLine("Number of Arrears: ", `${formData.arrears}`, 80, 'arr', parseInt(formData.arrears));

    doc.setFont(undefined, 'bold'); doc.text("2. Socio-Economic Factors", 20, 100);
    drawLine("Family Income: ", formData.familyIncome, 110, 'inc', formData.familyIncome);
    drawLine("Parental Occupation: ", formData.parentJob, 120, 'job', formData.parentJob);
    drawLine("Parental Education: ", formData.parentEdu, 130, 'edu', formData.parentEdu);

    doc.setFont(undefined, 'bold'); doc.text("3. Environment", 20, 150);
    doc.setFont(undefined, 'normal');
    doc.text(`Distance to School: ${formData.distance} km`, 25, 160);
    doc.text(`Area Type: ${formData.areaType}`, 25, 170);

    doc.setFont(undefined, 'bold'); doc.text("Specialty Needs", 20, 190);
    drawLine("PWD Status: ", formData.pwd, 200, 'pwd', formData.pwd);

    // Final Footer
    doc.setTextColor(0, 0, 0); doc.line(20, 210, 190, 210);
    doc.setFontSize(16); doc.text(`FINAL RISK LEVEL: ${result.label.toUpperCase()}`, 20, 225);
    doc.text(`RISK SCORE: ${result.score}/100`, 20, 235);

    doc.save(`${analyzedName}_Report.pdf`);
  };

  return (
      <div className="p-8 max-w-6xl mx-auto bg-white shadow-xl rounded-2xl mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-4">New Education Era: Dropout Predictor</h2>
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="space-y-4 bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 text-lg">Academic Profile</h3>
            <input type="text" placeholder="Student Name" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="number" min="0" max="100" placeholder="Attendance %" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, attendance: e.target.value})} />
            <input type="number" min="0" max="10" step="0.1" placeholder="Current GPA" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, gpa: e.target.value})} />
            <input type="number" min="0" placeholder="No. of Arrears" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, arrears: e.target.value})} />
          </div>

          <div className="space-y-4 bg-green-50 p-5 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-800 text-lg">Socio-Economic</h3>
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, familyIncome: e.target.value})}>
              <option value="Middle">Middle Income</option>
              <option value="Low">Low Income</option>
              <option value="Below Poverty Line">Below Poverty Line (BPL)</option>
            </select>
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, parentJob: e.target.value})}>
              <option value="Salaried">Salaried</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Daily Wage">Daily Wage Labor</option>
              <option value="Migrant Labor">Migrant Labor</option>
            </select>
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, parentEdu: e.target.value})}>
              <option value="Secondary">Secondary Education</option>
              <option value="Illiterate">No Formal Education</option>
              <option value="Primary">Primary Education</option>
            </select>
          </div>

          <div className="space-y-4 bg-purple-50 p-5 rounded-xl border border-purple-100">
            <h3 className="font-bold text-purple-800 text-lg">Environment</h3>
            <input type="number" min="0" placeholder="Distance (km)" required className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, distance: e.target.value})} />
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, areaType: e.target.value})}>
              <option value="Rural">Rural</option>
              <option value="Urban">Urban</option>
            </select>
            <select className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, pwd: e.target.value})}>
              <option value="No">Special Needs: No</option>
              <option value="Yes">Special Needs: Yes</option>
            </select>
            <div className="pt-2">
              <label className="text-xs font-bold text-purple-700">Participation (1-10)</label>
              <input type="range" min="1" max="10" className="w-full" onChange={(e) => setFormData({...formData, participation: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={isAnalyzing} className={`md:col-span-3 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${isAnalyzing ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'}`}>
            {isAnalyzing ? "Processing 11 Risk Factors..." : "Generate Risk Prediction Report"}
          </button>
        </form>

        {result.label && !isAnalyzing && (
            <div className="mt-10 p-8 rounded-2xl text-center border-4 border-dashed border-gray-200">
              <h3 className={`text-4xl font-black ${result.label === 'High Risk' ? 'text-red-600' : 'text-green-600'}`}>
                {result.label.toUpperCase()} ({result.score}/100)
              </h3>
              <button onClick={downloadReport} className="mt-6 bg-green-600 text-white px-10 py-3 rounded-full font-bold hover:bg-green-700 shadow-md">
                Download PDF Intervention Report
              </button>
            </div>
        )}
      </div>
  );
};

export default EarlyWarning;