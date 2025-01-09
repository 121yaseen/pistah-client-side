"use client";

import React, { useState } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useLoader } from "../shared/LoaderComponent";
import { Ad } from "@/types/interface";
// import { CreativeData } from "../../../types/creativeTypeFile";

type CreateCreativeModalProps = {
  onClose: () => void;
  onCreativeCreated?: (creativeData: Ad) => void;
};

const CreateCreativeModal: React.FC<CreateCreativeModalProps> = ({
  onClose,
  onCreativeCreated,
}) => {
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creativeData, setCreativeData] = useState<Ad>({
    id: "",
    title: "",
    downloadLink: "",
    duration: 0,
    thumbnailFile: null as unknown as File | undefined,
    createdBy: "",
    thumbnailUrl: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    downloadLink: false,
    duration: false,
    thumbnailFile: false,
  });

  const validateURL = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);
      return ["http:", "https:"].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const validateDuration = (duration: number): boolean => {
    const durationNum = Number(duration);
    return !isNaN(durationNum) && durationNum > 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      addToast("Please upload an image file", "error");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      addToast("File size must be less than 5MB", "error");
      return;
    }

    setCreativeData((prev) => ({ ...prev, thumbnailFile: file }));
    setErrors((prev) => ({ ...prev, thumbnailFile: false }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCreativeData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validate fields
    const newErrors = {
      title: !creativeData.title.trim(),
      downloadLink: !validateURL(creativeData.downloadLink),
      duration: !validateDuration(creativeData.duration),
      thumbnailFile: !creativeData.thumbnailFile,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      addToast("Please check all required fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", creativeData.title);
    formData.append("downloadLink", creativeData.downloadLink);
    formData.append("duration", creativeData.duration.toString());
    if (creativeData.thumbnailFile) {
      formData.append("thumbnailFile", creativeData.thumbnailFile);
    }

    try {
      setIsSubmitting(true);
      showLoader();
      const response = await fetch("/api/creative", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create creative");
      }

      const createdCreative = await response.json();

      if (onCreativeCreated) {
        onCreativeCreated(createdCreative);
      }

      addToast("Creative added successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error creating creative:", error);
      addToast("Failed to create creative", "error");
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "50%",
          height: "80%",
          overflow: "hidden",
        }}
      >
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold">Add Creative</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="createCreativeForm">
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="title"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={creativeData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300 text-black dark:text-gray-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter creative title"
                maxLength={100}
                disabled={isSubmitting}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">Title is required</p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="downloadLink"
              >
                Download Link <span className="text-red-500">*</span>
              </label>
              <input
                id="downloadLink"
                name="downloadLink"
                type="url"
                value={creativeData.downloadLink}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                  errors.downloadLink ? "border-red-500" : ""
                }`}
                placeholder="https://example.com/video"
                disabled={isSubmitting}
                required
              />
              {errors.downloadLink && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid HTTP(S) URL
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="thumbnail"
              >
                Thumbnail <span className="text-red-500">*</span> (Max 5MB)
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 dark:border-gray-600 dark:text-gray-200 ${
                  errors.thumbnailFile ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
                required
              />
              {errors.thumbnailFile && (
                <p className="text-red-500 text-sm mt-1">
                  Please upload a valid image file (max 5MB)
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="duration"
              >
                Duration <span className="text-red-500">*</span> (seconds)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={creativeData.duration}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 border-gray-300 text-black border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${
                  errors.duration ? "border-red-500" : ""
                }`}
                placeholder="Enter duration"
                min="1"
                max="300"
                disabled={isSubmitting}
                required
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">
                  Duration must be between 1 and 300 seconds
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 dark:bg-gray-800 flex justify-end gap-4 border-t border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded hover:bg-gray-400 bg-gray-600 dark:hover:bg-gray-500 text-white"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="createCreativeForm"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCreativeModal;
