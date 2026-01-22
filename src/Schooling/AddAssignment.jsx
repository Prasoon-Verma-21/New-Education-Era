import React, { useState } from "react";
import { addAssignment } from "../services/progressService";

const AddAssignment = ({ studentId }) => {
  const [title, setTitle] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assignment = { title, submissionDate, grade };
      const updatedProgress = await addAssignment(studentId, assignment);
      alert("Assignment added successfully!");
      console.log(updatedProgress);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Submission Date:
        <input
          type="date"
          value={submissionDate}
          onChange={(e) => setSubmissionDate(e.target.value)}
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
      <button type="submit">Add Assignment</button>
    </form>
  );
};

export default AddAssignment;
