import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a new div element for the portal
    const element = document.createElement("div");
    document.body.appendChild(element);
    setPortalElement(element);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(element);
    };
  }, []);

  if (!portalElement) return null;

  return createPortal(children, portalElement);
};

export default Portal;