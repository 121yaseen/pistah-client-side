"use client";

import React from "react";
import DateRangePicker from "../shared/DateRangePicker";
import { Ad, Booking } from "@/types/interface";

type BookInventoryModalProps = {
  onClose: () => void;
  inventoryId: string;
  creativeId: string;
};

const BookInventoryModal: React.FC<BookInventoryModalProps> = ({
  onClose,
  inventoryId,
  creativeId,
}) => {
  // Mock data for creatives
  // const creatives: Ad[] = [
  //   {
  //     id: "2000",
  //     title: "creative1",
  //     downloadLink: "http://ex.com",
  //     thumbnailUrl: "",
  //     createdBy: "", // Add missing properties
  //     description: "",
  //     adType: "video",
  //   },
  //   {
  //     id: "2001",
  //     title: "creative1",
  //     downloadLink: "http://ex.com",
  //     thumbnailURL: "",
  //     createdBy: "", // Add missing properties
  //     description: "",
  //     adType: "video",
  //   },
  // ];
  // // Mock data for inventory options
  // const inventoryOptions = [
  //   { value: "inv1", label: "Inventory 1" },
  //   { value: "inv2", label: "Inventory 2" },
  //   { value: "inv3", label: "Inventory 3" },
  // ];

  // const [bookingSets, setBookingSets] = React.useState<Booking[]>([
  //   {
  //     bookingId: crypto.randomUUID(),
  //     adBoardId: inventoryId,
  //     adId: creativeId,
  //     startDate: "null",
  //     endDate: "null",
  //     userId: "", // Add missing properties
  //     status: "pending",
  //   },
  // ]);

  // const addNewSet = () => {
  //   setBookingSets([
  //     ...bookingSets,
  //     {
  //       bookingId: crypto.randomUUID(),
  //       adBoardId: inventoryId,
  //       adId: creativeId,
  //       startDate: "", // Changed from null to empty string
  //       endDate: "", // Changed from null to empty string
  //       userId: "",
  //       status: "pending",
  //     },
  //   ]);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add booking logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      {/* <div
        className="bg-white dark:bg-gray-800 text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "50%",
          height: "80%",
          overflow: "hidden",
        }}
      >
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold">Book Inventory</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                Select Creative
              </label>
              <select
                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                value={creativeId}
                onChange={(e) => {
                  setBookingSets(
                    bookingSets.map((s) => ({
                      ...s,
                      creativeId: e.target.value,
                    }))
                  );
                }}
              >
                <option value="">Select a creative</option>
                {creatives.map((creative) => (
                  <option key={creative.id} value={creative.id}>
                    {creative.title} ({creative.adType})
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
                    <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                      Select Inventory
                    </label>
                    <select
                      className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
                      value={set.inventoryId}
                      onChange={(e) => {
                        setBookingSets(
                          bookingSets.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, inventory: e.target.value }
                              : s
                          )
                        );
                      }}
                    >
                      <option value="">Select an inventory</option>
                      {inventoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                      Select Booking Dates
                    </label>
                    <DateRangePicker
                      startDate={set.startDate}
                      endDate={set.endDate}
                      setStartDate={(date) => {
                        setBookingSets(
                          bookingSets.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, startDate: date }
                              : s
                          )
                        );
                      }}
                      setEndDate={(date) => {
                        setBookingSets(
                          bookingSets.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, endDate: date }
                              : s
                          )
                        );
                      }}
                      onTodayClick={() => {
                        const today = new Date();
                        setBookingSets(
                          bookingSets.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, startDate: today, endDate: today }
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
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
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
      </div> */}
    </div>
  );
};

export default BookInventoryModal;
