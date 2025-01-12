// pages/api/booking/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Booking } from "@/types/interface";
import { getLoggedInUser } from "@/services/userService";
import {
  createNewBookings,
  updateExistingBookings,
} from "@/services/bookingService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await getLoggedInUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      const bookings: Booking[] = req.body;
      const bookingsWithUserId = bookings.map((booking) => ({
        ...booking,
        userId: user.id,
      }));
      const createdBookings = await createNewBookings(bookingsWithUserId);
      return res.status(201).json(createdBookings);
    } else if (req.method === "PUT") {
      // For updating existing bookings
      const bookings: Booking[] = req.body; // array of updated bookings
      // Ensure the user is updating only their own bookings, or implement permissions
      // In a real-world scenario, you'd want to check that each booking.userId === user.id
      const updatedBookings = await updateExistingBookings(bookings);
      return res.status(200).json(updatedBookings);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in /api/booking:", error);
    return res.status(500).json({ message: (error as Error).message });
  }
}
