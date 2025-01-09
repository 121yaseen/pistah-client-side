import { getAdBoards } from "@/repositories/adBoardRepository";
import { AdBoard } from "@/types/interface";
import { createAdBoardAsync } from "@/repositories/adBoardRepository";
import { getUserAsync } from "./userService";

export const getAllAdBoards = async (): Promise<AdBoard[]> => {
  const adBoards = await getAdBoards();
  return adBoards.map((adBoard) => ({
    ...adBoard,
    description: adBoard.description ?? "",
    boardLength: adBoard.boardLength ?? 0,
    boardWidth: adBoard.boardWidth ?? 0,
    dailyRate: adBoard.dailyRate ?? 0,
    operationalHours: adBoard.operationalHours ?? "",
    thumbnailUrl: adBoard.thumbnailUrl ?? "",
  }));
};

// Create Ad Board

export const createAdBoard = async (
  adBoard: AdBoard,
  createdByEmail: string
): Promise<AdBoard> => {
  const createdUser = await getUserAsync(createdByEmail);
  const newAdBoard = await createAdBoardAsync(adBoard, createdUser);
  return {
    ...newAdBoard,
    description: newAdBoard.description ?? "",
    boardLength: newAdBoard.boardLength ?? 0,
    boardWidth: newAdBoard.boardWidth ?? 0,
    dailyRate: newAdBoard.dailyRate ?? 0,
    operationalHours: newAdBoard.operationalHours ?? "",
    thumbnailUrl: newAdBoard.thumbnailUrl ?? "",
  };
};
