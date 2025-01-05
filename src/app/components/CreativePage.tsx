"use client";

import AddIcon from "@/icons/addIcon";
import React, { useState } from "react";
import CreateAndBookCreativeModal from "./modals/CreateAndBookCreativeModal";

const CreativePageComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="flex justify-end items-center mb-6 space-x-2">
              <span className="text-blue-500 text-2xl">
                Add Creative
              </span>
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
      {isModalOpen && <CreateAndBookCreativeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CreativePageComponent;