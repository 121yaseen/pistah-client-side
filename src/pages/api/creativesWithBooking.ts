import { NextApiRequest, NextApiResponse } from "next";
import { fetchAdsWithBookings } from "@/services/adService";
import { getLoggedInUser } from "@/services/userService";

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
      const ads = await fetchAdsWithBookings(userId);
      return res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads with bookings:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch ads with bookings" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
