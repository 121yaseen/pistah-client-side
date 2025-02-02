import { Booking, Ad, AdBoard } from "@/types/interface";
import prisma from "@/app/libs/prismadb";

export const createBooking = async (
  booking: Booking
): Promise<
  Omit<Booking, "user"> & {
    user: Pick<Booking["user"], "id">;
  }
> => {
  try {
    const createdBooking = await prisma.booking.create({
      data: {
        userId: booking.userId,
        adId: booking.adId,
        adBoardId: booking.adBoardId,
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate),
        status: booking.status || "PENDING",
      },
      include: {
        ad: {
          include: {
            createdUser: true,
          },
        },
        adBoard: {
          include: {
            owner: true,
          },
        },
        user: true,
      },
    });

    return {
      ...createdBooking,
      startDate: createdBooking.startDate.toISOString(),
      endDate: createdBooking.endDate.toISOString(),
      createdAt: createdBooking.createdAt.toISOString(),
      status:
        (createdBooking.status as
          | "PENDING"
          | "CONFIRMED"
          | "CANCELLED"
          | undefined) || "PENDING",
      updatedAt: createdBooking.updatedAt.toISOString(),
      ad: {
        ...createdBooking.ad,
        createdAt: createdBooking.ad.createdAt.toISOString(),
        updatedAt: createdBooking.ad.updatedAt.toISOString(),
      } as unknown as Ad,
      adBoard: {
        ...createdBooking.adBoard,
        createdAt: createdBooking.adBoard.createdAt.toISOString(),
        updatedAt: createdBooking.adBoard.updatedAt.toISOString(),
        lastMaintenanceDate:
          createdBooking.adBoard.lastMaintenanceDate.toISOString(),
        imageUrl: JSON.parse(createdBooking.adBoard.imageUrl),
      } as unknown as AdBoard,
      user: {
        id: createdBooking.user.id,
      },
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const createBookings = async (
  bookings: Booking[]
): Promise<Array<Omit<Booking, "user">>> => {
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
            status: booking.status || "PENDING",
          },
          include: {
            ad: true,
            adBoard: true,
            user: true,
          },
        })
      )
    );
    return createdBookings.map((createdBooking) => ({
      ...createdBooking,
      startDate: createdBooking.startDate.toISOString(),
      endDate: createdBooking.endDate.toISOString(),
      createdAt: createdBooking.createdAt.toISOString(),
      status:
        (createdBooking.status as
          | "PENDING"
          | "CONFIRMED"
          | "CANCELLED"
          | undefined) || "PENDING",
      updatedAt: createdBooking.updatedAt.toISOString(),
      ad: {
        ...createdBooking.ad,
        createdAt: createdBooking.ad.createdAt.toISOString(),
        updatedAt: createdBooking.ad.updatedAt.toISOString(),
      } as unknown as Ad,
      adBoard: {
        ...createdBooking.adBoard,
        createdAt: createdBooking.adBoard.createdAt.toISOString(),
        updatedAt: createdBooking.adBoard.updatedAt.toISOString(),
        lastMaintenanceDate:
          createdBooking.adBoard.lastMaintenanceDate.toISOString(),
        imageUrl: JSON.parse(createdBooking.adBoard.imageUrl),
      } as unknown as AdBoard,
      user: {
        id: createdBooking.user.id,
      },
    }));
  } catch (error) {
    console.error("Error creating bookings:", error);
    throw error;
  }
};

export const updateBookings = async (
  bookings: Booking[]
): Promise<
  Array<Omit<Booking, "user"> & { user: Pick<Booking["user"], "id"> }>
> => {
  try {
    const updatedBookings = await prisma.$transaction(
      bookings.map((booking) =>
        prisma.booking.update({
          where: { id: booking.id },
          data: {
            adBoardId: booking.adBoardId,
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate),
            status: booking.status,
          },
          include: {
            ad: true,
            adBoard: true,
            user: true,
          },
        })
      )
    );
    return updatedBookings.map((updatedBooking) => ({
      ...updatedBooking,
      startDate: updatedBooking.startDate.toISOString(),
      endDate: updatedBooking.endDate.toISOString(),
      createdAt: updatedBooking.createdAt.toISOString(),
      status:
        (updatedBooking.status as
          | "PENDING"
          | "CONFIRMED"
          | "CANCELLED"
          | undefined) || "PENDING",
      updatedAt: updatedBooking.updatedAt.toISOString(),
      ad: {
        ...updatedBooking.ad,
        createdAt: updatedBooking.ad.createdAt.toISOString(),
        updatedAt: updatedBooking.ad.updatedAt.toISOString(),
      } as unknown as Ad,
      adBoard: {
        ...updatedBooking.adBoard,
        createdAt: updatedBooking.adBoard.createdAt.toISOString(),
        updatedAt: updatedBooking.adBoard.updatedAt.toISOString(),
        lastMaintenanceDate:
          updatedBooking.adBoard.lastMaintenanceDate.toISOString(),
        imageUrl: JSON.parse(updatedBooking.adBoard.imageUrl),
      } as unknown as AdBoard,
      user: {
        id: updatedBooking.user.id,
      },
    }));
  } catch (error) {
    console.error("Error updating bookings:", error);
    throw error;
  }
};

export const deleteBooking = async (
  bookingId: string,
  userId: string
): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (booking?.userId !== userId) {
      throw new Error("Unauthorized: You cannot delete this booking");
    }
    await prisma.booking.delete({
      where: { id: bookingId },
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
