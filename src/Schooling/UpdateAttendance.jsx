import React, { useState } from "react";
import { updateAttendance } from "../services/progressService";

const UpdateAttendance = ({ studentId }) => {
  const [attendance, setAttendance] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProgress = await updateAttendance(studentId, attendance);
      alert("Attendance updated successfully!");
      console.log(updatedProgress);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Attendance (%):
        <input
          type="number"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          min="0"
          max="100"
        />
      </label>
      <button type="submit">Update Attendance</button>
    </form>
  );
};

export default UpdateAttendance;
