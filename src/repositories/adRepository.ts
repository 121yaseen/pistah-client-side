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
