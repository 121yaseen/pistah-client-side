import { Booking } from "@/types/interface";
import { createBooking } from "@/repositories/bookingRepository";
import { createBookings } from "@/repositories/bookingRepository";

export const createNewBooking = async (booking: Booking): Promise<Booking> => {
  try {
    const createdBooking = await createBooking(booking);
    return createdBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

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
