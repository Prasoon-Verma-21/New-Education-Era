import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Automatically register Chart.js components
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.webp";
import { motion } from "framer-motion";

const About = () => {
  const chartData = {
    labels: ["Dropouts", "Access", "Engagement", "Parental Support"],
    datasets: [
      {
        label: "Education Challenges",
        data: [35, 45, 25, 30],
        backgroundColor: ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"],
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-100 to-gray-50 text-gray-900 py-10 px-4 lg:px-20">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">About New Education Era</h1>

        {/* Introduction */}
        <section className="mb-10">
          <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-8">
            <img
              src={logo}
              alt="EduHub Introduction"
              className="w-full lg:w-1/2 min-h-48 md:h-48 rounded-lg shadow-lg object-cover"
            />
            <div>
              <h2 className="text-2xl text-black font-semibold mb-4">Welcome to New Education Era</h2>
              <p className="leading-relaxed">
                New Education Era is more than a platform; it’s a movement to redefine the educational landscape by tackling
                challenges like dropout rates, accessibility, and engagement. Our innovative solutions create an
                inclusive future for learners at all stages.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Challenges Visualization */}
        <section className="mb-10 py-10">
          <motion.h2 
          initial={{ x: -100, opacity: 0 }} 
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl text-gray-900 font-semibold mb-4">Understanding the Challenges</motion.h2>
          <motion.p 
          initial={{ x: -150, opacity: 0 }} 
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="leading-relaxed mb-6">
            The modern educational system faces significant hurdles. Here's a breakdown of the key challenges:
          </motion.p>
          <div
          className="bg-white md:p-10 p-5 mt-10 rounded-lg shadow-lg">
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </section>

        {/* Solutions Section */}
        <section className="mb-10">
          <h2 className="text-3xl text-center font-bold text-gray-900 mb-4">Our Solutions</h2>
          <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
            initial={{ x: -200, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-blue-100 p-6 text-xl rounded-lg shadow-xl shadow-blue-300 border-b-[3px] border-blue-400">
              <h3 className="text-gray-950 text-center font-semibold mb-2">AI-Driven Early Warning System</h3>
              <p className="text-lg text-blue-800 text-center leading-relaxed">
                Identifies at-risk students and enables timely interventions to prevent dropouts.
              </p>
            </motion.div>
            <div className="bg-blue-100 p-6 text-xl rounded-lg shadow-xl shadow-blue-300 border-b-[3px] border-blue-400">
              <h3 className="text-gray-950 text-center font-semibold mb-2">Community Learning Hub</h3>
              <p className="text-lg text-blue-800 text-center leading-relaxed">
                Provides digital resources, virtual mentoring, and online classes to underserved areas.
              </p>
            </div>
            <motion.div 
            initial={{ x: 200, opacity: 0 }} 
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-blue-100 p-6 text-xl rounded-lg shadow-xl shadow-blue-300 border-b-[3px] border-blue-400">
              <h3 className="text-gray-950 text-center font-semibold mb-2">Parental Engagement Portal</h3>
              <p className="text-lg text-blue-800 text-center leading-relaxed">
                Strengthens collaboration between parents and educators with real-time insights.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-10 py-12">
          <motion.h2 
          initial={{ x: -100, opacity: 0 }} 
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl text-black text-center md:text-left font-semibold mb-4">Our Impact</motion.h2>
          <motion.div 
          initial={{ x: -100, opacity: 0 }} 
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col mt-10 lg:flex-row items-center gap-8">
            <img
              src={logo}
              alt="EduHub Impact"
              className="w-full lg:w-1/3 min-h-48 md:h-52  rounded-lg shadow-lg object-fit"
            />
            <ul className="list-disc pl-5 space-y-2">
              <li>Reduced dropout rates by providing timely support to students.</li>
              <li>Improved access to quality education in underserved regions.</li>
              <li>Enhanced collaboration between parents, students, and educators.</li>
              <li>Equipped institutions with data-driven insights for decision-making.</li>
            </ul>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-10 px-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Join Us in Revolutionizing Education</h2>
          <p className="leading-relaxed mb-6">
            Together, we can make education more accessible, impactful, and inclusive. Let’s create a brighter future
            for generations to come.
          </p>
          <button
          onClick={() => navigate("/signup")}
          className="bg-white text-blue-700 px-6 py-2 rounded-lg shadow-md hover:bg-blue-100">
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
