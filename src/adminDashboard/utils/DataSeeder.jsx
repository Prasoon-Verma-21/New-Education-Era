import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const seedSampleData = async () => {
    const sampleData = [
        { name: "Rahul Singh", riskScore: 78, attendance: 65, gpa: 4.2, distance: 12, arrears: 3, district: "Lucknow", school: "Central Academy", timestamp: new Date() },
        { name: "Priya Verma", riskScore: 45, attendance: 78, gpa: 5.8, distance: 5, arrears: 1, district: "Lucknow", school: "Central Academy", timestamp: new Date() },
        { name: "Amit Kumar", riskScore: 22, attendance: 92, gpa: 8.1, distance: 2, arrears: 0, district: "Lucknow", school: "Central Academy", timestamp: new Date() },
        { name: "Sneha Das", riskScore: 85, attendance: 50, gpa: 3.5, distance: 15, arrears: 4, district: "Lucknow", school: "Central Academy", timestamp: new Date() },
        { name: "Vikram Raj", riskScore: 35, attendance: 82, gpa: 6.2, distance: 4, arrears: 1, district: "Lucknow", school: "Central Academy", timestamp: new Date() },
        { name: "Anjali Gupta", riskScore: 62, attendance: 70, gpa: 4.9, distance: 8, arrears: 2, district: "Varanasi", school: "Delhi Public School", timestamp: new Date() },
        { name: "Rohan Mehra", riskScore: 18, attendance: 95, gpa: 8.8, distance: 1, arrears: 0, district: "Varanasi", school: "Delhi Public School", timestamp: new Date() },
        { name: "Karan Johar", riskScore: 92, attendance: 40, gpa: 3.1, distance: 10, arrears: 5, district: "Kanpur", school: "Govt High School", timestamp: new Date() }
    ];

    try {
        const predictionsRef = collection(db, "predictions");
        for (const data of sampleData) {
            await addDoc(predictionsRef, data);
        }
        alert("Database Seeded Successfully! Refreshing charts...");
    } catch (error) {
        console.error("Error seeding data:", error);
        alert("Failed to seed data. Check console.");
    }
};