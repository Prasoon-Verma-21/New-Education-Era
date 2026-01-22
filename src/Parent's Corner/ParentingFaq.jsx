"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export default function ParentingFAQs() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="pt-6 flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 mt-6 text-center">
        Parenting FAQs
      </h1>
      <p className="text-gray-700 max-w-3xl text-center mb-8">
        Find answers to commonly asked questions about parenting and get actionable tips for everyday challenges.
      </p>

      {/* FAQ Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {faqs.map((faq) => (
          <motion.div
            key={faq.question}
            onClick={() => setActive(faq)}
            className="p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-100 rounded-xl cursor-pointer shadow-lg transition-transform transform hover:scale-105"
          >
            <h3 className="font-medium text-gray-800 text-lg text-center">
              {faq.question}
            </h3>
          </motion.div>
        ))}
      </ul>

      {/* Modal for Active FAQ */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              ref={ref}
              className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4">{active.question}</h2>
              <p className="text-gray-600">{active.answer}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqs = [
  {
    question: "How can I manage my child's screen time?",
    answer: "Set clear limits on screen time, establish a routine, and encourage alternative activities such as reading, outdoor play, or hobbies.",
  },
  {
    question: "What should I do if my child is struggling in school?",
    answer: "Maintain open communication with your child and their teachers, seek tutoring or additional support, and encourage positive reinforcement at home.",
  },
  {
    question: "How can I build trust with my teenager?",
    answer: "Practice active listening, show empathy, respect their privacy, and create an open and non-judgmental environment for conversations.",
  },
  {
    question: "What are some tips for effective discipline?",
    answer: "Focus on consistency, use positive reinforcement, avoid harsh punishments, and ensure clear communication about rules and consequences.",
  },
  {
    question: "How do I encourage healthy eating habits in my child?",
    answer: "Lead by example, involve your child in meal planning and preparation, and offer a variety of nutritious foods in a fun and appealing way.",
  },
  {
    question: "What can I do to support my child's mental health?",
    answer: "Be attentive to their feelings, encourage open discussions about emotions, and seek professional help if needed.",
  },
];
