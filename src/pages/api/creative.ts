import { NextApiRequest, NextApiResponse } from "next";
import { createAd, fetchFilteredAds } from "@/services/adService";
import { getLoggedInUser } from "@/services/userService";
import { uploadToS3 } from "@/services/s3Service";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user = await getLoggedInUser(req);
    const userId = user?.id;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    try {
      const ads = await fetchFilteredAds(userId);
      return res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      return res.status(500).json({ error: "Failed to fetch ads" });
    }
  } else if (req.method === "POST") {
    const user = await getLoggedInUser(req);
    const userId = user?.id;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }
      const { title, downloadLink, thumbnailUrl, duration } = fields as {
        [key: string]: string | string[];
      };

      const ad = {
        id: "",
        title: Array.isArray(title) ? title[0] : title,
        downloadLink: Array.isArray(downloadLink)
          ? downloadLink[0]
          : downloadLink,
        thumbnailUrl: Array.isArray(thumbnailUrl)
          ? thumbnailUrl[0]
          : thumbnailUrl,
        duration: Number(Array.isArray(duration) ? duration[0] : duration),
        createdBy: userId,
        thumbnailFile: undefined,
      };

      if (!ad.title || !ad.downloadLink || !ad.duration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (files.thumbnailFile) {
        const file = Array.isArray(files.thumbnailFile)
          ? files.thumbnailFile[0]
          : files.thumbnailFile;
        if (file.size > 5 * 1024 * 1024) {
          return res
            .status(400)
            .json({ error: "Thumbnail file must be less than 5MB" });
        }

        try {
          const fileBuffer = await fs.promises.readFile(file.filepath);
          const thumbnailUrl = await uploadToS3(
            fileBuffer,
            file.originalFilename || "default-filename"
          );
          ad.thumbnailUrl = thumbnailUrl;
        } catch (error) {
          console.error("Error uploading thumbnail to S3:", error);
          return res.status(500).json({ error: "Failed to upload thumbnail" });
        }
      }
      if (!ad.thumbnailUrl) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const createdAd = await createAd(ad, user);
        return res.status(201).json(createdAd);
      } catch (error) {
        console.error("Error creating ad:", error);
        return res.status(500).json({ error: "Failed to create ad" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
