"use client";

import { AdBoard } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function InventoryPageComponent() {
  const [adBoards, setAdBoards] = useState<AdBoard[]>([]);

  useEffect(() => {
    async function fetchAdBoards() {
      try {
        const response = await fetch("/api/adBoard");
        const data = await response.json();
        setAdBoards(data);
      } catch (error) {
        console.error("Error fetching ad boards:", error);
      }
    }

    fetchAdBoards();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {adBoards.map((adBoard) => (
            <div
              key={adBoard.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            >
              {adBoard.imageUrl && (
                <Image
                  src={adBoard.imageUrl}
                  alt={adBoard.boardName}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{adBoard.boardName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {adBoard.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daily Rate: ${adBoard.dailyRate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Owner Contact: {adBoard.ownerContact}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Board Type: {adBoard.boardType}
                </p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
