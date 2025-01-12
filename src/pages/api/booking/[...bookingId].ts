import { NextApiRequest, NextApiResponse } from "next";
import { deleteBookingById } from "@/services/bookingService";
import { getLoggedInUser } from "@/services/userService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getLoggedInUser(req);
  const userId = user?.id;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing or invalid userId" });
  }
  if (req.method === "DELETE") {
    const bookingId = req.query.bookingId as string;
    if (!bookingId) {
      return res.status(400).json({ error: "Missing or invalid bookingId" });
    }

    try {
      await deleteBookingById(bookingId, userId);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ error: "Failed to delete booking" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
