import { Building2, PieChart, School, School2, User, UserMinus, Users } from "lucide-react";
import React from "react";
import StudentAdminDashboard from "../studentdetails/StudentAdminDash";
import StatCard from "./StatCard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";



const Dashboard = () => {
  // const user = { role: "superAdmin", name: "Ayush" };
  // const user = { role: "admin", name: "Rahul" };
  // const user = { role: "subAdmin", name: "Manoj"};

   const {user, loading} = useAuth()
   const navigate = useNavigate()

  // AI Generated Data for Line Chart (Demo Data)
  const aiData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Nov", "Dec"], // X-axis months
    datasets: [
      {
        label: "AI Predictions", // Label for the line
        data: [70, 79, 56, 71, 56, 52, 90, 56, 65, 70], // Sample AI prediction data
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.1, // Smoothness of the line
      },
    ],
  };

  const aiChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "AI Generated Data (Predictions)",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Prediction Values",
        },
      },
    },
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Super admin case */}
        {user.userType === "superAdmin" && (
          <>
            <StatCard
              title="Total Schools/Colleges"
              value="2500"
              icon={Building2}
              color="bg-cyan-500"
            />
            <StatCard
              title="Dropout Rate"
              value="12.6%"
              icon={PieChart}
              color="bg-emerald-600"
            />
            {/* <StatCard
              title="Total nodal Centers"
              value="44"
              icon={Users}
              color="bg-amber-400"
            /> */}
            <StatCard
              title="Total Student Dropouts"
              value="655"
              icon={UserMinus}
              color="bg-rose-500"
            />
          </>
        )}

        {/* Admin case */}
        {user.userType === "admin" && (
        <>
            <div>
              <StatCard
              title="Total Students in Schools"
              value="650"
              icon={Building2}
              color="bg-cyan-500"
            />
            </div>
            <div>
              <StatCard
              title="Dropout Rate of Schools"
              value="15.7%"
              icon={PieChart}
              color="bg-emerald-600"
            />
            </div>
            <div>
              <StatCard
              title="Total Schools"
              value="67"
              icon={School2}
              color="bg-rose-500"
            />
            </div>
            <div className="cursor-pointer" onClick={() => navigate('/admin/school-droput')}>
              <StatCard
              title="School's Droput"
              value="View"
              icon={School}
              color="bg-green-800"
            />
            </div>
          </>
        )}

        {/* Subadmin case */}
        {user.userType === "subadmin" && (
          <>
            <div>
              <StatCard
              title="Total Students in Class"
              value="65"
              icon={Building2}
              color="bg-cyan-500"
            />
            </div>
            <div>
              <StatCard
              title="Dropout Rate of Class"
              value="5.7%"
              icon={PieChart}
              color="bg-emerald-600"
            />
            </div>
            <div>
              <StatCard
              title="Total Dropouts of Class"
              value="6"
              icon={UserMinus}
              color="bg-rose-500"
            />
            </div>
            <div onClick={() => navigate("/subadmin/student-details")} className="cursor-pointer">
              <StatCard
                title="Student details"
                value="view"
                icon={User}
                color="bg-green-800"
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-gradient-to-r w-full from-blue-100 via-indigo-100 to-green-100 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold mb-4">AI Generated Data (Demo)</h3>
          <Line data={aiData} options={aiChartOptions} />
        </div>
    </div>
  );
};

export default Dashboard;
