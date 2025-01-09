"use client";

import React, { useEffect, useState } from "react";
import DateRangePicker from "../shared/DateRangePicker";
import { Ad, Booking } from "@/types/interface";

type BookInventoryModalProps = {
  onClose: () => void;
  adId: string;
};

const BookInventoryModal: React.FC<BookInventoryModalProps> = ({
  onClose,
  adId,
}) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedAdId, setSelectedAdId] = useState<string>(adId);
  const [bookingSets, setBookingSets] = useState<Booking[]>([
    {
      bookingId: crypto.randomUUID(),
      adBoardId: "",
      adId: adId,
      startDate: Date.now().toString(),
      endDate: Date.now().toString(),
      userId: "",
      status: "pending",
    },
  ]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/api/creative");
        const data = await response.json();
        setAds(data);
      } catch (error) {
        console.error("Error fetching creatives:", error);
      }
    };

    const fetchAdBoards = async () => {
      try {
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        const options = data.map(
          (board: { adBoardId: string; boardName: string }) => ({
            value: board.adBoardId,
            label: board.boardName,
          })
        );
        setInventoryOptions(options);
      } catch (error) {
        console.error("Error fetching ad boards:", error);
      }
    };

    fetchAds();
    fetchAdBoards();
  }, []);

  const addNewSet = () => {
    setBookingSets((prev) => [
      ...prev,
      {
        bookingId: crypto.randomUUID(),
        adBoardId: "",
        adId: selectedAdId,
        startDate: "",
        endDate: "",
        userId: "",
        status: "pending",
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingSets),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create bookings:", errorData);
        throw new Error(
          `Failed to create bookings: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const createdBookings = await response.json();
      console.log("Bookings created successfully:", createdBookings);
    } catch (error) {
      console.error("Error creating bookings:", error);
    }
    //onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded-lg shadow-lg flex flex-col w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh]">
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-white">Book Inventory</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Select Ad
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                value={selectedAdId}
                onChange={(e) => {
                  const newAdId = e.target.value;
                  setSelectedAdId(newAdId);
                  setBookingSets((prev) =>
                    prev.map((s) => ({ ...s, adId: newAdId }))
                  );
                }}
              >
                <option value="">Select an Ad</option>
                {ads.map((creative) => (
                  <option key={creative.id} value={creative.id}>
                    {creative.title} ({creative.createdBy})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {bookingSets.map((set) => (
                <div
                  key={set.bookingId}
                  className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Select Inventory
                    </label>
                    <select
                      className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                      value={set.adBoardId}
                      onChange={(e) => {
                        const newAdBoardId = e.target.value;
                        setBookingSets((prev) =>
                          prev.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, adBoardId: newAdBoardId }
                              : s
                          )
                        );
                      }}
                    >
                      <option value="">Select an Inventory</option>
                      {inventoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Select Booking Dates
                    </label>
                    <DateRangePicker
                      startDate={set.startDate ? new Date(set.startDate) : null}
                      endDate={set.endDate ? new Date(set.endDate) : null}
                      setStartDate={(date) => {
                        setBookingSets((prev) =>
                          prev.map((s) =>
                            s.bookingId === set.bookingId
                              ? {
                                  ...s,
                                  startDate:
                                    date?.toISOString().split("T")[0] ?? "",
                                }
                              : s
                          )
                        );
                      }}
                      setEndDate={(date) => {
                        setBookingSets((prev) =>
                          prev.map((s) =>
                            s.bookingId === set.bookingId
                              ? {
                                  ...s,
                                  endDate:
                                    date?.toISOString().split("T")[0] ?? "",
                                }
                              : s
                          )
                        );
                      }}
                      onTodayClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        setBookingSets((prev) =>
                          prev.map((s) =>
                            s.bookingId === set.bookingId
                              ? {
                                  ...s,
                                  startDate: today,
                                  endDate: today,
                                }
                              : s
                          )
                        );
                      }}
                      showSearchIcon={false}
                      onSearch={() => {}}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addNewSet}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Add Another Booking
              </button>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 dark:bg-gray-800 flex justify-end gap-4 border-t border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
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
