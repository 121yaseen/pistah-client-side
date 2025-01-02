import React, { useState, useEffect, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import CustomCalendar from "./CustomCalendar"; // Assuming you have the CustomCalendar component imported

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onTodayClick: () => void;
  showSearchIcon?: boolean;
  onSearch: () => void; // Add onSearch prop
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onTodayClick,
  showSearchIcon = true,
  onSearch,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: startDate,
    end: endDate,
  });

  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Set default date to today's date when component is mounted
  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setSelectedRange({ start: today, end: today });
  }, []); // Empty dependency array to run once on mount

  const handleDateChange = (start: Date, end: Date | null) => {
    setSelectedRange({ start, end });
    setStartDate(start);
    setEndDate(end);

    // Close the calendar only if both dates are selected or no date is selected
    if ((start && end) || (!start && !end)) {
      setShowCalendar(false);
    }
  };

  const handleFromClick = () => {
    setShowCalendar(true);
    setSelectedRange({ start: startDate, end: endDate });
  };

  const handleToClick = () => {
    setShowCalendar(true);
    setSelectedRange({ start: startDate, end: endDate });
  };

  // Function to format date as "12 Dec 2024"
  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Close the calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        if ((!startDate && !endDate) || (startDate && endDate)) {
          setShowCalendar(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [startDate, endDate]);

  const handleSearch = () => {
    onSearch(); // Trigger the search with the configured dates
  };

  return (
    <div
      className={
        "relative mx-auto max-w-2xl flex flex-col sm:flex-row justify-center items-center py-8"
      }
      style={{ transform: "scale(0.9)", transformOrigin: "center" }}
    >
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-300 dark:border-gray-700 overflow-hidden w-full">
        {/* Today Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const today = new Date();
            setStartDate(today);
            setEndDate(today);
            setSelectedRange({ start: today, end: today });
            onTodayClick(); // Call the onTodayClick function
          }}
          className="h-16 px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 font-semibold text-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition w-full sm:w-auto rounded-l-full"
          style={{
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderTopRightRadius = "1000000px"; // Adjust for hover
            e.currentTarget.style.borderBottomRightRadius = "1000000px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderTopRightRadius = "0px"; // Reset on hover out
            e.currentTarget.style.borderBottomRightRadius = "0px";
          }}
        >
          Today
        </button>

        {/* Vertical Divider */}
        <div className="border-l border-gray-300 dark:border-gray-600 h-8"></div>

        {/* From-To Capsule */}
        <div className="flex items-center w-full px-6">
          {/* From Date Picker */}
          <div
            className="flex items-center gap-4 w-full cursor-pointer"
            onClick={handleFromClick}
          >
            <label className="font-semibold text-black dark:text-gray-200 text-base whitespace-nowrap cursor-pointer">
              From
            </label>
            <div className="bg-transparent text-gray-500 dark:text-gray-300 outline-none text-base font-semibold">
              {formatDate(startDate)}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="border-l border-gray-300 dark:border-gray-600 h-8 mx-4"></div>

          {/* To Date Picker */}
          <div
            className="flex items-center gap-4 w-full cursor-pointer"
            onClick={handleToClick}
          >
            <label className="font-semibold text-black dark:text-gray-200 text-base whitespace-nowrap cursor-pointer">
              To
            </label>
            <div className="bg-transparent text-gray-500 dark:text-gray-300 outline-none text-base font-semibold">
              {formatDate(endDate)}
            </div>
          </div>

          {/* Search Button */}
          {showSearchIcon && (
            <div
              className="p-2 bg-secondaryBlue hover:bg-secondaryBlue dark:bg-white dark:hover:bg-secondaryBlue rounded-full 
            text-white dark:text-secondaryBlue dark:hover:text-white shadow-md cursor-pointer"
              onClick={handleSearch} // Add onClick handler for search button
            >
              <BiSearch size={30} />
            </div>
          )}
        </div>
      </div>

      {/* Custom Calendar Popup */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute w-full max-w-2xl px-6 z-50"
          style={{ top: "80%" }}
        >
          <CustomCalendar
            startDate={selectedRange.start!}
            endDate={selectedRange.end}
            onDateChange={handleDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
