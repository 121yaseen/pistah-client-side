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

// // Create a new Ad
// export const createAdAsync = async (ad: Ad, createdUser: User) => {
//   const {
//     title,
//     downloadLink,
//     adBoardId,
//     adDisplayStartDate,
//     adDisplayEndDate,
//     adDuration,
//     thumbnailUrl,
//   } = ad;

//   const parsedStartDate = parse(
//     adDisplayStartDate,
//     "EEE MMM dd yyyy",
//     new Date()
//   );
//   const parsedEndDate = parse(adDisplayEndDate, "EEE MMM dd yyyy", new Date());

//   // Convert to UTC using date-fns-tz
//   const utcStartDate = zonedTimeToUtc(parsedStartDate, "UTC");
//   const utcEndDate = zonedTimeToUtc(parsedEndDate, "UTC");

//   return await prisma.ad.create({
//     data: {
//       title,
//       downloadLink,
//       adBoardId,
//       adDisplayStartDate: utcStartDate,
//       adDisplayEndDate: utcEndDate,
//       adDuration,
//       thumbnailUrl,
//       createdById: createdUser.id,
//     },
//   });
// };
