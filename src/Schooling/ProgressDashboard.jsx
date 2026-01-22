import React, { useEffect, useState } from "react";
import { getProgress } from "../services/progressService";

const ProgressDashboard = ({ studentId }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      console.error("Student ID is missing.");
      setError("Invalid student ID.");
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getProgress(studentId);
        setProgress(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">Progress Dashboard</h2>
      {progress && progress.length > 0 ? (
        <ul>
          {progress.map((item, index) => (
            <li key={index}>
              {item.subject}: {item.grade}
            </li>
          ))}
        </ul>
      ) : (
        <p>No progress data available.</p>
      )}
    </div>
  );
};

export default ProgressDashboard;
