import { getAdBoards } from "@/repositories/adBoardRepository";
import { AdBoard } from "@/types/interface";
import { createAdBoardAsync } from "@/repositories/adBoardRepository";
import { getUserAsync } from "./userService";

export const getAllAdBoards = async () => {
  const adBoards = await getAdBoards();
  return adBoards;
};

// Create Ad Board

export const createAdBoard = async (
  adBoard: AdBoard,
  createdByEmail: string
) => {
  const createdUser = await getUserAsync(createdByEmail);
  if (!createdUser) {
    throw new Error("User not found");
  }
  const newAdBoard = await createAdBoardAsync(adBoard, createdUser);
  return newAdBoard;
};
