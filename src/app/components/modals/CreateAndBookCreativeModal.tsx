"use client";

import React, { useEffect, useState } from "react";
import CreativeModal from "./CreateCreativeModal";
import BookInventoryModal from "./BookInventoryModal";
import { Ad } from "@/types/interface";

type CreateAndBookCreativeModalProps = {
  onClose: () => void;
  fetchCreatives: () => void;
  creativeToEdit?: Ad;
};

const CreateAndBookCreativeModal: React.FC<CreateAndBookCreativeModalProps> = ({
  onClose,
  fetchCreatives,
  creativeToEdit,
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [creativeData, setCreativeData] = useState<Partial<Ad>>({
    id: "",
    title: "",
    downloadLink: "",
    adDuration: "",
    thumbnailUrl: "",
    remarks: "",
    videoUrl: "",
    createdById: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
          creativeId={creativeData.id ?? ""}
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
