import { deleteAdAndRelatedBooking, editAdAsync } from "@/repositories/adRepository";
import { getLoggedInUser } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { uploadToS3 } from "@/services/s3Service";
import { Ad } from "@/types/interface";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getLoggedInUser(req);
  const userId = user?.id;
  const adId = Array.isArray(req.query.creativeId)
    ? req.query.creativeId[0]
    : (req.query.creativeId as string);

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing or invalid userId" });
  }

  if (!adId || typeof adId !== "string") {
    return res.status(400).json({ error: "Missing or invalid adId" });
  }

  if (req.method === "DELETE") {
    try {
      await deleteAdAndRelatedBooking(adId, userId);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting ad:", error);
      return res.status(500).json({ error: "Failed to delete ad" });
    }
  } else if (req.method === "PUT") {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }
      const {
        title,
        downloadLink,
        thumbnailUrl,
        adBoardId,
        adDisplayStartDate,
        adDisplayEndDate,
        adDuration,
        remarks,
        videoUrl,
      } = fields as {
        [key: string]: string | string[];
      };

      const ad: Partial<Ad> = {
        id: adId,
        title: Array.isArray(title) ? title[0] : title,
        downloadLink: Array.isArray(downloadLink)
          ? downloadLink[0]
          : downloadLink,
        thumbnailUrl: Array.isArray(thumbnailUrl)
          ? thumbnailUrl[0]
          : thumbnailUrl,
        adBoardId: Array.isArray(adBoardId) ? adBoardId[0] : adBoardId,
        adDisplayStartDate: Array.isArray(adDisplayStartDate)
          ? adDisplayStartDate[0]
          : adDisplayStartDate,
        adDisplayEndDate: Array.isArray(adDisplayEndDate)
          ? adDisplayEndDate[0]
          : adDisplayEndDate,
        adDuration: Array.isArray(adDuration) ? adDuration[0] : adDuration,
        remarks: Array.isArray(remarks) ? remarks[0] : remarks,
        videoUrl: Array.isArray(videoUrl) ? videoUrl[0] : videoUrl,
        createdById: userId,
      };

      if (
        !ad.title ||
        !ad.downloadLink ||
        !ad.adDuration ||
        !ad.adBoardId ||
        !ad.adDisplayStartDate ||
        !ad.adDisplayEndDate
      ) {
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
        const updatedAd = await editAdAsync(adId, ad as Ad, userId);
        return res.status(200).json(updatedAd);
      } catch (error) {
        console.error("Error updating ad:", error);
        return res.status(500).json({ error: "Failed to update ad" });
      }
    });
  } else {
    res.setHeader("Allow", ["DELETE", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
