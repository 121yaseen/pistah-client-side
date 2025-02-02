"use client";

import React from "react";
import { BookingWithAdBoard } from "@/types/interface";

type BookingDetailsModalProps = {
  onClose: () => void;
  bookings: BookingWithAdBoard[];
};

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  onClose,
  bookings,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "60%",
          height: "90%",
          overflow: "hidden",
        }}
      >
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold">Inventory Details</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <div className="grid grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="mb-4 p-4 border-2 rounded-lg border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {booking.adBoard.boardName}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start Date
                    </p>
                    <p className="text-black dark:text-white">
                      {new Date(booking.startDate)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">End Date</p>
                    <p className="text-black dark:text-white">
                      {new Date(booking.endDate)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Status</p>
                    <p className="text-black dark:text-white">
                      {booking.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 dark:bg-gray-800 flex justify-end gap-4 border-t border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-gray-600 bg-gray-500 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
