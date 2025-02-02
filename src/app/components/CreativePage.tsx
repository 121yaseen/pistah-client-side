"use client";

import AddIcon from "@/icons/addIcon";
import React, { useEffect, useState } from "react";
import CreateAndBookCreativeModal from "./modals/CreateAndBookCreativeModal";
import {
  BookingWithAdBoard,
  Creative,
  CreativesWithBooking,
} from "@/types/interface";
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
  const [creatives, setCreatives] = useState<CreativesWithBooking[]>([]);
  const [selectedCreative, setSelectedCreative] = useState<string>("");
  const [creativeToEdit, setCreativeToEdit] = useState<Creative | undefined>();
  const [existingBookingsForEdit, setExistingBookingsForEdit] = useState<
    BookingWithAdBoard[]
  >([]);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

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

  const handleEditCreative = (creative: Creative) => {
    setCreativeToEdit(creative);
    setShowCreateModal(true);
  };

  const openDeleteConfirmModal = (index: string) => {
    //setDeleteIndex(index);
    setIsDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async (confirmed: boolean) => {
    // if (confirmed && deleteIndex !== null) {
    //   setIsLoading(true);
    //   const adBoardId = adBoards[deleteIndex]?.id;
    //   if (adBoardId) {
    //     deleteAdBoard(adBoardId)
    //       .then(
    //         () => {
    //           addToast("Inventory deleted successfully!", "success");
    //         },
    //         () => {
    //           addToast("Failed to delete Inventory!", "error");
    //         }
    //       )
    //       .finally(async () => {
    //         await loadAdBoards();
    //         setIsLoading(false);
    //       });
    //   } else {
    //     addToast("Inventory Id is undefined!", "error");
    //   }
    // }
    //setDeleteIndex(null);
  };

  const handleDeleteCreative = async (creativeId: string) => {
    try {
      showLoader();
      await deleteAdAndRelatedBooking(creativeId);
      await fetchCreativesWithBooking();
    } catch (error) {
      console.error("Error deleting creative:", error);
    } finally {
      setIsDeleteConfirmationOpen(false);

      hideLoader();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {creatives.length > 0 && (
        <div className="container mx-auto py-10">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <div className="flex justify-end items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
                >
                  <div className="w-7 h-7 mx-auto my-auto">
                    <AddIcon />
                  </div>
                </button>
                <span className="text-blue-500 text-2xl">Create Campaign</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Listings Screen */}
      {creatives.length === 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            No Campaigns Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
            Get started by creating your first campaign to manage your
            advertising creatives and inventory bookings.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <AddIcon className="w-5 h-5" />
            <span>Create New Campaign</span>
          </button>
        </div>
      )}

      {/* Container for all cards */}
      {creatives.length > 0 && (
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
                      Duration: {cr.adDuration} seconds
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
                        onClick={() => openDeleteConfirmModal(cr.id)}
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
      )}

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
          creativeId={selectedCreative}
          existingBookings={existingBookingsForEdit}
          fetchCreatives={fetchCreativesWithBooking}
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

      {isDeleteConfirmationOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-1">
              Are you sure you want to delete this Campaign?
            </p>
            <p className="font-light italic text-sm">
              The added creative and selected inventories will be removed.
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirmation(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativePageComponent;
function deleteAdAndRelatedBooking(creativeId: string) {
  return fetch(`/api/creative?adId=${creativeId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete creative");
    }
  });
}
