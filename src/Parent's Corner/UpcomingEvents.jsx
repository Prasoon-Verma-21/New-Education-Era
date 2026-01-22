"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export default function UpcomingEvents() {
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
        Upcoming Events
      </h1>
      <p className="text-gray-700 max-w-3xl text-center mb-8">
        Stay informed about the latest events for parents and children. Join us for engaging activities and learning opportunities!
      </p>

      {/* Event Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {events.map((event) => (
          <motion.div
            key={event.title}
            onClick={() => setActive(event)}
            className="p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-100 rounded-xl cursor-pointer shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={event.src}
              alt={event.title}
              className="h-40 w-full rounded-lg object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
            <p className="text-gray-600">{event.date}</p>
          </motion.div>
        ))}
      </ul>

      {/* Modal for Active Event */}
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

const events = [
  {
    title: "Parent-Teacher Meeting",
    date: "December 15, 2024",
    description: "Discuss your child's progress with teachers and explore collaborative strategies for their growth.",
    src: "https://t4.ftcdn.net/jpg/07/15/72/96/240_F_715729632_Fxy4LTmAf8I7NuChHDoyLpNKwYHYO4EF.jpg",
  },
  {
    title: "Family Fun Day",
    date: "December 20, 2024",
    description: "Join us for a day packed with fun activities, games, and bonding opportunities for the entire family.",
    src: "https://t4.ftcdn.net/jpg/06/73/53/11/240_F_673531147_TjWJh8t9Q6XiG0OrkZBTnCyJeYkGx8P6.jpg",
  },
  {
    title: "Online Parenting Workshop",
    date: "January 5, 2024",
    description: "Learn modern parenting techniques from leading experts in this interactive online session.",
    src: "https://t4.ftcdn.net/jpg/02/54/79/98/240_F_254799893_QlXVbEXfpYa0G9C5QVrFMsmIduMzyP3G.jpg",
  },
  {
    title: "Children's Art Exhibition",
    date: "January 15, 2024",
    description: "Celebrate creativity as we showcase artwork created by children from the local community.",
    src: "https://t4.ftcdn.net/jpg/03/29/94/56/240_F_329945612_QblXwWxUmnhc6MuJvZyQQtL9AjI5SKPe.jpg",
  },
  {
    title: "Mental Health Awareness Session",
    date: "February 10, 2025",
    description: "Gain insights on maintaining mental well-being for parents and children in today's fast-paced world.",
    src: "https://t4.ftcdn.net/jpg/03/00/45/88/240_F_300458844_xFMPkYp08hWmfRWgWSPbc01UyVuEux3Y.jpg",
  },
];
