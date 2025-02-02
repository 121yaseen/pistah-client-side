import prisma from "@/app/libs/prismadb";
import { AdBoard, User } from "@/types/interface";

// Create a new Ad Board
export const createAdBoardAsync = async (
  adBoard: AdBoard,
  createdUser: User
) => {
  const newAdBoard = await prisma.adBoard.create({
    data: {
      ownerId: createdUser.id,
      location: adBoard.location,
      description: adBoard.description,
      boardName: adBoard.boardName,
      dimensions: adBoard.dimensions,
      boardType: adBoard.boardType,
      isAvailable: adBoard.isAvailable,
      dailyRate: adBoard.dailyRate,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: new Date(adBoard.lastMaintenanceDate),
      imageUrl: JSON.stringify(adBoard.imageUrl),
    },
  });
  return newAdBoard;
};

// Get All Ad Boards
export const getAdBoards = async () => {
  const adBoards = await prisma.adBoard.findMany();
  return adBoards;
};
