import axios from "axios";
import axiosInstance from "../axiosConfig";
// import axiosInstance from "../axiosConfig";

const BASE_URL = axiosInstance("/api/progress");
// const BASE_URL = axiosInstance('/api/progress');

// Get progress by student ID
export const getProgress = async (studentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update attendance
export const updateAttendance = async (studentId, attendance) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${studentId}/attendance`, {
      attendance,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Add assignment
export const addAssignment = async (studentId, assignment) => {
  try {
    const response = await axios.post(`${BASE_URL}/${studentId}/assignments`, assignment);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update grades
export const updateGrades = async (studentId, gradeData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${studentId}/grades`, gradeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
