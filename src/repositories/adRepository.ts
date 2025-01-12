import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/interface";
// import { parse } from "date-fns";
// import { zonedTimeToUtc } from "date-fns-tz";

// Fetch all ads
export const getAdsByUser = async (userId: string) => {
  return await prisma.ad.findMany({
    where: {
      createdBy: userId,
    },
  });
};

export const createAdAsync = async (ad: Ad, createdUser: User) => {
  const { title, downloadLink, thumbnailUrl, duration } = ad;

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      thumbnailUrl,
      duration,
      createdBy: createdUser.id,
    },
  });
};

export const getAdsWithBookingsByUser = async (userId: string) => {
  return await prisma.ad.findMany({
    where: {
      createdBy: userId,
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

export const deleteAdAndRelatedBooking = async (
  adId: string,
  userId: string
) => {
  try {
    const ad = await prisma.ad.findUnique({
      where: { adId: adId },
    });
    if (ad?.createdBy !== userId) {
      throw new Error("Unauthorized");
    }
    await prisma.ad.delete({
      where: { adId: adId },
    });
    await prisma.booking.deleteMany({
      where: { adId: adId },
    });
  } catch (error) {
    console.error("Error deleting ad and related booking:", error);
    throw error;
  }
};

export const editAdAsync = async (adId: string, ad: Ad, userId: string) => {
  try {
    const existingAd = await prisma.ad.findUnique({
      where: { adId: adId },
    });
    if (existingAd?.createdBy !== userId) {
      throw new Error("Unauthorized");
    }
    const updatedAd = await prisma.ad.update({
      where: { adId: adId },
      data: {
        title: ad.title,
        downloadLink: ad.downloadLink,
        thumbnailUrl: ad.thumbnailUrl,
        duration: ad.duration,
      },
    });
    return updatedAd;
  } catch (error) {
    console.error("Error editing ad:", error);
    throw error;
  }
};
