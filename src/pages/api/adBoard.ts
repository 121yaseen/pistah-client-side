import { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
// import {
//   createAdBoard,
//   deleteAdBoard,
//   updateAdBoard,
// } from "@/services/adBoardService";
import { getAdBoards } from "@/repositories/adBoardRepository";
//import { getLoggedInUser } from "@/services/userService";
// import formidable from "formidable";
// import { AdBoardType } from "@/app/enums/AdBoardType";
// import { uploadToS3 } from "@/services/s3Service";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //const user = await getLoggedInUser(req);
  // if (req.method === "POST") {
  //   const form = formidable();
  //   form.parse(req, async (err, fields, files) => {
  //     if (err) {
  //       console.error("Error parsing form:", err);
  //       return res.status(500).json({ error: "Error parsing form data" });
  //     }

  //     const { boardName, location, dailyRate, ownerContact, boardType } =
  //       fields as { [key: string]: string | string[] };

  //     const adBoard: AdBoard = {
  //       boardName: Array.isArray(boardName) ? boardName[0] : boardName,
  //       location: Array.isArray(location) ? location[0] : location,
  //       dailyRate: Number(Array.isArray(dailyRate) ? dailyRate[0] : dailyRate),
  //       ownerContact: Array.isArray(ownerContact)
  //         ? ownerContact[0]
  //         : ownerContact,
  //       boardType: Array.isArray(boardType)
  //         ? (boardType[0] as AdBoardType)
  //         : (boardType as AdBoardType),
  //     };

  //     if (
  //       !adBoard.boardName ||
  //       !adBoard.location ||
  //       !adBoard.dailyRate ||
  //       !adBoard.ownerContact ||
  //       !adBoard.boardType
  //     ) {
  //       return res.status(400).json({ error: "Missing required fields" });
  //     }

  //     if (files.image) {
  //       const file = Array.isArray(files.image) ? files.image[0] : files.image;
  //       if (file.size > 5 * 1024 * 1024) {
  //         return res
  //           .status(400)
  //           .json({ error: "Inventory Image must be less than 5MB" });
  //       }

  //       try {
  //         const fileBuffer = await fs.promises.readFile(file.filepath);
  //         const imageUrl = await uploadToS3(
  //           fileBuffer,
  //           file.originalFilename || "default-filename"
  //         );
  //         adBoard.imageUrl = imageUrl;
  //       } catch (error) {
  //         console.error("Error uploading image to S3:", error);
  //         return res.status(500).json({ error: "Failed to upload image" });
  //       }
  //     }

  //     try {
  //       const response = await createAdBoard(adBoard, user);
  //       return res.status(201).json(response);
  //     } catch (error) {
  //       console.error("Error creating ad board:", error);
  //       return res.status(500).json({ error: "Failed to create ad board" });
  //     }
  //   });
  //}
  if (req.method === "GET") {
    try {
      const adBoards = await getAdBoards();
      return res.status(200).json(adBoards);
    } catch (error) {
      console.error("Error fetching ad boards:", error);
      return res.status(500).json({ error: "Failed to fetch ad boards" });
    }
    // } else if (req.method === "PUT") {
    //   // Update ad board
    //   const form = formidable();
    //   form.parse(req, async (err, fields, files) => {
    //     if (err) {
    //       console.error("Error parsing form:", err);
    //       return res.status(500).json({ error: "Error parsing form data" });
    //     }
    //     const { id, boardName, location, dailyRate, ownerContact, boardType } =
    //       fields as { [key: string]: string | string[] };

    //     const adBoard: AdBoard = {
    //       id: Array.isArray(id) ? id[0] : id,
    //       boardName: Array.isArray(boardName) ? boardName[0] : boardName,
    //       location: Array.isArray(location) ? location[0] : location,
    //       dailyRate: Number(Array.isArray(dailyRate) ? dailyRate[0] : dailyRate),
    //       ownerContact: Array.isArray(ownerContact)
    //         ? ownerContact[0]
    //         : ownerContact,
    //       boardType: Array.isArray(boardType)
    //         ? (boardType[0] as AdBoardType)
    //         : (boardType as AdBoardType),
    //     };

    //     if (
    //       !adBoard.id ||
    //       !adBoard.boardName ||
    //       !adBoard.location ||
    //       !adBoard.dailyRate ||
    //       !adBoard.ownerContact ||
    //       !adBoard.boardType
    //     ) {
    //       return res.status(400).json({ error: "Missing required fields" });
    //     }

    //     if (files.image) {
    //       const file = Array.isArray(files.image) ? files.image[0] : files.image;
    //       if (file.size > 5 * 1024 * 1024) {
    //         return res
    //           .status(400)
    //           .json({ error: "Inventory Image must be less than 5MB" });
    //       }

    //       try {
    //         const fileBuffer = await fs.promises.readFile(file.filepath);
    //         const imageUrl = await uploadToS3(
    //           fileBuffer,
    //           file.originalFilename || "default-filename"
    //         );
    //         adBoard.imageUrl = imageUrl;
    //       } catch (error) {
    //         console.error("Error uploading image to S3:", error);
    //         return res.status(500).json({ error: "Failed to upload image" });
    //       }
    //     }

    //     try {
    //       const response = await updateAdBoard(adBoard, user);
    //       return res.status(200).json(response);
    //     } catch (error) {
    //       console.error("Error creating ad board:", error);
    //       return res.status(500).json({ error: "Failed to create ad board" });
    //     }
    //   });
    // } else if (req.method === "DELETE") {
    //   try {
    //     const response = await deleteAdBoard(req.query.id as string, user);
    //     return res.status(204).json(response);
    //   } catch (error) {
    //     console.error("Error deleting ad board:", error);
    //     return res.status(500).json({ error: "Failed to delete ad board" });
    //   }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
