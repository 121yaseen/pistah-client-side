import { getAdsByUser } from "@/repositories/adRepository";
import { createAdAsync } from "@/repositories/adRepository";
import { Ad, User } from "@/types/interface";
import { getAdsWithBookingsByUser } from "@/repositories/adRepository";
import { AdsWithBooking } from "@/types/interface";

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

export const fetchAdsWithBookings = async (
  createdUserId: string
): Promise<AdsWithBooking[]> => {
  const ads = await getAdsWithBookingsByUser(createdUserId);
  return ads.map((ad) => ({
    id: ad.adId,
    createdBy: ad.createdBy,
    title: ad.title,
    downloadLink: ad.downloadLink || "",
    thumbnailUrl: ad.thumbnailUrl || "",
    thumbnailFile: undefined,
    duration: ad.duration,
    bookings: ad.bookings.map((booking) => ({
      bookingId: booking.bookingId,
      userId: booking.userId,
      adId: booking.adId,
      adBoardId: booking.adBoardId,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      status: booking.status || "PENDING",
      adBoard: {
        adBoardId: booking.adBoard.adBoardId,
        ownerId: booking.adBoard.ownerId,
        location: booking.adBoard.location,
        description: booking.adBoard.description || "",
        defaultCapacity: booking.adBoard.defaultCapacity,
        boardName: booking.adBoard.boardName,
        boardLength: booking.adBoard.boardLength || 0,
        boardWidth: booking.adBoard.boardWidth || 0,
        dailyRate: booking.adBoard.dailyRate || 0,
        operationalHours: booking.adBoard.operationalHours || "",
        thumbnailUrl: booking.adBoard.thumbnailUrl || "",
      },
    })),
  }));
};
