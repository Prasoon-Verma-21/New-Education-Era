"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export default function ParentingResources() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
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
        Parenting Resources
      </h1>
      <p className="text-gray-700 max-w-3xl text-center mb-8">
        Discover valuable parenting resources, including books, webinars,
        support groups, and more, designed to help you navigate your journey as
        a parent with confidence and joy.
      </p>

      {/* Parenting Resource Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {resources.map((resource) => (
          <motion.div
            key={resource.title}
            onClick={() => setActive(resource)}
            className="p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-100 rounded-xl cursor-pointer shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={resource.src}
              alt={resource.title}
              className="h-40 w-full rounded-lg object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {resource.title}
            </h3>
            <p className="text-gray-600 text-center">{resource.description}</p>
          </motion.div>
        ))}
      </ul>

      {/* Modal for Active Resource */}
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

const resources = [
  {
    title: "Books for Parents",
    description:
      "Discover insightful books that offer guidance on various parenting topics, such as child psychology and effective communication.",
    src: "https://t4.ftcdn.net/jpg/05/17/78/71/240_F_517787169_FQ8w3yL7t4WXyoSwOFIyk4dYyIYUiMPp.jpg",
  },
  {
    title: "Webinars and Workshops",
    description:
      "Participate in live online sessions hosted by experts to learn more about child development and parenting strategies.",
    src: "https://t4.ftcdn.net/jpg/07/96/28/83/240_F_796288385_AFFyMJAsIHf02vUKzwvz31XwbAHdwY7s.jpg",
  },
  {
    title: "Parenting Podcasts",
    description:
      "Tune into podcasts that explore parenting challenges, work-life balance, and tips for raising happy, confident kids.",
    src: "https://t4.ftcdn.net/jpg/01/86/58/33/240_F_186583319_4OpUbzAvhDq33p1gTXSVFnUmQ1dUyjJu.jpg",
  },
  {
    title: "Interactive Parenting Tools",
    description:
      "Use tools like growth trackers, behavior charts, and educational games to support your child's development.",
    src: "https://t4.ftcdn.net/jpg/02/56/01/85/240_F_256018596_3mS3SREXoRn5f88sxdL6cZaFzNiSCsNH.jpg",
  },
  {
    title: "Expert Articles",
    description:
      "Access well-researched articles written by parenting coaches and psychologists on topics like discipline, education, and health.",
    src: "https://t4.ftcdn.net/jpg/01/67/18/67/240_F_167186710_t88qFfwCFwlbxlTw54uFLcYg2MwAhQsJ.jpg",
  },
  {
    title: "Support Groups",
    description:
      "Join online communities where parents share their experiences and offer support on common parenting challenges.",
    src: "https://t4.ftcdn.net/jpg/02/84/60/84/240_F_284608482_s90ZxMj8z6Kqi9xF9TgHiZZlgRyU6oxh.jpg",
  },
];
