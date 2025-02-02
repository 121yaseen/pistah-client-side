"use client";

import React, { useEffect, useState } from "react";
import DateRangePicker from "../shared/DateRangePicker";
import { Booking, Creative } from "@/types/interface";
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
  const [ads, setAds] = useState<Creative[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [bookingSets, setBookingSets] = useState<Booking[]>([
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
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);

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

  const openDeleteConfirmModal = (index: string) => {
    setDeleteIndex(index);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed: boolean) => {
    if (confirmed && deleteIndex !== null) {
      setBookingSets((prev) => prev.filter((set) => set.bookingId !== deleteIndex));
    }
    setIsDeleteConfirmationOpen(false);
    setDeleteIndex(null);
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

        <div className="flex-1 overflow-y-auto px-6 py-2 scrollable-content">
          <form onSubmit={handleSubmit} id="bookingForm">
            <div className="space-y-4">
              {bookingSets.length === 0 ? ( // Check if bookingSets is empty
                <div className="font-bold p-4 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-center text-gray-500 dark:text-gray-400">
                  Add now, to start the journey!
                </div>
              ) : (
                bookingSets.map((set) => (
                  <div
                    key={set.bookingId}
                    className="group p-4 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 relative hover:bg-gray-200 dark:hover:bg-gray-500 dark:hover:border-gray-500 transition-colors"
                  >
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => openDeleteConfirmModal(set.bookingId)}
                      className="p-2 rounded-full flex items-center justify-center absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        width: "15px",
                        height: "15px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Grey circle background with transparency
                        border: "none", // Remove the border
                        color: "white", // Faded white color for the cross
                        display: "flex", // Ensure flexbox is applied
                        alignItems: "center", // Vertically center the cross
                        justifyContent: "center", // Horizontally center the cross
                        fontSize: "15px", // Adjust font size to fit the circle
                        lineHeight: "1", // Remove extra line height
                      }}
                    >
                      × {/* Use the multiplication symbol for a better-looking cross */}
                    </button>

                    {/* Flex container for Dropdown and Date Range Picker */}
                    <div className="flex flex-row gap-4 items-center">
                      {/* Dropdown */}
                      <div className="flex-1">
                        <select
                          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-800 cursor-pointer text-sm font-semibold"
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
                          <option value="">Select Creative</option>
                          {ads.map((creative) => (
                            <option className="cursor-pointer" key={creative.id} value={creative.id}>
                              {creative.title} ({creative.createdById})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Range Picker */}
                      <div className="flex-1">
                        <DateRangePicker
                          startDate={set.startDate ? new Date(set.startDate) : null}
                          endDate={set.endDate ? new Date(set.endDate) : null}
                          setStartDate={(date) => {
                            setBookingSets((prev) =>
                              prev.map((s) =>
                                s.bookingId === set.bookingId
                                  ? {
                                    ...s,
                                    startDate: date
                                      ? `${date.getFullYear()}-${(date.getMonth() + 1)
                                        .toString()
                                        .padStart(2, "0")}-${date
                                          .getDate()
                                          .toString()
                                          .padStart(2, "0")}`
                                      : "",
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
                                    endDate: date
                                      ? `${date.getFullYear()}-${(date.getMonth() + 1)
                                        .toString()
                                        .padStart(2, "0")}-${date
                                          .getDate()
                                          .toString()
                                          .padStart(2, "0")}`
                                      : "",
                                  }
                                  : s
                              )
                            );
                          }}
                          onTodayClick={() => {
                            const today = new Date();
                            const todayString = `${today.getFullYear()}-${(
                              today.getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}-${today
                                .getDate()
                                .toString()
                                .padStart(2, "0")}`;

                            setBookingSets((prev) =>
                              prev.map((s) =>
                                s.bookingId === set.bookingId
                                  ? {
                                    ...s,
                                    startDate: todayString,
                                    endDate: todayString,
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
                ))
              )}
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

      {isDeleteConfirmationOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Remove</h3>
            <p className="mb-1">Are you sure you want to remove this booking?</p>
            <p className="font-light italic text-sm">Please check if this is currently playing.</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmation(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCreativeForInvModal;
