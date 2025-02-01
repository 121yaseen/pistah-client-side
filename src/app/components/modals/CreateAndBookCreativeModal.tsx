"use client";

import { Creative } from "@/types/interface";
import React, { useEffect, useState } from "react";
import CreativeModal from "./CreateCreativeModal";
import BookInventoryModal from "./BookInventoryModal";

type CreateAndBookCreativeModalProps = {
  onClose: () => void;
  fetchCreatives: () => void;
  creativeToEdit?: Creative;
};

const CreateAndBookCreativeModal: React.FC<CreateAndBookCreativeModalProps> = ({
  onClose,
  fetchCreatives,
  creativeToEdit,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [creativeData, setCreativeData] = useState<Creative>({
    id: "",
    title: "",
    downloadLink: "",
    duration: "",
    thumbnailUrl: "",
    remarks: "",
    videoUrl: "",
    createdById: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (!showCreateModal && !showBookingModal) {
      onClose();
    }
    if (creativeToEdit) {
      setCreativeData(creativeToEdit);
    }
  }, [showCreateModal, showBookingModal, creativeToEdit]);

  const handleCreativeCreated = (newCreativeData: typeof creativeData) => {
    fetchCreatives();
    setCreativeData(newCreativeData);
    setShowCreateModal(false);
    setShowBookingModal(true);
  };

  const handleBookingModalClose = () => {
    setShowBookingModal(false);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  return (
    <>
      {showBookingModal && (
        <BookInventoryModal
          onClose={handleBookingModalClose}
          creativeId={creativeData.id}
          fetchCreatives={fetchCreatives}
        />
      )}
      {showCreateModal && (
        <CreativeModal
          onClose={handleCreateModalClose}
          onCreativeCreated={handleCreativeCreated}
          onEdit={!!creativeToEdit}
          creativeToEdit={creativeToEdit}
        />
      )}
    </>
  );
};

export default CreateAndBookCreativeModal;
