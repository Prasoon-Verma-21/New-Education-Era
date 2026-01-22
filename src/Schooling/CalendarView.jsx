import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axiosInstance from "../axiosConfig";

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get("/api/schedules");
        const formattedEvents = response.data.map((schedule) => ({
          id: schedule._id,
          title: schedule.subject,
          start: schedule.startTime,
          end: schedule.endTime,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="p-4 bg-white text-black">
      <h2 className="text-center text-2xl font-semibold mb-4">Student Schedule</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        editable={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="80vh"
      />
    </div>
  );
};

export default CalendarView;
