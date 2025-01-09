import { NextApiRequest, NextApiResponse } from "next";
import { Booking } from "@/types/interface";
import { getLoggedInUser } from "@/services/userService";
import { createNewBookings } from "@/services/bookingService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const bookings: Booking[] = req.body;
      const user = await getLoggedInUser(req);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log(bookings);

      const bookingsWithUserId = bookings.map((booking) => ({
        ...booking,
        userId: user.id,
      }));
      const createdBookings = await createNewBookings(bookingsWithUserId);
      res.status(201).json(createdBookings);
    } catch (error) {
      console.error("Error creating booking:", error as Error);
      res.status(500).json({ message: (error as Error).message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
