"use client";

import AddIcon from "@/icons/addIcon";
import React, { useEffect, useState } from "react";
import CreateAndBookCreativeModal from "./modals/CreateAndBookCreativeModal";
import { AdsWithBooking } from "@/types/interface";
import Image from "next/image";
import { useLoader } from "./shared/LoaderComponent";
import PencilIcon from "@/icons/pencilIcon";
import DeleteIcon from "@/icons/deleteIcon";
import InventoryIcon from "@/icons/inventoryIcon";
import Tooltip from "./shared/Tooltip";

const CreativePageComponent: React.FC = () => {
  const { showLoader, hideLoader } = useLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatives, setCreatives] = useState<AdsWithBooking[]>([]);

  const fetchCreativesWithBooking = async () => {
    try {
      showLoader();
      const response = await fetch("/api/creativesWithBooking");
      const data = await response.json();
      setCreatives(data);
    } catch (error) {
      console.error("Error fetching creatives with bookings:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchCreativesWithBooking();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="flex justify-end items-center space-x-2">
              <span className="text-blue-500 text-2xl">Create Campaign</span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
              >
                <AddIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ad Modal */}
      {isModalOpen && (
        <CreateAndBookCreativeModal
          onClose={() => setIsModalOpen(false)}
          fetchCreatives={fetchCreativesWithBooking}
        />
      )}

      {/* Container for all cards */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {creatives.map((ad) => (
          <div
            key={ad.id}
            className="w-full bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden"
          >
            {/* Thumbnail Section */}
            {ad.thumbnailUrl && (
              <div className="relative h-56 w-full md:w-1/3">
                <Image
                  src={ad.thumbnailUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
                <a
                  href={ad.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 px-2 py-1 bg-gray-100 border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 hover:text-white transition text-center"
                >
                  Preview
                </a>
              </div>
            )}

            {/* Info Section */}
            <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
                  <p className="text-gray-600 mb-2">
                    Duration: {ad.duration} seconds
                  </p>

                  {/* Bookings List */}
                  {ad.bookings && ad.bookings.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-gray-700">Bookings:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {ad.bookings.map((booking) => (
                          <li key={booking.bookingId}>
                            <span className="text-gray-800 font-semibold">
                              Board :
                            </span>{" "}
                            {booking.adBoard.boardName} &nbsp;|&nbsp;
                            <span className="text-gray-800 font-semibold">
                              From:
                            </span>{" "}
                            {new Date(booking.startDate).toLocaleDateString()}{" "}
                            &nbsp;|&nbsp;
                            <span className="text-gray-800 font-semibold">
                              To:
                            </span>{" "}
                            {new Date(booking.endDate).toLocaleDateString()}{" "}
                            &nbsp;|&nbsp;
                            <span className="text-gray-800 font-semibold">
                              Status:
                            </span>{" "}
                            {booking.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mt-5">
                      No bookings found.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Tooltip text="Edit Creative">
                    <button className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}>
                      <PencilIcon />
                    </button>
                  </Tooltip>
                  <Tooltip text="Edit Inventory">
                    <button className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}>
                      <InventoryIcon />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Campaign">
                    <button className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}>
                      <DeleteIcon />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativePageComponent;
