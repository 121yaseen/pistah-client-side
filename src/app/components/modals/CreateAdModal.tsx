"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import Loader from "../shared/LoaderComponent";
import DateRangePicker from "../shared/DateRangePicker";

type CreateAdModalProps = {
  onClose: () => void;
};

const CreateAdModal: React.FC<CreateAdModalProps> = ({ onClose }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const [adData, setAdData] = useState({
    id: Date.now(),
    title: "",
    downloadLink: "",
    adBoardId: "",
    adDisplayStartDate: "",
    adDisplayEndDate: "",
    adDuration: "",
    thumbnailFile: null as File | null,
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [adBoards, setAdBoards] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState({
    title: false,
    downloadLink: false,
    adBoardId: false,
    adDisplayStartDate: false,
    adDisplayEndDate: false,
    adDuration: false,
    thumbnailFile: false,
  });

  useEffect(() => {
    const fetchAdBoards = async () => {
      try {
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        const adBoards = data.map(
          (board: { id: number; boardName: string }) => ({
            id: board.id,
            name: board.boardName,
          })
        );
        setAdBoards(adBoards);
      } catch (err) {
        addToast("Something went wrong!", "error");
        console.error("Error fetching ad boards:", err);
      }
    };

    fetchAdBoards();
  });

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: true }));
      } else {
        setAdData((prevData) => ({ ...prevData, thumbnailFile: file }));
        setErrors((prevErrors) => ({ ...prevErrors, thumbnailFile: false }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAdData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors = {
      title: adData.title.trim() === "",
      downloadLink: !validateURL(adData.downloadLink),
      adBoardId: adData.adBoardId === "",
      adDisplayStartDate: startDate === null,
      adDisplayEndDate: endDate === null,
      adDuration:
        isNaN(Number(adData.adDuration)) || Number(adData.adDuration) <= 0,
      thumbnailFile: !adData.thumbnailFile || errors.thumbnailFile,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      addToast("Please check the entered fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", adData.title);
    formData.append("downloadLink", adData.downloadLink);
    formData.append("adBoardId", adData.adBoardId);
    formData.append("adDisplayStartDate", startDate?.toDateString() ?? "");
    formData.append("adDisplayEndDate", endDate?.toDateString() ?? "");
    formData.append("adDuration", adData.adDuration);
    if (adData.thumbnailFile) {
      formData.append("thumbnail", adData.thumbnailFile);
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/creatives", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        addToast("Creative added successfully in Dashboard!", "success");
        onClose();

        // Reload Page
        window.location.reload();
      } else {
        addToast("Something went wrong!", "error");
      }
    } catch (error) {
      addToast("Something went wrong!", "error");
      console.error("Error creating ad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Loader isVisible={isLoading} />
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "60%",
          maxHeight: "90%",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold">Add Creative</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="createAdForm">
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={adData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300 text-black dark:text-gray-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Title"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">Title is required</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                Display Dates
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
                onSearch={() => {}}
              />
              {errors.adDisplayStartDate ||
                (errors.adDisplayEndDate && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select valid dates
                  </p>
                ))}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="downloadLink"
              >
                Download Link
              </label>
              <input
                id="downloadLink"
                name="downloadLink"
                type="url"
                value={adData.downloadLink}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                  errors.downloadLink ? "border-red-500" : ""
                }`}
                placeholder="Link to download"
                required
              />
              {errors.downloadLink && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid download link URL
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="thumbnail"
              >
                Thumbnail (Max 5MB)
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 dark:text-gray-200"
              />
              {errors.thumbnailFile && (
                <p className="text-red-500 text-sm mt-1">
                  Please upload an image less than 5MB
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="adBoardId"
              >
                Display on Ad Board
              </label>
              <select
                id="adBoardId"
                name="adBoardId"
                value={adData.adBoardId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded bg-gray-100 border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  errors.adBoardId ? "border-red-500" : ""
                }`}
                required
              >
                <option value="" disabled>
                  Select an ad board
                </option>
                {adBoards.map((board) => (
                  <option key={board.id} value={board.id.toString()}>
                    {board.name}
                  </option>
                ))}
              </select>
              {errors.adBoardId && (
                <p className="text-red-500 text-sm mt-1">
                  Ad board selection is required
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="adDuration"
              >
                Duration (seconds)
              </label>
              <input
                id="adDuration"
                name="adDuration"
                type="number"
                value={adData.adDuration}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 border-gray-300 text-black border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  errors.adDuration ? "border-red-500" : ""
                }`}
                placeholder="Enter duration in seconds"
                required
              />
              {errors.adDuration && (
                <p className="text-red-500 text-sm mt-1">
                  Enter a positive number
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
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
            form="createAdForm"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdModal;
