"use client";

import React, { useEffect, useState } from "react";
import DateRangePicker from "../shared/DateRangePicker";
import { Ad, Booking } from "@/types/interface";
import { useLoader } from "../shared/LoaderComponent";
import { useToast } from "@/app/context/ToastContext";
import AddIcon from "@/icons/addIcon";

type AddCreativeForInvModalProps = {
  onClose: () => void;
  inventoryId: string;
};

const AddCreativeForInvModal: React.FC<AddCreativeForInvModalProps> = ({ onClose, inventoryId }) => {
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const [ads, setAds] = useState<Ad[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<{ value: string; label: string }[]>([]);
  const nowIso = new Date().toISOString();
  const [bookingSets, setBookingSets] = useState<Booking[]>([
    {
      bookingId: crypto.randomUUID(),
      adBoardId: inventoryId,
      adId: "",
      startDate: nowIso,
      endDate: nowIso,
      userId: "",
      status: "pending",
    },
  ]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        showLoader();
        const response = await fetch("/api/creative");
        const data = await response.json();
        setAds(data);
      } catch (error) {
        addToast("Error fetching creatives!", "error");
        console.error("Error fetching creatives:", error);
      } finally {
        hideLoader();
      }
    };

    const fetchAdBoards = async () => {
      try {
        showLoader();
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
        addToast("Error fetching ad boards!", "error");
        console.error("Error fetching ad boards:", error);
      } finally {
        hideLoader();
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
        adBoardId: inventoryId,
        adId: "",
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
      showLoader();
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingSets),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addToast("Failed to create bookings!", "error");
        console.error("Failed to create bookings:", errorData);
        throw new Error(
          `Failed to create bookings: ${response.status} - ${errorData.message || "Unknown error"
          }`
        );
      }

      await response.json();
      addToast("Bookings created successfully!", "success");
    } catch (error) {
      addToast("Error creating bookings!", "error");
      console.error("Error creating bookings:", error);
    } finally {
      hideLoader();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "50%",
          height: "90%",
          overflow: "hidden",
        }}>
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-white">Book Inventory</h2>
        </div>
        <div className="flex items-center justify-between mb-1 p-1 px-5">
          <h1 className="text-lg font-bold text-gray-500 dark:text-gray-300">
            {inventoryOptions.find(inv => inv.value === inventoryId)?.label}
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={addNewSet}
              className="w-6 h-6 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              <AddIcon />
            </button>
            <span className="text-blue-500 text-lg font-semibold">Add Creative</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="space-y-4">
              {bookingSets.map((set) => (
                <div
                  key={set.bookingId}
                  className="p-4 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                >
                  <div className="mb-4 px-2">
                    <select
                      className="w-full p-2 px-3 border rounded dark:bg-gray-700 dark:border-gray-800 cursor-pointer text-sm font-semibold"
                      value={set.adId}
                      onChange={(e) => {
                        const newCreativedId = e.target.value;
                        setBookingSets((prev) =>
                          prev.map((s) =>
                            s.bookingId === set.bookingId
                              ? { ...s, adId: newCreativedId }
                              : s
                          )
                        );
                      }}
                    >
                      <option value="">Select creative</option>
                      {ads.map((creative) => (
                        <option key={creative.id} value={creative.id}>
                          {creative.title} ({creative.createdBy})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <label className="text-sm font-semibold flex-shrink-0 ml-6">
                      Booking Dates:
                    </label>
                    <div className="flex-grow">
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
                        onSearch={() => { }}
                      />
                    </div>
                  </div>
                </div>
              ))}
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

export default AddCreativeForInvModal;
