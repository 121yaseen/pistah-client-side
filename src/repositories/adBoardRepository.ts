import prisma from "@/app/libs/prismadb";
import { AdBoard } from "@/types/ad";
import { User } from "@/types/user";

// Create a new Ad Board
export const createAdBoardAsync = async (
  adBoard: AdBoard,
  createdUser: User
) => {
  const { boardName, location, boardType, dailyRate, ownerContact } = adBoard;

  return await prisma.adBoard.create({
    data: {
      boardName,
      location,
      dimensions: "10x20 ft",
      boardType: boardType ?? "Static",
      isAvailable: true,
      dailyRate,
      operationalHours: "9 AM - 6 PM",
      ownerContact,
      lastMaintenanceDate: new Date().toISOString(),
      imageUrl: adBoard.imageUrl ?? "",
      createdById: createdUser.id,
    },
  });
};

// Fetch all Ad Boards
export const getAdBoards = async (createdBy: User) => {
  return await prisma.adBoard.findMany({
    where: {
      createdById: createdBy.id,
    },
  });
};

// Fetch all Ads
export const getAds = async () => {
  return await prisma.ad.findMany({
    include: {
      adBoard: true, // Include related AdBoard details
    },
  });
};

// Delete an Ad board and all its Ads
export const deleteAdBoardAsync = async (id: string, user: User) => {
  return await prisma.adBoard.delete({
    where: {
      id,
      createdById: user.id,
    },
  });
};

// Update an Ad Board
export const updateAdBoardAsync = async (adBoard: AdBoard, user: User) => {
  const {
    id,
    boardName,
    location,
    boardType,
    dailyRate,
    ownerContact,
    imageUrl,
  } = adBoard;

  const existingAdBoard = await prisma.adBoard.findUnique({
    where: {
      id,
      createdById: user.id,
    },
  });

  if (!existingAdBoard) {
    throw new Error("Ad board not found");
  }

  if (!imageUrl) {
    // Keep the existing image URL if no new image is uploaded
    adBoard.imageUrl = existingAdBoard.imageUrl;
  }

  return await prisma.adBoard.update({
    where: {
      id,
    },
    data: {
      boardName,
      location,
      boardType,
      dailyRate,
      ownerContact,
      imageUrl,
    },
  });
};
