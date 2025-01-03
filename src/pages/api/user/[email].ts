import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const SAFE_ROOT_DIR = "/var/www/uploads";
import { uploadToS3 } from "@/services/s3Service";
import { updateUserProfile } from "@/services/userService";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (req.method === "GET") {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { Company: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "Email is required and must be a valid string" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Failed to parse form data" });
      }

      const { name, companyName } = fields;
      let profilePicUrl = "";

      if (files.profilePic) {
        const file = Array.isArray(files.profilePic)
          ? files.profilePic[0]
          : files.profilePic;

        try {
          const normalizedFilePath = path.resolve(SAFE_ROOT_DIR, file.filepath);

          const fileBuffer = await fs.promises.readFile(normalizedFilePath);
          profilePicUrl = await uploadToS3(
            fileBuffer,
            file.originalFilename || `profile-pic-${email}`
          );
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res
            .status(500)
            .json({ error: "Failed to upload profile picture" });
        }
      }
      try {
        const updatedUser = await updateUserProfile(email, {
          name: Array.isArray(name) ? name[0] : name,
          companyName: Array.isArray(companyName)
            ? companyName[0]
            : companyName,
          profilePicUrl,
        });
        return res.status(200).json(updatedUser);
      } catch (updateError) {
        console.error("Error updating profile:", updateError);
        return res.status(500).json({ error: "Failed to update profile" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
