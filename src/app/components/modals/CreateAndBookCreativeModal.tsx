"use client";

import { Ad } from "@/types/interface";
import React, { useEffect, useState } from "react";
import CreateCreativeModal from "./CreateCreativeModal";
import BookInventoryModal from "./BookInventoryModal";
// import { CreativeData } from "../../../types/creativeTypeFile";
// import BookInventoryModal from "./BookInventoryModal";

type CreateAndBookCreativeModalProps = {
  onClose: () => void;
  fetchCreatives: () => void;
};

const CreateAndBookCreativeModal: React.FC<CreateAndBookCreativeModalProps> = ({
  onClose,
  fetchCreatives,
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
  }, [showCreateModal, showBookingModal]);

  const handleCreativeCreated = (newCreativeData: typeof creativeData) => {
    console.log(newCreativeData);
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
          adId={creativeData.id}
        />
      )}
      {showCreateModal && (
        <CreateCreativeModal
          onClose={handleCreateModalClose}
          onCreativeCreated={handleCreativeCreated}
        />
      )}
    </>
  );
};

export default CreateAndBookCreativeModal;
