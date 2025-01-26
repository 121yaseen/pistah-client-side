import React, { useState } from "react";
import { addMonths, isSameDay, isBefore, startOfDay, endOfMonth, startOfMonth } from "date-fns";

interface CustomCalendarProps {
  startDate: Date;
  endDate: Date | null;
  onDateChange: (start: Date, end: Date | null) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, date: Date) => {
    e.preventDefault()
    if (!startDate || (startDate && endDate)) {
      // Select From date
      onDateChange(date, null);
    } else if (!endDate && date > startDate) {
      // Select To date
      onDateChange(startDate, date);
    }
  };

  const renderDay = (date: Date) => {
    const isDisabled =
      startDate && !endDate && isBefore(date, startOfDay(startDate));
    const isSelected =
      isSameDay(date, startDate) || (endDate && isSameDay(date, endDate));
    const isInRange =
      startDate &&
      endDate &&
      !isSameDay(startDate, endDate) &&
      isBefore(startDate, date) &&
      isBefore(date, endDate);

    return (
      <button
        key={date.toDateString()}
        onClick={(e) => !isDisabled && handleDateClick(e, date)}
        onMouseEnter={() => setHoveredDate(date)}
        className={`w-10 h-10 rounded-full ${isDisabled
            ? "text-gray-400 dark:text-gray-600"
            : isSelected
              ? "bg-blue-500 text-white"
              : isInRange ||
                (startDate && hoveredDate && !endDate && date > startDate && date <= hoveredDate)
                ? "bg-blue-100 text-blue-700"
                : "hover:text-white text-black dark:text-white hover:bg-blue-500 dark:hover:bg-gray-700"
          }`}
        disabled={isDisabled}
      >
        {date.getDate()}
      </button>
    );
  };

  const renderMonth = (monthOffset: number) => {
    const monthStart = addMonths(currentMonth, monthOffset);
    const monthEnd = endOfMonth(monthStart);
    const monthFirstDay = startOfMonth(monthStart);

    const daysInMonth = Array.from({ length: monthEnd.getDate() }, (_, i) =>
      new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1)
    );

    // Calculate padding for the first week to align the days correctly
    const startDayOfWeek = monthFirstDay.getDay();
    const paddingDays = Array.from({ length: startDayOfWeek }, () => null); // Days before the start of the month

    const days = [...paddingDays, ...daysInMonth]; // Combine padding and days in the month

    // Days of the week header (Sun, Mon, Tue, ...)
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="flex flex-col items-center">
        <div className="font-bold text-lg mb-2 text-black dark:text-white">
          {monthStart.toLocaleString("default", { month: "long" })}{" "}
          {monthStart.getFullYear()}
        </div>

        {/* Weekdays Header */}
        <div className="grid grid-cols-7 gap-3 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-sm text-gray-500 dark:text-gray-400 font-semibold text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days of the month */}
        <div className="grid grid-cols-7 gap-3">
          {days.map((date, index) =>
            date ? renderDay(date) : <div key={index} className="w-10 h-10" /> // Empty div for padding
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pr-[6%] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex gap-12 relative w-120">
      {renderMonth(0)}
      {renderMonth(1)}

      {/* Navigation buttons with more spacing */}
      <button
        type="button"
        className="absolute top-4 left-4 text-gray-500 dark:text-gray-300 text-2xl"
        onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
      >
        &lt;
      </button>
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-2xl"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        &gt;
      </button>
    </div>
  );
};

export default CustomCalendar;