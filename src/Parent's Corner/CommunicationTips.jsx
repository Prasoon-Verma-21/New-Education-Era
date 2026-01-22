"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export default function CommunicationTips() {
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
        Communication Tips
      </h1>
      <p className="text-gray-700 max-w-3xl text-center mb-8">
        Learn effective strategies and techniques to enhance communication with your child, fostering a positive and supportive relationship.
      </p>

      {/* Communication Tips Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {communicationTips.map((tip) => (
          <motion.div
            key={tip.title}
            onClick={() => setActive(tip)}
            className="p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-100 rounded-xl cursor-pointer shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={tip.src}
              alt={tip.title}
              className="h-40 w-full rounded-lg object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {tip.title}
            </h3>
            <p className="text-gray-600 text-center">{tip.description}</p>
          </motion.div>
        ))}
      </ul>

      {/* Modal for Active Tip */}
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
              <h2 className="text-xl font-bold mb-4">{active.title}</h2>
              <p className="text-gray-600">{active.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const communicationTips = [
  {
    title: "Active Listening",
    description: "Practice active listening to understand your child's thoughts and feelings.",
    src: "https://t4.ftcdn.net/jpg/04/20/67/57/240_F_420675723_jSrUBuwHqWm3ZnwNm3QiuZOOv8axZDI8.jpg",
  },
  {
    title: "Positive Reinforcement",
    description: "Use positive reinforcement to encourage good behavior.",
    src: "https://t3.ftcdn.net/jpg/08/17/22/56/240_F_817225622_iAAWfQMsVs2zbdSAZg3pvaDnyJT9XjYb.jpg",
  },
  {
    title: "Clear Expectations",
    description: "Set clear expectations and rules to help your child understand boundaries.",
    src: "https://t3.ftcdn.net/jpg/04/96/76/35/240_F_496763566_Kb4W2L91mFDtGugHQQmKKi08G18Xk1bG.jpg",
  },
  {
    title: "Empathy in Conversations",
    description: "Show empathy during conversations to build trust and emotional connection.",
    src: "https://t4.ftcdn.net/jpg/04/34/23/22/240_F_434232293_hPimrLfUtvrhpdIGGAd5Ed3slzxTx3Cc.jpg",
  },
  {
    title: "Non-Verbal Communication",
    description: "Pay attention to non-verbal cues like body language and facial expressions.",
    src: "https://t4.ftcdn.net/jpg/03/71/64/81/240_F_371648124_zNoL7mNH25KSa4BAvvLqY0gqoe6sMwAI.jpg",
  },
  {
    title: "Patience and Understanding",
    description: "Be patient and understanding when discussing challenging topics with your child.",
    src: "https://t4.ftcdn.net/jpg/05/46/78/21/240_F_546782109_FixcW6BDktlW8APFJmLvL0iJBADKXt06.jpg",
  },
];
