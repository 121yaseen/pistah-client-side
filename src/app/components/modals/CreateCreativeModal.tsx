"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/app/context/ToastContext";
import { useLoader } from "../shared/LoaderComponent";
import { Creative } from "@/types/interface";
import Image from "next/image";
import axios from "axios";
import UploadIcon from "@/icons/uploadIcon";
import VideoUploadIcon from "@/icons/videoUploadIcon";
import VideoIcon from "@/icons/videoIcon";

type CreateCreativeModalProps = {
  onClose: () => void;
  onCreativeCreated?: (creativeData: Creative) => void;
  onEdit: boolean;
  creativeToEdit?: Creative;
};

const CreativeModal: React.FC<CreateCreativeModalProps> = ({
  onClose,
  onCreativeCreated,
  onEdit,
  creativeToEdit,
}) => {
  const [activeTab, setActiveTab] = useState<"download" | "video">("download");
  const { showLoader, hideLoader } = useLoader();
  const { addToast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null); // Progress state

  const [creativeData, setCreativeData] = useState({
    id: "",
    title: "",
    downloadLink: "",
    adDuration: "",
    thumbnailFile: null as File | null,
    videoFile: null as File | null,
    remarks: "",
    thumbnailUrl: "",
    videoUrl: "",
    createdById: "",
  });

  useEffect(() => {
    if (onEdit && creativeToEdit) {
      setCreativeData({
        id: creativeToEdit.id,
        title: creativeToEdit.title,
        downloadLink: creativeToEdit.downloadLink || "",
        adDuration: creativeToEdit.duration,
        thumbnailUrl: creativeToEdit.thumbnailUrl ?? "",
        videoUrl: creativeToEdit.videoUrl || "",
        remarks: creativeToEdit.remarks ?? "",
        thumbnailFile: null,
        videoFile: null,
        createdById: creativeToEdit.createdById,
      });
      setActiveTab(
        (creativeToEdit.downloadLink || "")?.length > 0 ? "download" : "video"
      );
    }
  }, [onEdit, creativeToEdit]);

  const [errors, setErrors] = useState({
    title: false,
    downloadLink: false,
    adDuration: false,
    thumbnailFile: false,
    videoFile: false,
    remarks: false,
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      return;
    }

    // Validate file type for thumbnail
    if (type === "thumbnail" && !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      addToast("Please upload an image file", "error");
      return;
    }

    // Validate file type for video
    if (type === "video" && !file.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, videoFile: true }));
      addToast("Please upload a video file", "error");
      return;
    }

    // Validate file size (10MB) for thumbnail
    if (type === "thumbnail" && file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnailFile: true }));
      addToast("File size must be less than 10MB", "error");
      return;
    }

    // Validate file size (500MB) for video
    if (type === "video" && file.size > 500 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, videoFile: true }));
      addToast("File size must be less than 500MB", "error");
      return;
    }
    setCreativeData((prev) => ({ ...prev, [`${type}File`]: file }));
    setErrors((prev) => ({ ...prev, [`${type}File`]: false }));
  };

  const handleRemoveFile = (type: "thumbnail" | "video") => {
    setCreativeData((prevData) => ({ ...prevData, [`${type}File`]: null }));
    setErrors((prevErrors) => ({ ...prevErrors, [`${type}File`]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCreativeData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() === "",
    }));
  };

  const removeUrl = (type: "thumbnailUrl" | "videoUrl") => {
    setCreativeData((prevData) => ({
      ...prevData,
      [type]: "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [type]: false,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${type === "thumbnailUrl" ? "thumbnail" : "video"}File`]: true,
    }));
  };

  const uploadVideoToS3 = async (file: File): Promise<string | null> => {
    try {
      // Step 1: Get pre-signed URL
      const presignedResponse = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get pre-signed URL");
      }

      const { url: presignedUrl } = await presignedResponse.json();

      // Step 2: Upload file to S3 using Axios
      const uploadResponse = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          }
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error("Failed to upload video to S3");
      }

      // Extract the URL from the pre-signed URL
      return presignedUrl.split("?")[0]; // Removes query parameters to get the raw URL
    } catch (error) {
      console.error("Error uploading video to S3:", error);
      addToast("Error uploading video", "error");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    showLoader();
    e.preventDefault();

    // Validate fields
    const newErrors = {
      title: creativeData.title.trim() === "",
      downloadLink:
        activeTab === "download" && !validateURL(creativeData.downloadLink),
      adDuration:
        isNaN(Number(creativeData.adDuration)) ||
        Number(creativeData.adDuration) <= 0,
      thumbnailFile:
        (!creativeData.thumbnailFile && creativeData.thumbnailUrl === "") ||
        errors.thumbnailFile,
      videoFile:
        activeTab === "video" &&
        ((!creativeData.videoFile && creativeData.videoUrl === "") ||
          errors.videoFile),
      remarks: creativeData.remarks.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      addToast("You might have missed some fields", "error");
      hideLoader();
      return;
    }

    let videoUrl;
    if (creativeData.videoFile) {
      setUploadProgress(0);
      videoUrl = await uploadVideoToS3(creativeData.videoFile);

      if (!videoUrl) {
        hideLoader();
        addToast("Video upload failed", "error");
        return; // Abort submission if the video upload fails
      }
    }

    const formData = new FormData();
    formData.append("title", creativeData.title);
    if (creativeData.downloadLink) {
      formData.append("downloadLink", creativeData.downloadLink);
    }
    formData.append("adDuration", creativeData.adDuration);
    if (creativeData.thumbnailFile) {
      formData.append("thumbnail", creativeData.thumbnailFile);
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl); // Pass the uploaded video's URL
    }
    formData.append("remarks", creativeData.remarks);
    formData.append("createdById", creativeData.createdById); // Ensure createdById is included

    try {
      const response = await fetch("/api/creatives", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const createdCreative = await response.json();
        if (onCreativeCreated) {
          onCreativeCreated(createdCreative);
        }
        addToast(
          `Creative ${onEdit ? "updated" : "added"} successfully!`,
          "success"
        );
        onClose();
      } else {
        addToast("Something went wrong!", "error");
      }
    } catch (error) {
      addToast("Something went wrong!", "error");
      console.error(`Error ${onEdit ? "updating" : "creating"} ad:`, error);
    } finally {
      hideLoader();
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-lg flex flex-col"
        style={{
          width: "50%",
          maxHeight: "90%",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#001464] dark:bg-gray-800 dark:text-gray-200 flex justify-between items-center border-b border-gray-300 dark:border-gray-600 text-white">
          <h2 className="text-2xl font-bold">
            {onEdit ? "Edit Creative" : "Add Creative"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollable-content">
          <form onSubmit={handleSubmit} id="createAdForm">
            {/* Title Input */}
            <div className="mb-4">
              <label
                className="block font-medium mb-1 dark:text-white text-black text-sm"
                htmlFor="title"
              >
                Creative Name<span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={creativeData.title}
                onChange={handleChange}
                className={` w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 dark:border-gray-600 border-gray-300 text-black dark:text-gray-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter creative name"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  Creative name is required
                </p>
              )}
            </div>

            {/* Add tabs */}
            <div className="mb-4">
              <div className="flex font-medium text-sm items-center">
                <button
                  type="button"
                  className={`py-2 px-4 ${
                    activeTab === "download"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("download")}
                >
                  Video Link{" "}
                  {activeTab === "download" && (
                    <span className="text-red-500">*</span>
                  )}
                </button>
                <span className="px-4 text-gray-400">or</span>
                <button
                  type="button"
                  className={`py-2 px-4 ${
                    activeTab === "video"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("video")}
                >
                  Video Upload{" "}
                  {activeTab === "video" && (
                    <span className="text-red-500">*</span>
                  )}
                </button>
              </div>

              {/* Conditional rendering based on active tab */}
              {activeTab === "download" ? (
                <div className="mt-4">
                  <input
                    id="downloadLink"
                    name="downloadLink"
                    type="url"
                    value={creativeData.downloadLink || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                      errors.downloadLink ? "border-red-500" : ""
                    }`}
                    placeholder="Link to download video"
                    required={activeTab === "download"}
                  />
                  {errors.downloadLink && (
                    <p className="text-red-500 text-sm mt-1">
                      Invalid video link URL
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <label
                    className="cursor-pointer block border-2 rounded-lg mr-10 py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-gray-300 dark:border-gray-700"
                    htmlFor="video"
                    style={{ width: "145px" }}
                  >
                    <div className="flex items-center">
                      <VideoUploadIcon />
                      &nbsp;Add Video{" "}
                    </div>
                  </label>
                  <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      handleFileChange(e, "video");
                      e.target.value = ""; // Clear the input after files are selected
                    }}
                    className="hidden"
                  />
                  {errors.videoFile && (
                    <p className="text-red-500 text-sm mt-1">
                      Please upload a valid video file
                    </p>
                  )}
                  {creativeData.videoFile && (
                    <div className="relative mt-2" style={{ width: "200px" }}>
                      <div className="relative w-34 h-30 rounded-lg overflow-hidden border border-blue-300 text-blue-500 bg-blue-50">
                        <VideoIcon />
                      </div>
                      <button
                        onClick={() => {
                          handleRemoveFile("video");
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                      >
                        <span className="relative top-[-2.5px]">×</span>
                      </button>
                    </div>
                  )}
                  {creativeData.videoUrl && (
                    <div className="relative mt-2" style={{ width: "200px" }}>
                      <div className="relative w-34 h-30 rounded-lg overflow-hidden border border-blue-300 text-blue-500 bg-blue-50">
                        <VideoIcon />
                      </div>
                      <button
                        onClick={() => {
                          removeUrl("videoUrl");
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                      >
                        <span className="relative top-[-2.5px]">×</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block font-medium text-sm mb-1 text-black dark:text-white"
                htmlFor="adDuration"
              >
                Duration (seconds)<span className="text-red-500">*</span>
              </label>
              <input
                id="adDuration"
                name="adDuration"
                type="number"
                value={creativeData.adDuration}
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

            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1 text-black dark:text-white"
                htmlFor="remarks"
              >
                Add more details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={creativeData.remarks}
                onChange={handleChange}
                rows={5}
                className={`w-full px-3 py-2 border rounded dark:bg-gray-700 bg-gray-100 border-gray-300 text-black dark:border-gray-600 dark:text-gray-200 ${
                  errors.remarks ? "border-red-500" : ""
                }`}
                placeholder="Enter more details"
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm mt-1">
                  Add details of the creative
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-medium text-black dark:text-white text-sm">
                Thumbnail (max 5MB)
              </label>
              <span className="text-red-500">*</span>
              <label
                className="cursor-pointer block border-2 rounded-lg mr-10 py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-gray-300 dark:border-gray-700"
                htmlFor="thumbnail"
                style={{ width: "145px" }}
              >
                <div className="flex items-center">
                  <UploadIcon />
                  &nbsp;Add Image{" "}
                </div>
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e, "thumbnail");
                  e.target.value = ""; // Clear the input after files are selected
                }}
                className="hidden"
                placeholder="Add image"
              />
              {errors.thumbnailFile && (
                <p className="text-red-500 text-sm mt-1">
                  Please upload an image less than 5MB
                </p>
              )}
              {creativeData.thumbnailFile && (
                <div className="relative mt-2" style={{ width: "200px" }}>
                  <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(creativeData.thumbnailFile)}
                      alt="Thumbnail"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleRemoveFile("thumbnail");
                    }}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                  >
                    <span className="relative top-[-2.5px]">×</span>
                  </button>
                </div>
              )}
              {creativeData.thumbnailUrl && (
                <div className="relative mt-2" style={{ width: "200px" }}>
                  <div className="relative w-34 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={creativeData.thumbnailUrl}
                      alt="Thumbnail"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      removeUrl("thumbnailUrl");
                    }}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-2xl"
                  >
                    <span className="relative top-[-2.5px]">×</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
          {uploadProgress !== null && (
            <div
              className="w-full bg-gray-400 h-3 -mt-4 mb-4 relative"
              style={{ width: "calc(100% + 50px)", left: "-25px" }}
            >
              <div
                className="bg-blue-600 h-3"
                style={{ width: `${uploadProgress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                uploading video {uploadProgress} %
              </span>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded hover:bg-gray-400 bg-gray-600 dark:hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="createAdForm"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {onEdit ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeModal;
