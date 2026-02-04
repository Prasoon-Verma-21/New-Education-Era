import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
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
        // Use colors that work in both modes, or slightly muted for dark mode
        backgroundColor: ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"],
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate();

  return (
      /* MAIN WRAPPER: Added dark:from-slate-950 dark:to-slate-900 and dark:text-slate-100 */
      <div className="min-h-screen bg-gradient-to-t from-blue-100 to-gray-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-slate-100 py-10 px-4 lg:px-20 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">

          {/* Header: Added dark:text-indigo-400 */}
          <h1 className="text-4xl font-black mb-10 text-center text-blue-900 dark:text-indigo-400 uppercase tracking-tighter">
            About New Education Era
          </h1>

          {/* Introduction */}
          <section className="mb-10">
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row items-center gap-8 bg-white/50 dark:bg-slate-800/50 p-8 rounded-[40px] border border-transparent dark:border-slate-800"
            >
              <img
                  src={logo}
                  alt="EduHub Introduction"
                  className="w-full lg:w-1/2 min-h-48 md:h-48 rounded-3xl shadow-lg object-cover dark:opacity-80"
              />
              <div>
                <h2 className="text-2xl text-black dark:text-white font-black uppercase tracking-tight mb-4">
                  Welcome to New Education Era
                </h2>
                <p className="leading-relaxed font-medium text-slate-600 dark:text-slate-400">
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
                className="text-2xl md:text-3xl text-gray-900 dark:text-white font-black uppercase tracking-tighter mb-4"
            >
              Understanding the Challenges
            </motion.h2>
            <motion.p
                initial={{ x: -150, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="leading-relaxed mb-6 font-medium text-slate-500 dark:text-slate-400"
            >
              The modern educational system faces significant hurdles. Here's a breakdown of the key challenges:
            </motion.p>

            {/* Chart Container: Added dark:bg-slate-800 and dark:border-slate-700 */}
            <div className="bg-white dark:bg-slate-800 md:p-10 p-5 mt-10 rounded-[40px] shadow-lg border border-transparent dark:border-slate-700">
              <Bar data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </section>

          {/* Solutions Section */}
          <section className="mb-10">
            <h2 className="text-3xl text-center font-black text-gray-900 dark:text-white mb-10 uppercase tracking-tighter">
              Our Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Solution Card Helper: Creating a reusable look for cards */}
              {[
                { title: "AI-Driven Early Warning", desc: "Identifies at-risk students and enables timely interventions to prevent dropouts." },
                { title: "Community Learning Hub", desc: "Provides digital resources, virtual mentoring, and online classes to underserved areas." },
                { title: "Parental Engagement Portal", desc: "Strengthens collaboration between parents and educators with real-time insights." }
              ].map((sol, index) => (
                  <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-blue-100 dark:bg-slate-800 p-8 rounded-[30px] shadow-xl shadow-blue-300/20 dark:shadow-none border-b-[5px] border-blue-400 dark:border-indigo-500 transition-all"
                  >
                    <h3 className="text-gray-950 dark:text-white text-center font-black uppercase text-sm tracking-widest mb-4">
                      {sol.title}
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-slate-400 text-center leading-relaxed font-bold">
                      {sol.desc}
                    </p>
                  </motion.div>
              ))}
            </div>
          </section>

          {/* Impact Section */}
          <section className="mb-10 py-12">
            <motion.h2
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl text-black dark:text-white text-center md:text-left font-black uppercase tracking-tighter mb-10"
            >
              Our Impact
            </motion.h2>
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col lg:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[40px] border border-transparent dark:border-slate-800"
            >
              <img
                  src={logo}
                  alt="EduHub Impact"
                  className="w-full lg:w-1/3 min-h-48 md:h-52 rounded-3xl shadow-lg object-contain bg-white dark:bg-slate-800 p-4"
              />
              <ul className="list-disc pl-5 space-y-4 font-bold text-slate-600 dark:text-slate-400 text-sm">
                <li>Reduced dropout rates by providing timely support to students.</li>
                <li>Improved access to quality education in underserved regions.</li>
                <li>Enhanced collaboration between parents, students, and educators.</li>
                <li>Equipped institutions with data-driven insights for decision-making.</li>
              </ul>
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-10 rounded-[40px] shadow-2xl shadow-indigo-200/20">
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Join Us in Revolutionizing Education</h2>
            <p className="leading-relaxed mb-8 font-medium opacity-90 max-w-2xl mx-auto">
              Together, we can make education more accessible, impactful, and inclusive. Let’s create a brighter future for generations to come.
            </p>
            <button
                onClick={() => navigate("/signup")}
                className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </section>
        </div>
      </div>
  );
};

export default About;