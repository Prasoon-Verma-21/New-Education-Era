"use client";
import React from "react";
import { motion } from "framer-motion";
import { useId } from "react";

export default function LearningHub() {
  const id = useId();

  return (
    <>
      <div className="pt-24 flex flex-col items-center justify-auto w-full min-h-screen bg-gradient-to-b from-gray-50 via-blue-100 to-white">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">Learning Hub Corner</h1>

        {/* Learning Hub Cards */}
        <ul className="grid grid-cols-1 gap-6 py-10 w-full px-4 max-w-5xl">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              layoutId={`card-${card.title}-${id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}  
              className="flex flex-col md:flex-row bg-white hover:bg-gray-100 border border-gray-300 rounded-xl shadow-lg cursor-default overflow-hidden transition-all"
            >
              {/* Image Section */}
              <motion.div
                layoutId={`image-${card.title}-${id}`}
                className="w-full md:w-1/3"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="h-40 md:h-full w-full object-cover"
                />
              </motion.div>

              {/* Content Section */}
              <div className="flex flex-col justify-center p-6 w-full md:w-2/3">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-semibold text-lg text-neutral-800 mb-2"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 mb-4"
                >
                  {card.description}
                </motion.p>
                <motion.button
                  layout
                  className="self-start px-4 py-2 text-sm font-bold rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => (window.location.href = card.ctaLink)}
                >
                  {card.ctaText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </ul>
      </div>
    </>
  );
}

const cards = [
  {
    title: "Online Free Consultation",
    description: "Get personalized advice from experienced professionals at no cost. Whether you have academic, career, or personal queries, our experts are here to provide tailored guidance to help you achieve your goals.",
    src: "https://img.freepik.com/free-vector/online-doctor-concept-illustration_114360-1783.jpg",
    ctaText: "Book Now",
    ctaLink: "/learning-hub/online-consultation",
  },
  {
    title: "Resource Library",
    description: "Unlock access to a treasure trove of valuable materials, including e-books, research papers, study guides, and multimedia content. Your one-stop hub for expanding knowledge across various domains.",
    src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbln8UpU6IDXvGejDON32JbCvw23v3XBiqYRRlq2zKE1I797tADQMQGq_ZZk__QmAOvCmbesrKoTRKnF-1M1wMVscXOtqNqDDZizF_H91jeLx0zzPE5ZIXnwgond3RmQCq44jnzKwgTiKK/s1600/resource-library.jpg",
    ctaText: "Explore",
    ctaLink: "/learning-hub/resource-library",
  },
  {
    title: "Virtual Tutoring",
    description: "Learn from experts in real-time with one-on-one virtual sessions. Whether it's solving tricky problems, preparing for exams, or mastering a skill, our tutors are dedicated to your success.",
    src: "https://er.educause.edu/-/media/images/blogs/2020/6/er20_2303_706x394_blog.jpg?hash=6264B1848B33EAD78F3238F3F1ACA8D408794B24",
    ctaText: "Start Learning",
    ctaLink: "/learning-hub/virtual-tutoring",
  },
  {
    title: "The Intellect Exchange: A Community Forum",
    description: "Join a vibrant community of learners, mentors, and professionals. Share ideas, ask questions, and engage in meaningful discussions to grow together and build lasting connections.",
    src: "https://t4.ftcdn.net/jpg/05/04/53/15/360_F_504531543_PZU62hPp9L1xOlN1faqIQSIUOBsmNRac.jpg",
    ctaText: "Join Discussion",
    ctaLink: "/learning-hub/community-forums",
  },
];
