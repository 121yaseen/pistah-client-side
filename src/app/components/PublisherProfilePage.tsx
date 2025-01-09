"use client";

import { useEffect, useState } from "react";
import PencilIcon from "@/icons/pencilIcon";
import ProfileIcon from "@/icons/profileIcon";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/app/context/ToastContext";
import { useLoader } from "./shared/LoaderComponent";

const PublisherProfilePage: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<{
    profilePicUrl: string | File;
    name: string;
    email: string;
    companyName: string;
  }>({
    profilePicUrl: "",
    name: "",
    email: "",
    companyName: "",
  });
  const [preview, setPreview] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    showLoader();
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/user/${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            profilePicUrl: data.profilePicUrl || "",
            name: data.name || "",
            email: data.email || "",
            companyName: data.Company?.name || "",
          });
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        hideLoader();
      }
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, profilePicUrl: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      showLoader();
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("companyName", formData.companyName);

      if (formData.profilePicUrl instanceof File) {
        formDataToSend.append("profilePic", formData.profilePicUrl);
      }

      const response = await fetch(`/api/user/${session?.user?.email}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        addToast("Profile updated successfully!", "success");
        const updatedData = await response.json();
        setFormData({
          profilePicUrl: updatedData.profilePicUrl || "",
          name: updatedData.name || "",
          email: updatedData.email || "",
          companyName: updatedData.companyName || "",
        });
        setPreview(null);
      } else {
        addToast("Failed to update profile.", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("Failed to update profile.", "error");
    } finally {
      fetchUserProfile();
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">
          Company Profile
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 shadow-md rounded-lg"
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <label
                htmlFor="profile-photo"
                className="relative w-32 h-32 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : formData.profilePicUrl ? (
                  <Image
                    src={
                      typeof formData.profilePicUrl === "string"
                        ? formData.profilePicUrl
                        : "/default-profile-pic.png"
                    }
                    alt="Profile Picture"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <ProfileIcon />
                )}
                <span
                  className="absolute bottom-1 right-1 w-8 h-8 p-2 border bg-blue-600 border-blue-600 rounded-full text-white transition flex items-center justify-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <PencilIcon />
                </span>
              </label>
              <input
                type="file"
                id="profile-photo"
                name="photo"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublisherProfilePage;