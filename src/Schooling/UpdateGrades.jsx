import React, { useState } from "react";
import { updateGrades } from "../services/progressService";

const UpdateGrades = ({ studentId }) => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gradeData = { subject, grade };
      const updatedProgress = await updateGrades(studentId, gradeData);
      alert("Grade updated successfully!");
      console.log(updatedProgress);
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Subject:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <label>
        Grade:
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
      </label>
      <button type="submit">Update Grade</button>
    </form>
  );
};

export default UpdateGrades;
