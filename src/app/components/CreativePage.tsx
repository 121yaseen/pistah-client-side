"use client";

import AddIcon from "@/icons/addIcon";
import React, { useEffect, useState } from "react";
import CreateAndBookCreativeModal from "./modals/CreateAndBookCreativeModal";
import { AdsWithBooking, BookingWithAdBoard, Ad } from "@/types/interface";
import Image from "next/image";
import { useLoader } from "./shared/LoaderComponent";
import PencilIcon from "@/icons/pencilIcon";
import DeleteIcon from "@/icons/deleteIcon";
import InventoryIcon from "@/icons/inventoryIcon";
import Tooltip from "./shared/Tooltip";
import BookingDetailsModal from "./modals/BookingDetailsModal";
import BookInventoryModal from "./modals/BookInventoryModal";
import CreativeModal from "./modals/CreateCreativeModal";

const CreativePageComponent: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<
    BookingWithAdBoard[] | null
  >(null);
  const { showLoader, hideLoader } = useLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatives, setCreatives] = useState<AdsWithBooking[]>([]);
  const [selectedCreative, setSelectedCreative] = useState<string>("");
  const [creativeToEdit, setCreativeToEdit] = useState<Ad | undefined>();
  const [existingBookingsForEdit, setExistingBookingsForEdit] = useState<
    BookingWithAdBoard[]
  >([]);

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
    document.body.style.overflow =
      isModalOpen || showCreateModal || showBookingModal || selectedBookings
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, showCreateModal, showBookingModal, selectedBookings]);

  useEffect(() => {
    fetchCreativesWithBooking();
  }, []);

  const OpenInventoryModal = (
    creativeId: string,
    existingBookings?: BookingWithAdBoard[]
  ) => {
    setSelectedCreative(creativeId);
    if (existingBookings) {
      setExistingBookingsForEdit(existingBookings);
    } else {
      setExistingBookingsForEdit([]);
    }
    setShowBookingModal(true);
  };

  const handleEditCreative = (creative: Ad) => {
    setCreativeToEdit(creative);
    setShowCreateModal(true);
  };

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
                <div className="w-8 h-8 mx-auto my-auto">
                  <AddIcon />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container for all cards */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {creatives.map((cr) => (
          <div
            key={cr.id}
            className="w-full bg-white rounded-lg shadow-md flex flex-col md:flex-row overflow-hidden dark:bg-gray-800"
          >
            {/* Thumbnail Section */}
            {cr.thumbnailUrl && (
              <div className="relative h-56 w-full md:w-1/3">
                <Image
                  src={cr.thumbnailUrl}
                  alt={cr.title}
                  fill
                  className="object-cover"
                />
                <a
                  href={cr.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 px-2 py-1 bg-gray-100 border border-blue-500 text-blue-500 text-sm hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white transition text-center dark:bg-gray-800"
                >
                  Preview
                </a>
              </div>
            )}

            {/* Info Section */}
            <div className="w-full md:w-2/3 p-4 flex flex-col justify-center">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                    {cr.title}
                  </h3>
                  <p className="text-gray-600 mb-2 dark:text-gray-300">
                    Duration: {cr.duration} seconds
                  </p>

                  {/* Bookings List */}
                  {cr.bookings && cr.bookings.length > 0 ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedBookings(cr.bookings)}
                        className="px-5 py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-500 hover:text-white transition text-center"
                      >
                        Inventory Details
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mt-5 dark:text-gray-300">
                      <button
                        onClick={() => OpenInventoryModal(cr.id)}
                        className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Book Inventory
                      </button>
                      , to start the campaign.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Tooltip text="Edit Creative">
                    <button
                      className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => handleEditCreative(cr)}
                    >
                      <PencilIcon />
                    </button>
                  </Tooltip>
                  <Tooltip text="Edit Inventory">
                    <button
                      className="p-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => OpenInventoryModal(cr.id, cr.bookings)}
                    >
                      <InventoryIcon />
                    </button>
                  </Tooltip>
                  <Tooltip text="Delete Campaign">
                    <button
                      className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition flex items-center justify-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <DeleteIcon />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create and BookCreative Modal */}
      {isModalOpen && (
        <CreateAndBookCreativeModal
          onClose={() => setIsModalOpen(false)}
          fetchCreatives={fetchCreativesWithBooking}
        />
      )}

      {/* Add the BookingDetailsModal */}
      {selectedBookings && (
        <BookingDetailsModal
          bookings={selectedBookings}
          onClose={() => setSelectedBookings(null)}
        />
      )}

      {/* BookInventoryModal */}
      {showBookingModal && (
        <BookInventoryModal
          onClose={() => setShowBookingModal(false)}
          adId={selectedCreative}
          existingBookings={existingBookingsForEdit}
          fetchCreatives={fetchCreativesWithBooking} // <<--- Pass the function
        />
      )}

      {/* Edit Creative Modal */}
      {showCreateModal && (
        <CreativeModal
          onClose={() => setShowCreateModal(false)}
          onCreativeCreated={fetchCreativesWithBooking}
          onEdit={true}
          creativeToEdit={creativeToEdit}
        />
      )}
    </div>
  );
};

export default CreativePageComponent;
