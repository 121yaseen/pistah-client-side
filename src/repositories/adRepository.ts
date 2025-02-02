import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/interface";

// Fetch all ads by user
export const getAdsByUser = async (userId: string) => {
  return await prisma.ad.findMany({
    where: {
      createdById: userId,
    },
  });
};

// Create a new ad
export const createAdAsync = async (ad: Ad, createdUser: User) => {
  const {
    title,
    downloadLink,
    thumbnailUrl,
    adBoardId,
    adDuration,
    remarks,
    videoUrl,
  } = ad;

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      thumbnailUrl,
      adBoardId,
      adDuration,
      remarks: remarks ?? "",
      videoUrl,
      createdById: createdUser.id,
    },
  });
};

// Fetch ads with bookings by user
export const getAdsWithBookingsByUser = async (userId: string) => {
  return await prisma.ad.findMany({
    where: {
      createdById: userId,
    },
    include: {
      bookings: {
        include: {
          adBoard: true,
        },
      },
    },
  });
};

// Delete an ad and its related bookings
export const deleteAdAndRelatedBooking = async (
  adId: string,
  userId: string
) => {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    });
    if (ad?.createdById !== userId) {
      throw new Error("Unauthorized");
    }
    await prisma.ad.delete({
      where: { id: adId },
    });
    await prisma.booking.deleteMany({
      where: { adId: adId },
    });
  } catch (error) {
    console.error("Error deleting ad and related booking:", error);
    throw error;
  }
};

// Edit an existing ad
export const editAdAsync = async (adId: string, ad: Ad, userId: string) => {
  try {
    const existingAd = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (existingAd?.createdById !== userId) {
      throw new Error("Unauthorized");
    }

    const updatedAd = await prisma.ad.update({
      where: { id: adId },
      data: {
        title: ad.title,
        downloadLink: ad.downloadLink,
        thumbnailUrl: ad.thumbnailUrl,
        adBoardId: ad.adBoardId,
        adDuration: ad.adDuration,
        remarks: ad.remarks,
        videoUrl: ad.videoUrl,
      },
    });
    return updatedAd;
  } catch (error) {
    console.error("Error editing ad:", error);
    throw error;
  }
};
