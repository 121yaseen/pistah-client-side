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
      defaultCapacity: adBoard.defaultCapacity,
      boardName: adBoard.boardName,
      boardLength: adBoard.boardLength,
      boardWidth: adBoard.boardWidth,
      dailyRate: adBoard.dailyRate,
      operationalHours: adBoard.operationalHours,
      thumbnailUrl: adBoard.thumbnailUrl,
    },
  });
  return newAdBoard;
};

// Get All Ad Boards
export const getAdBoards = async () => {
  const adBoards = await prisma.adBoard.findMany();
  return adBoards;
};
