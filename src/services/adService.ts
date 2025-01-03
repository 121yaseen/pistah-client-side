import { createAdAsync, getAds } from "@/repositories/adRepository";
import { getAdBoards } from "@/repositories/adBoardRepository";
import { Ad } from "@/types/ad";
import { User } from "@/types/user";

export const fetchFilteredAds = async (
  startDate: string,
  endDate: string,
  createdUser: User
) => {
  let ads = await getAds(startDate, endDate);
  const adBoards = await getAdBoards(createdUser);

  ads = ads.filter((ad) => adBoards.some((board) => board.id == ad.adBoardId));

  const filteredAds = ads.map((ad) => {
    const adBoard = adBoards.find((board) => board.id == ad.adBoardId);
    return { ...ad, adBoard: adBoard || undefined };
  });
  return filteredAds;
};

export const createAd = async (adData: Ad, createdUser: User) => {
  await createAdAsync(adData, createdUser);
};
