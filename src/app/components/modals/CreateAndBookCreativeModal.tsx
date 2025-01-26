"use client";

import { Ad } from "@/types/interface";
import React, { useEffect, useState } from "react";
import CreativeModal from "./CreateCreativeModal";
import BookInventoryModal from "./BookInventoryModal";
// import { CreativeData } from "../../../types/creativeTypeFile";
// import BookInventoryModal from "./BookInventoryModal";

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
  const [creativeData, setCreativeData] = useState<Ad>({
    id: "",
    title: "",
    downloadLink: "",
    createdBy: "",
    thumbnailUrl: "",
    thumbnailFile: undefined,
    duration: 0,
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
