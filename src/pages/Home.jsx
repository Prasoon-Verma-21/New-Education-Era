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
      image:
        "https://static.mygov.in/innovateindia/2024/03/19/mygov-9999999991667399186.jpg",
    },
    {
      image:
        "https://www.education.gov.in/sites/education.gov.in/themes/nexus/images/slides/NMMSS_updated.jpg",
    },
    {
      image:
        "https://www.education.gov.in/sites/education.gov.in/themes/nep/images/slides/NEP_Banner.jpg",
    },
  ];

  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      {/* Hero Section */}
      <div id="home" className="App w-full">
        <div
          style={{
            padding: "1px 0",
          }}
        >
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

        {/* Moving Announcement Bar for Notifications */}
        <div className="bg-red-100 text-red-800 text-lg font-medium px-4 py-2">
          <marquee
            behavior="scroll"
            direction="left"
            className="inline-block"
            scrollamount="15"
          >
            {/* First Notification */}
            <span className="font-bold">📢 NEW:</span>
            <span>
              Dropout rates for 2023 have been updated. Check the report for
              actionable insights!
            </span>

            {/* Separator "||" */}
            <span className="mx-2 font-semibold">||</span>

            {/* Second Notification */}
            <span className="font-bold">📢 Reminder:</span>
            <span>Submit intervention program proposals by Dec 20, 2024.</span>

            {/* Separator "||" */}
            <span className="mx-2 font-semibold">||</span>

            {/* Third Notification */}
            <span className="font-bold">📢 Update:</span>
            <span>New resources added to the Dropout Prevention Hub.</span>
          </marquee>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-10">
      <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col lg:flex-row py-10 px-4 lg:px-20 gap-10 bg-gradient-to-b from-blue-100 to-gray-50 rounded-lg">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 flex items-center justify-left">
          <img
            src={Home1}
            alt="Description Image"
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Description Section */}
        <div className="w-full lg:w-2/3 flex flex-col items-end">
          <h2 className="text-3xl font-semibold mb-4 text-left">
            Why Should You Choose New Education Era?
          </h2>
          <ul className="list-disc space-y-2 text-left md:pr-5 pl-5">
            <li>AI-powered personalized learning.</li>
            <li>Interactive tutorials and resources.</li>
            <li>Track your progress and improve over time.</li>
            <li>Community-driven platform for better engagement.</li>
          </ul>
        </div>
      </motion.div>

      <div
      className="flex flex-col lg:flex-row-reverse py-10 px-4 lg:px-20 gap-10 bg-gradient-to-b from-blue-100 to-gray-50 rounded-lg">
        {/* Image Section */}
        <motion.div 
        initial={{ x: 100, opacity: 0 }} 
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/3 flex items-center justify-center">
          <img
            src={Home2}
            alt="Description Image"
            className="rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Description Section */}
        <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-2/3 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">New Education Era: One Platform, One Solution</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Student performance monitoring and notification</li>
            <li>Live tutoring sessions with experts.</li>
            <li>Comprehensive resources on various subjects.</li>
            <li>Instant feedback on your learning activities.</li>
            <li>Collaborative learning via community forums.</li>
          </ul>
        </motion.div>
      </div>
      </div>

      <div id="about"><About /></div>
    </div>
  );
};

export default Home;
