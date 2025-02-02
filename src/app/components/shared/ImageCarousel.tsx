import React, { useState } from "react";
import Image from "next/image";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Image Display */}
      <div className="relative w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          width={500}
          height={300}
        />
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white transition ${
          !images?.length || currentIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-black/70"
        }`}
        disabled={currentIndex === 0}
      >
        &lt;
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white transition ${
          !images?.length || currentIndex === images.length - 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-black/70"
        }`}
        disabled={currentIndex === images.length - 1}
      >
        &gt;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;