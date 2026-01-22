"use client";
import React, { useState, useId, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";
import axiosInstance from "../axiosConfig";
import DateTimePicker from "../components/DatePicker";
import { BadgeCheck, BadgeCheckIcon, Loader2, LoaderCircle } from "lucide-react";


export default function OnlineConsultation() {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);
  const [allExperts, setAllExperts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingExpert, setloadingExpert] = useState(false)

  const getAllExperts = async() => {
    try {
      setloadingExpert(true)
      console.log("debug get all experts")
      const response = await axiosInstance.get('/api/expert/get_experts');
      setAllExperts(response.data.data)
    } catch (error) {
      console.log("error while fetching all experts ",error)
    } finally {
      setloadingExpert(false)
    }
  }

  console.log("experts ",allExperts);
  useEffect(() => {
    getAllExperts()
  },[])

  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [message, setMessage] = useState("");

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate.toLocaleDateString());
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime.toLocaleTimeString());
  };

  const BookingExpert = async() =>{
    try {
      setLoading(true)
      const response = await axiosInstance.post('/api/expert/bookExpert', {
        expertName: active.username,
        Expertemail: active.email,
        field: active.consultationField,
        time: time,
        date: date,
      })
      console.log("expert booking response ",response.data)
      setMessage(response.data.message)
    } catch (error) {
      console.log("error while booking expert ",error)
      setMessage(error.response?.data?.message || "Something went wrong during booking.")
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = () => {
    if (date && time) {
      BookingExpert()
    } else {
      if(!date)
        alert("Please select a date.");
      else if(!time)
        alert("Please select a time slot.");
    }
  };

  useEffect(() => {
    setDate(null)
    setTime(null)
    setMessage("")
  }, [active])

  return (
    <div className="pt-6 flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1 className="text-3xl font-bold text-blue-900 mt-6 mb-6">
        Free Consultation
      </h1>
      <p className="text-xl font-semibold text-gray-600 text-center">Get personalized advice from experienced professionals at no cost</p>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 mt-20 bg-black/90 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid w-full place-items-center z-[100] md:mt-10">
            <motion.div
              layoutId={`card-${active.username}-${id}`}
              ref={ref}
              className="w-full max-w-[700px] h-fit md:max-h-[90%] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-lg"
            >
              <motion.div layoutId={`image-${active.username}-${id}`}>
                <img
                  src={active.profilePicture}
                  alt={active.username}
                  className="w-full h-60 sm:rounded-tr-lg sm:rounded-tl-lg object-cover"
                />
              </motion.div>
                  <div className="mt-6 bg-green-100 p-4 rounded-lg">
                    <p className="text-green-700">
                      {message}
                    </p>
                  </div>
              <div className="px-8 py-2 max-h-[300px] overflow-y-auto">
                <motion.h3 layoutId={`name-${active.username}-${id}`} className="text-xl flex flex-row items-center gap-2 font-semibold mb-2">
                  {active.username.charAt(0).toUpperCase() + active.username.slice(1)}
                  <BadgeCheckIcon className="w-5 h-5" />
                </motion.h3>
                <motion.p layoutId={`specialization-${active.consultationField}-${id}`} className="text-gray-800 flex flex-row items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-800">Specialization:</p> {active.consultationField}
                </motion.p>
                <motion.p layoutId={`description-${active.description}-${id}`} className="text-blue-800">
                  {active.description}
                </motion.p>

                <div className="p-6">
                  {/* <h1 className="text-2xl font-bold text-center mb-6">Date and Time Selection</h1> */}
                  <DateTimePicker onDateChange={handleDateChange} onTimeChange={handleTimeChange} />
                </div>

                <button disabled={loading}
                  className={`px-4 ml-[72%] py-2 flex items-center flex-row gap-2 bg-green-500 text-white rounded-lg ${loading ? 'opacity-65' : 'opacity-100'}`}
                  onClick={handleBooking}
                >
                  Confirm Booking {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <></>}
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

    { loadingExpert ? <LoaderCircle className="w-20 h-20 m-auto mt-10 animate-spin" /> :
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 py-10 px-4">
        {allExperts.map((expert) => (
          <motion.div
            layoutId={`card-${expert.username}-${id}`}
            key={expert._id}
            onClick={() => setActive(expert)}
            className="p-6 flex flex-col hover:scale-105 transition-all duration-300 border-b-[3px] border border-blue-500 shadow-lg shadow-blue-400 items-center justify-center bg-white hover:bg-neutral-50 rounded-xl cursor-pointer max-w-lg"
          >
            <motion.div layoutId={`image-${expert.username}-${id}`}>
              <img
                src={expert.profilePicture}
                alt={expert.username}
                className="h-48 w-full rounded-lg object-cover"
              />
            </motion.div>
            <div className="text-center mt-2">
              <motion.h3 layoutId={`name-${expert.username}-${id}`} className="font-medium text-neutral-800 text-lg">
                {expert.username.charAt(0).toUpperCase() + expert.username.slice(1)}
              </motion.h3>
              <motion.p layoutId={`specialization-${expert.consultationField}-${id}`} className="text-neutral-600 text-sm">
                {expert.consultationField}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </ul>
    }
    </div>
  );
}
