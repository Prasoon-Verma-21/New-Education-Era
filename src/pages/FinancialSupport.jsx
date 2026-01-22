"use client";
import React from "react";
import { motion } from "framer-motion";

export default function FinancialSupport() {
  return (
    <div className="pt-24 flex flex-col items-center justify-auto w-full min-h-screen bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">
        Financial Support Corner
      </h1>

      {/* Financial Support Cards */}
      <ul className="flex flex-col gap-8 py-10 px-4 w-full max-w-screen-lg">
        {cards.map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl shadow-lg"
          >
            {/* Image Section */}
            <motion.img
              src={card.src}
              alt={card.title}
              className="h-48 w-full md:w-1/3 object-cover rounded-lg"
            />

            {/* Text Section */}
            <div className="flex flex-col items-start text-left md:w-2/3">
              <h3 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                {card.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 my-2">
                {card.description}
              </p>
              <button
                className="mt-4 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 font-bold"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent click propagation
                  window.location.href = card.ctaLink;
                }}
              >
                {card.ctaText}
              </button>
            </div>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

const cards = [
  {
    title: "Scholarships",
    description:
      "Unlock financial aid opportunities through scholarships tailored for students. Explore various scholarship programs available at central, state, and private levels to support your educational journey.",
    src: "https://media.istockphoto.com/id/1161001258/photo/scholarship-cap-magnified.jpg?s=612x612&w=0&k=20&c=xtDTXzTSol8K8RB5QGGeiXVP5G0psMhEv4fSQju1hc8=",
    ctaText: "View Scholarships",
    ctaLink: "/financial-support/scholarships",
  },
  {
    title: "Loans",
    description:
      "Access information about educational loans to fund your studies. Compare loan programs, terms, and benefits to make an informed decision about financing your education.",
    src: "https://media.istockphoto.com/id/1226786654/photo/loan-bags-on-a-laptop.jpg?s=612x612&w=0&k=20&c=IzWe7AQB3FepO3711ZbRJ5lmOMdbBO6UIzHRrO8of8k=",
    ctaText: "View Loans",
    ctaLink: "/financial-support/loans",
  },
  {
    title: "FAQ",
    description:
      "Have questions about financial support? Find answers to the most frequently asked questions regarding scholarships, grants, loans, and application processes, all in one place.",
    src: "https://media.istockphoto.com/id/1349998432/photo/3d-render-of-faqs-business-concept.jpg?s=612x612&w=0&k=20&c=qhvy7I8jjnyAagxavLXVwSsvbsErceBVyIqF2eyHxWw=",
    ctaText: "View FAQ",
    ctaLink: "/financial-support/faq",
  },
];
