import { Booking } from "@/types/interface";
import prisma from "@/app/libs/prismadb";

export const createBooking = async (booking: Booking): Promise<Booking> => {
  try {
    const createdBooking = await prisma.booking.create({
      data: {
        userId: booking.userId,
        adId: booking.adId,
        adBoardId: booking.adBoardId,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        status: booking.status,
      },
    });
    return {
      bookingId: createdBooking.bookingId,
      userId: createdBooking.userId,
      adId: createdBooking.adId,
      adBoardId: createdBooking.adBoardId,
      startDate: createdBooking.startDate.toISOString(),
      endDate: createdBooking.endDate.toISOString(),
      status: createdBooking.status || "PENDING",
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const createBookings = async (
  bookings: Booking[]
): Promise<Booking[]> => {
  try {
    const createdBookings = await prisma.$transaction(
      bookings.map((booking) =>
        prisma.booking.create({
          data: {
            userId: booking.userId,
            adId: booking.adId,
            adBoardId: booking.adBoardId,
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate),
            status: booking.status,
          },
        })
      )
    );

    return createdBookings.map((createdBooking) => ({
      bookingId: createdBooking.bookingId,
      userId: createdBooking.userId,
      adId: createdBooking.adId,
      adBoardId: createdBooking.adBoardId,
      startDate: createdBooking.startDate.toISOString(),
      endDate: createdBooking.endDate.toISOString(),
      status: createdBooking.status || "PENDING",
    }));
  } catch (error) {
    console.error("Error creating bookings:", error);
    throw error;
  }
};
