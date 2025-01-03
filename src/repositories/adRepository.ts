import prisma from "@/app/libs/prismadb";
import { Ad } from "@/types/ad";
import { User } from "@/types/user";
import { parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

// Fetch all ads
export const getAds = async (startDate: string, endDate: string) => {
  return await prisma.ad.findMany({
    where: {
      adDisplayStartDate: {
        lte: new Date(endDate),
      },
      adDisplayEndDate: {
        gte: new Date(startDate),
      },
    },
  });
};

// Create a new Ad
export const createAdAsync = async (ad: Ad, createdUser: User) => {
  const {
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    thumbnailUrl,
  } = ad;

  const parsedStartDate = parse(
    adDisplayStartDate,
    "EEE MMM dd yyyy",
    new Date()
  );
  const parsedEndDate = parse(adDisplayEndDate, "EEE MMM dd yyyy", new Date());

  // Convert to UTC using date-fns-tz
  const utcStartDate = zonedTimeToUtc(parsedStartDate, "UTC");
  const utcEndDate = zonedTimeToUtc(parsedEndDate, "UTC");

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      adBoardId,
      adDisplayStartDate: utcStartDate,
      adDisplayEndDate: utcEndDate,
      adDuration,
      thumbnailUrl,
      createdById: createdUser.id,
    },
  });
};
