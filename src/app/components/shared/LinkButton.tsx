import React, { useState } from "react";
import { FiLink } from "react-icons/fi";

interface LinkButtonProps {
  link: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ link }) => {
  const [error, setError] = useState<string | null>(null);

  const openLink = () => {
    setError(null);
    try {
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.log(err);
      setError("Unable to open the link. Please check your browser settings.");
    }
  };

  return (
    <div>
      <button
        onClick={openLink}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        aria-label="Open link"
      >
        <FiLink size={24} /> {/* Displaying the link icon */}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default LinkButton;
