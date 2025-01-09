"use client";

import AddIcon from "@/icons/addIcon";
import React, { useEffect, useState } from "react";
import CreateAndBookCreativeModal from "./modals/CreateAndBookCreativeModal";
import { AdsWithBooking } from "@/types/interface";
import Image from "next/image";

const CreativePageComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatives, setCreatives] = useState<AdsWithBooking[]>([]);

  const fetchCreativesWithBooking = async () => {
    try {
      const response = await fetch("/api/creativesWithBooking");
      const data = await response.json();
      setCreatives(data);
    } catch (error) {
      console.error("Error fetching creatives with bookings:", error);
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
              </div>
            )}

            {/* Info Section */}
            <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
                <p className="text-gray-600 mb-2">
                  Duration: {ad.duration} seconds
                </p>
                <a
                  href={ad.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-800 underline mb-4"
                >
                  Download Link
                </a>

                {/* Bookings List */}
                {ad.bookings && ad.bookings.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-1">Bookings:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
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
                  <p className="text-sm text-gray-500 italic">
                    No bookings found.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreativePageComponent;
