"use client";

import Header from "../components/shared/Header";
import { useEffect, useState } from "react";
import { Ad } from "@/types/interface";
import Image from "next/image";
import CreativePageComponent from "../components/CreativePage";

export default function CreativePage() {
  const [creatives, setCreatives] = useState<Ad[]>([]);

  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        const response = await fetch("/api/creative");
        const data = await response.json();
        setCreatives(data);
      } catch (error) {
        console.error("Error fetching creatives:", error);
      }
    };

    fetchCreatives();
  }, []);

  return (
    <>
      <Header />
      <CreativePageComponent />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {creatives.map((creative) => (
          <div
            key={creative.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {creative.thumbnailUrl && (
              <div className="relative h-48">
                <Image
                  src={creative.thumbnailUrl}
                  alt={creative.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{creative.title}</h3>
              <p className="text-gray-700">
                Duration: {creative.duration} seconds
              </p>
              <a
                href={creative.downloadLink}
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
