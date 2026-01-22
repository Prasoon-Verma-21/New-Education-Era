import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tutor1 from "../assets/tutor1.jpg";
import tutor2 from "../assets/tutor2.jpg";
import tutor3 from "../assets/tutor3.jpg";
import tutor4 from "../assets/tutor4.jpg";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { Loader2, LoaderCircle } from "lucide-react";



export default function VirtualTutoring() {
  const navigate = useNavigate(); // Hook for navigation
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [tutors, setTutors] = useState([])
  const {user} = useAuth()
  const [loading, setLoading] = useState({
    id: null,
    flag: false
  })
  const [loadingTutor, setTutorLoading] = useState(false)


  const getAllTutors = async() => {
    try {
      setTutorLoading()
      const response = await axiosInstance.get("/api/tutor/getTutors");
      console.log(response.data.data)
      setTutors(response.data.data)
    } catch (error) {
      console.log("error while getting tuttos", error)
    } finally {
      setTutorLoading(false)
    }
  }

  const bookTutor = async(id) => {
    try {
      setLoading({
        id: id,
        flag: true
      })
      const response = await axiosInstance.post("/api/tutor/bookTutor", {
        tutorId: id
      })
      console.log("book reponse ",response.data)
      if(response.data.success) {
        alert(response.data.message)
      }
    } catch (error) {
      console.log("error during booking tutor ",error)
    } finally {
      setLoading({
        id: null,
        flag: false
      })
    }
  }

  console.log("user ",user?._id)
  console.log("tutors ",tutors)
  useEffect(() => {
    getAllTutors()
  }, [])



  const handleBookSession = (tutor) => {
    bookTutor(tutor._id)
    // setSelectedTutor(tutor);
    // // Redirect to the booking confirmation page
    // navigate("/learning-hub/virtual-tutoring/booking", { state: { tutor } });
  };

  return (
    <div className="min-h-screen pt-6 pb-10 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
      <h1
        className="text-3xl font-semibold text-center text-blue-900 mt-6 mb-6"
        style={{
          textShadow: "0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        Virtual Tutoring
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Get one-on-one help from our expert tutors.
      </p>

      {/* Tutors Grid */}
      { loadingTutor ? <LoaderCircle className="w-20 h-20 m-auto mt-10 animate-spin" /> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white rounded-lg shadow-lg p-4 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={tutor.profilePicture}
              alt={tutor.username}
              className="h-48 w-full object-cover mb-4 rounded-md"
            />
            <h2 className="text-xl font-medium mb-2 text-gray-800">
              {tutor.username.charAt(0).toUpperCase() + tutor.username.slice(1)}
            </h2>
            <p className="mb-2 text-gray-600">Subject: {tutor.subject}</p>
            <p className="mb-4 text-gray-600">Experience: <span className="text-blue-500 font-semibold">{tutor.experienceYears} Yr</span> </p>
            <button disabled={loading.id === tutor._id && loading.flag}
              onClick={() => handleBookSession(tutor)}
              className="w-full py-2 flex flex-row gap-2 items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Book Tutor {loading.id === tutor._id && loading.flag === true ? <Loader2 className="w-4 h-4 animate-spin" /> : <></>}
            </button>
          </div>
        ))}
      </div>
      }
    </div>
  );
}
