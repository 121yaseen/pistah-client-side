"use client";

import React from "react";
import DateRangePicker from "../shared/DateRangePicker";

type BookInventoryModalProps = {
  onClose: () => void;
  inventoryId: string;
  creativeId: string;
};

const BookInventoryModal: React.FC<BookInventoryModalProps> = ({ onClose, inventoryId, creativeId }) => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add booking logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "60%",
          maxHeight: "90%",
          overflow: "hidden",
        }}
      >
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold">Book Advertisement Slot</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                Select Booking Dates
              </label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                onTodayClick={() => {
                  const today = new Date();
                  setStartDate(today);
                  setEndDate(today);
                }}
                showSearchIcon={false}
                onSearch={() => { }}
              />
            </div>
            {/* Add more booking fields as needed */}
          </form>
        </div>

        <div className="px-6 py-4 dark:bg-gray-800 flex justify-end gap-4 border-t border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-gray-400 bg-gray-600 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bookingForm"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookInventoryModal;