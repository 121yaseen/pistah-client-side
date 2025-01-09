"use client";

import { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import CreativePageComponent from "../components/CreativePage";
import { AdsWithBooking } from "@/types/interface";
import Image from "next/image";

export default function CreativePage() {
  const [creatives, setCreatives] = useState<AdsWithBooking[]>([]);

  useEffect(() => {
    const fetchCreativesWithBooking = async () => {
      try {
        const response = await fetch("/api/creativesWithBooking");
        const data = await response.json();
        setCreatives(data);
      } catch (error) {
        console.error("Error fetching creatives with bookings:", error);
      }
    };

    fetchCreativesWithBooking();
  }, []);

  return (
    <>
      <Header />
      {/* If you still need this for other features, keep it. Otherwise, you can remove it. */}
      <CreativePageComponent
        fetchCreatives={() => {
          /* no-op */
        }}
      />

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
    </>
  );
}
