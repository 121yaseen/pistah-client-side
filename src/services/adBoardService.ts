import {
  createAdBoardAsync,
  deleteAdBoardAsync,
  updateAdBoardAsync,
} from "@/repositories/adBoardRepository";
import { AdBoard } from "@/types/ad";
import { User } from "@/types/user";

export const createAdBoard = async (
  adBoard: AdBoard,
  createdByUser: User
): Promise<unknown> => {
  const response = await createAdBoardAsync(adBoard, createdByUser);
  return response;
};

// Delete an Ad Board
export const deleteAdBoard = async (
  id: string,
  user: User
): Promise<unknown> => {
  const response = await deleteAdBoardAsync(id, user);
  return response;
};

// Update an Ad Board
export const updateAdBoard = async (
  adBoard: AdBoard,
  user: User
): Promise<unknown> => {
  const response = await updateAdBoardAsync(adBoard, user);
  return response;
};
