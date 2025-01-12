// services/bookingService.ts
import { Booking } from "@/types/interface";
import {
  createBookings,
  updateBookings,
} from "@/repositories/bookingRepository";

export const createNewBookings = async (
  bookings: Booking[]
): Promise<Booking[]> => {
  try {
    const createdBookings = await createBookings(bookings);
    return createdBookings;
  } catch (error) {
    console.error("Error creating bookings:", error);
    throw error;
  }
};

export const updateExistingBookings = async (
  bookings: Booking[]
): Promise<Booking[]> => {
  try {
    const updatedBookings = await updateBookings(bookings);
    return updatedBookings;
  } catch (error) {
    console.error("Error updating bookings:", error);
    throw error;
  }
};
