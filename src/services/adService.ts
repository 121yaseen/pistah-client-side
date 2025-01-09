// import { createAdAsync, getAds } from "@/repositories/adRepository";
// import { getAdBoards } from "@/repositories/adBoardRepository";
// import { Ad } from "@/types/ad";
// import { User } from "@/types/user";

import { getAdsByUser } from "@/repositories/adRepository";
import { createAdAsync } from "@/repositories/adRepository";
import { Ad, User } from "@/types/interface";

export const fetchFilteredAds = async (
  createdUserId: string
): Promise<Ad[]> => {
  const ads = await getAdsByUser(createdUserId);
  return ads.map((ad) => ({
    id: ad.adId,
    createdBy: ad.createdBy,
    title: ad.title,
    downloadLink: ad.downloadLink || "",
    thumbnailUrl: ad.thumbnailUrl || "",
    thumbnailFile: undefined,
    duration: ad.duration,
  }));
};

export const createAd = async (ad: Ad, user: User) => {
  return await createAdAsync(ad, user);
};
