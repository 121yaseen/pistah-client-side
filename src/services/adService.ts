import {
  deleteAdAndRelatedBooking,
  editAdAsync,
  getAdsByUser,
  createAdAsync,
  getAdsWithBookingsByUser,
} from "@/repositories/adRepository";
import { Ad, User } from "@/types/interface";

export const fetchFilteredAds = async (createdUserId: string) => {
  const ads = await getAdsByUser(createdUserId);
  return ads;
};

export const createAd = async (ad: Ad, user: User) => {
  return await createAdAsync(ad, user);
};

export const fetchAdsWithBookings = async (createdUserId: string) => {
  const ads = await getAdsWithBookingsByUser(createdUserId);
  return ads.map((ad) => ({
    id: ad.id,
    createdById: ad.createdById,
    title: ad.title,
    downloadLink: ad.downloadLink || "",
    thumbnailUrl: ad.thumbnailUrl || "",
    thumbnailFile: undefined,
    adBoardId: ad.adBoardId,
    adDuration: ad.adDuration,
    remarks: ad.remarks,
    videoUrl: ad.videoUrl,
    createdAt: ad.createdAt.toISOString(),
    updatedAt: ad.updatedAt.toISOString(),
    bookings: ad.bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      adId: booking.adId,
      adBoardId: booking.adBoardId,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      status: booking.status as "PENDING" | "CONFIRMED" | "CANCELLED",
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      adBoard: {
        id: booking.adBoard.id,
        ownerId: booking.adBoard.ownerId,
        boardName: booking.adBoard.boardName,
        location: booking.adBoard.location,
        description: booking.adBoard.description || "",
        dimensions: booking.adBoard.dimensions,
        boardType: booking.adBoard.boardType,
        isAvailable: booking.adBoard.isAvailable,
        dailyRate: booking.adBoard.dailyRate,
        operationalHours: booking.adBoard.operationalHours,
        ownerContact: booking.adBoard.ownerContact,
        lastMaintenanceDate: booking.adBoard.lastMaintenanceDate.toISOString(),
        imageUrl: JSON.parse(booking.adBoard.imageUrl),
        createdAt: booking.adBoard.createdAt.toISOString(),
        updatedAt: booking.adBoard.updatedAt.toISOString(),
      },
    })),
  }));
};

export const deleteAd = async (adId: string, userId: string) => {
  return await deleteAdAndRelatedBooking(adId, userId);
};

export const editAd = async (adId: string, ad: Ad, userId: string) => {
  return await editAdAsync(adId, ad, userId);
};
