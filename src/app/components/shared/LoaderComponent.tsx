"use client";
import React, { useState } from "react";

const LoaderContext = React.createContext({
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLoaders, setActiveLoaders] = useState(0);

  const showLoader = () => setActiveLoaders((count) => count + 1);
  const hideLoader = () => setActiveLoaders((count) => Math.max(0, count - 1));

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {activeLoaders > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => React.useContext(LoaderContext);