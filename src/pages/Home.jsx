import React from "react";
import { Carousel } from "react-carousel-minimal";
import Home1 from "../assets/Home1.webp";
import Home2 from "../assets/Home2.webp";
import Card from "../components/Card";
import About from "./About";
import { motion } from "framer-motion";

const Home = () => {
  const data = [
    {
      image: "https://static.mygov.in/innovateindia/2024/03/19/mygov-9999999991667399186.jpg",
    },
    {
      image: "https://www.education.gov.in/sites/education.gov.in/themes/nexus/images/slides/NMMSS_updated.jpg",
    },
    {
      image: "https://www.education.gov.in/sites/education.gov.in/themes/nep/images/slides/NEP_Banner.jpg",
    },
  ];

  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
      /* MAIN WRAPPER: Added dark:bg-slate-950 and dark:text-white */
      <div className="min-h-screen flex flex-col bg-blue-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

        {/* Hero Section */}
        <div id="home" className="App w-full">
          <div style={{ padding: "1px 0" }}>
            <Carousel
                data={data}
                time={2000}
                width="6200px"
                height="450px"
                radius="0px"
                slideNumber={true}
                slideNumberStyle={slideNumberStyle}
                captionPosition="bottom"
                automatic={true}
                dots={true}
                pauseIconColor="white"
                pauseIconSize="40px"
                slideBackgroundColor="darkgrey"
                slideImageFit="fit"
                style={{
                  textAlign: "center",
                  maxWidth: "1650px",
                  maxHeight: "600px",
                  margin: "1px auto",
                }}
            />
          </div>

          {/* Announcement Bar: Added dark:bg-red-900/30 dark:text-red-200 */}
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-lg font-medium px-4 py-2 border-b dark:border-red-900/50 transition-colors">
            <marquee behavior="scroll" direction="left" scrollamount="15">
              <span className="font-bold">📢 NEW:</span>
              <span> Dropout rates for 2023 have been updated. Check reports!</span>
              <span className="mx-4 font-semibold">||</span>
              <span className="font-bold">📢 Reminder:</span>
              <span> Submit proposals by Dec 20, 2024.</span>
              <span className="mx-4 font-semibold">||</span>
              <span className="font-bold">📢 Update:</span>
              <span> New resources added to the Prevention Hub.</span>
            </marquee>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 lg:p-10 space-y-10">

          {/* Why Choose Us Section: Added dark gradient and dark border */}
          <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row py-10 px-4 lg:px-20 gap-10 bg-gradient-to-b from-blue-100 to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-[40px] shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 transition-all"
          >
            <div className="w-full lg:w-1/3 flex items-center justify-left">
              <img src={Home1} alt="Description" className="rounded-3xl shadow-lg dark:opacity-80 transition-opacity" />
            </div>

            <div className="w-full lg:w-2/3 flex flex-col items-start justify-center">
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-slate-800 dark:text-white">
                Why Should You Choose New Education Era?
              </h2>
              <ul className="list-disc space-y-3 text-slate-600 dark:text-slate-300 font-medium pl-5">
                <li>AI-powered personalized learning.</li>
                <li>Interactive tutorials and resources.</li>
                <li>Track your progress and improve over time.</li>
                <li>Community-driven platform for better engagement.</li>
              </ul>
            </div>
          </motion.div>

          {/* One Platform Section: Added dark gradient and dark border */}
          <div className="flex flex-col lg:flex-row-reverse py-10 px-4 lg:px-20 gap-10 bg-gradient-to-b from-blue-100 to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-[40px] shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 transition-all">
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/3 flex items-center justify-center"
            >
              <img src={Home2} alt="Description" className="rounded-3xl shadow-lg dark:opacity-80 transition-opacity" />
            </motion.div>

            <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-2/3 flex flex-col justify-center"
            >
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-slate-800 dark:text-white">
                One Platform, One Solution
              </h2>
              <ul className="list-disc pl-5 space-y-3 text-slate-600 dark:text-slate-300 font-medium">
                <li>Student performance monitoring and notification</li>
                <li>Live tutoring sessions with experts.</li>
                <li>Comprehensive resources on various subjects.</li>
                <li>Instant feedback on your learning activities.</li>
                <li>Collaborative learning via community forums.</li>
              </ul>
            </motion.div>
          </div>
        </div>

        <div id="about" className="dark:bg-slate-950 transition-colors"><About /></div>
      </div>
  );
};

export default Home;