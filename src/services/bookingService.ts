// services/bookingService.ts
import { Booking } from "@/types/interface";
import {
  createBookings,
  updateBookings,
  deleteBooking,
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

export const deleteBookingById = async (
  bookingId: string,
  userId: string
): Promise<void> => {
  try {
    await deleteBooking(bookingId, userId);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
