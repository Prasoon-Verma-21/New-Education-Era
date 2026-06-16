import { Building2, PieChart, School, School2 } from "lucide-react";
import PropTypes from "prop-types"; // Added for prop validation
import StatCard from "./StatCard";
import { useAuth } from "../../context/AuthContext";
import { Line } from "react-chartjs-2";
import SkeletonOverview from "./SkeletonOverview";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ onPageChange, allUsers = [] }) => {
  const { userData, loading } = useAuth();

  if (loading || !userData) return <SkeletonOverview />;

  // Real data calculations from Firestore
  const studentCount = allUsers.filter(u => u.role === 'student').length;
  const schoolCount = allUsers.filter(u => u.role === 'headmaster').length;

  // FIXED: Standardized chart data structure
  const aiData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "AI Predictions",
        data: [70, 79, 56, 71, 56, 52, 90, 56, 65, 70, 75, 80],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const aiChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "AI Predicted Student Trends", color: '#94a3b8' },
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
    },
  };

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Overview</h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Signed in as: {userData?.role}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Guarding role access */}
          {(userData?.role === "admin" || userData?.role === "superAdmin") && (
              <>
                <StatCard
                    title="Total Students"
                    value={studentCount}
                    icon={Building2}
                    color="bg-cyan-500"
                    onMoreInfo={() => onPageChange('students')}
                />
                <StatCard
                    title="Dropout Rate"
                    value="15.7%"
                    icon={PieChart}
                    color="bg-emerald-600"
                    onMoreInfo={() => onPageChange('analytics')}
                />
                <StatCard
                    title="Total Schools"
                    value={schoolCount}
                    icon={School2}
                    color="bg-rose-500"
                    onMoreInfo={() => onPageChange('admins')}
                />
                <StatCard
                    title="School's Dropout"
                    value="View"
                    icon={School}
                    color="bg-green-800"
                    onMoreInfo={() => onPageChange('analytics')}
                />
              </>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-2xl mt-6 border border-slate-100 dark:border-slate-800">
          <div className="h-[400px]">
            <Line data={aiData} options={aiChartOptions} />
          </div>
        </div>
      </div>
  );
};

// ADDED: Proper Prop-Types validation to clear ESLint warnings [cite: 2026-01-21]
Dashboard.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  allUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Dashboard;