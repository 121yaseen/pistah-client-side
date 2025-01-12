import { deleteAd, editAd } from "@/services/adService";
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
      await deleteAd(adId, userId);
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
      const { title, downloadLink, thumbnailUrl, duration } = fields as {
        [key: string]: string | string[];
      };

      const ad: Ad = {
        id: adId,
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
        const updatedAd = await editAd(adId, ad, userId);
        return res.status(200).json({
          id: updatedAd.adId,
          title: updatedAd.title,
          downloadLink: updatedAd.downloadLink ?? "",
          thumbnailUrl: updatedAd.thumbnailUrl ?? "",
          duration: updatedAd.duration,
          createdBy: updatedAd.createdBy,
        });
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
