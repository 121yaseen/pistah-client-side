"use client";

import React from "react";
import { useToast } from "@/app/context/ToastContext";
import { FaCheck, FaExclamation, FaTimes } from "react-icons/fa";

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="relative flex items-center px-4 py-2 rounded-lg shadow text-white"
          style={{
            backgroundColor:
              toast.type === "success"
                ? "#10B981" /* Green */
                : toast.type === "error"
                  ? "#EF4444" /* Red */
                  : "#3B82F6" /* Blue */,
            width: "300px", // Fixed width
            minHeight: "100px",
            wordWrap: "break-word", // Break long words
            whiteSpace: "normal", // Ensure text wraps
            animation: "slideIn 0.3s, fadeOut 0.5s 2.5s",
            animationTimingFunction: "ease-in-out",
            animationFillMode: "forwards",
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center rounded-full w-8 h-8 text-white mr-4"
            style={{
              backgroundColor:
                toast.type === "success"
                  ? "#16A34A" /* Dark Green */
                  : toast.type === "error"
                    ? "#DC2626" /* Dark Red */
                    : "#2563EB" /* Dark Blue */,
            }}
          >
            {toast.type === "success" && <FaCheck size={16} />}
            {toast.type === "error" && <FaTimes size={16} />}
            {toast.type === "info" && <FaExclamation size={16} />}
          </div>

          {/* Message */}
          <span className="flex-1">{toast.message}</span>

          {/* Close Button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 text-white hover:text-gray-300"
            style={{
              fontSize: "1.5rem",
              lineHeight: "1",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;