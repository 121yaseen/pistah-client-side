"use client";

import { useEffect, useState } from "react";
import { useLoader } from "./shared/LoaderComponent";
import AddCreativeForInvModal from "./modals/AddCreativeForInvModal";
import ImageCarousel from "./shared/ImageCarousel";
import { AdBoard } from "@/types/interface";

export default function InventoryPageComponent() {
  const { showLoader, hideLoader } = useLoader();
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAdBoardId, setSelectedAdBoardId] = useState<string>("");

  useEffect(() => {
    async function fetchAdBoards() {
      try {
        showLoader();
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        setAdBoards(data);
      } catch (error) {
        console.error("Error fetching ad boards:", error);
      } finally {
        hideLoader();
      }
    }

    fetchAdBoards();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showBookingModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showBookingModal]);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adBoards.map((adBoard) => (
            <div
              key={adBoard.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            >
              <div className="relative w-full" style={{ height: "250px" }}>
                <ImageCarousel images={adBoard.imageUrl} />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{adBoard.boardName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {adBoard.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daily Rate: {adBoard.dailyRate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Owner Contact: {adBoard.ownerContact}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Board Type: {adBoard.boardType}
                </p>
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedAdBoardId(adBoard.id);
                    setShowBookingModal(true);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showBookingModal && (
        <AddCreativeForInvModal
          onClose={() => setShowBookingModal(false)}
          inventoryId={selectedAdBoardId}
        />
      )}
    </div>
  );
}
