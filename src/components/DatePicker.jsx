import { CalendarDays, Clock10 } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimePicker = ({ onDateChange, onTimeChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const now = new Date();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null)
    onDateChange(date); // Pass the date to the parent component
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    onTimeChange(time); // Pass the time to the parent component
  };

    // If selectedDate is today, restrict time to future only
  const isToday = selectedDate && selectedDate.toDateString() === now.toDateString();

  return (
    <div className="flex flex-row gap-5 items-center ">
      {/* Date Picker */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium text-black flex flex-row gap-2 items-center mb-2">Select Date <CalendarDays className='w-4 h-4' /></label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
          placeholderText="Click to select a date"
          className="w-full px-3 py-1 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Time Picker */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium flex flex-row items-center gap-2 text-black mb-2">Select Time <Clock10 className='w-4  h-4' /></label>
        <DatePicker title={!selectedDate ? 'Please select date first' : ''}
          selected={selectedTime}
          onChange={handleTimeChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          minTime={isToday ? now : new Date().setHours(0, 0, 0, 0)}
          maxTime={new Date().setHours(23, 45)}
          placeholderText="Click to select a time"
          className={`${!selectedDate ? 'cursor-not-allowed' : ''} w-full px-3 py-1 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={!selectedDate}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
