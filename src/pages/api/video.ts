import type { NextApiRequest, NextApiResponse } from "next";
import { getPresignedUploadUrl } from "@/services/s3Service";

const contentTypeMap: { [key: string]: string } = {
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  webm: "video/webm",
};

const getContentTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const contentType = contentTypeMap[extension || ""];
  if (!contentType) {
    throw new Error("Unsupported video file type.");
  }
  return contentType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "Missing fileName in request body." });
  }

  try {
    const contentType = getContentTypeFromFileName(fileName);
    const presignedUrl = await getPresignedUploadUrl(fileName, contentType);
    return res.status(200).json({ url: presignedUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
