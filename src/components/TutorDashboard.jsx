import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Calendar, Clock, Mail, Phone, Award, Code } from 'lucide-react';

const TutorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [tutorData, setTutorData] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // Add this state

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const response = await axiosInstance.get("/api/tutor/getTutorBookings");

        setTutorData(response.data.user);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Error fetching bookings. Please try again later.");
      }
    };

    getAllBookings();
  }, []);

  const isPastBooking = (bookingDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDay = new Date(bookingDate);
    bookingDay.setHours(0, 0, 0, 0);
    return bookingDay < today;
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => 
    activeTab === 'active' ? !isPastBooking(booking.date) : isPastBooking(booking.date)
  );

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen p-8 pt-24">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Welcome back, {tutorData.username}! 👋
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        {/* Profile Card */}
        <div className="lg:w-1/3 bg-white/90 backdrop-blur shadow-xl rounded-xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={tutorData.profilePicture || "https://via.placeholder.com/150"}
                alt="Tutor"
                className="h-32 w-32 rounded-full object-cover mb-4 border-4 border-blue-500 shadow-lg"
              />
              <span className="absolute bottom-4 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">{tutorData.username}</h2>
            <p className="text-blue-600 font-medium">{tutorData.subject}</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-800">{tutorData.experienceYears} Years</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-gray-800">C++, Javascript, Python</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">{tutorData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="lg:w-2/3 bg-white/90 backdrop-blur shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Booking Details</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === 'active' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === 'past' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border transition-all ${
                    activeTab === 'past'
                      ? 'bg-gray-50 border-gray-200 opacity-75' 
                      : 'bg-blue-50 border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {booking.username.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{booking.username}</h4>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{booking.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">
                  No {activeTab === 'active' ? 'active' : 'past'} bookings available
                </p>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'active' 
                    ? 'Your upcoming sessions will appear here'
                    : 'Your completed sessions will appear here'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
