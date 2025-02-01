export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserDetails extends User {
  password: string;
}

export interface Ad {
  id: string;
  createdBy: string;
  title: string;
  // description: string;
  // adType: string;
  downloadLink: string;
  thumbnailUrl: string;
  thumbnailFile: File | undefined;
  duration: number;
}

export interface Creative {
  id: string;
  title: string;
  downloadLink?: string;
  duration: string;
  thumbnailUrl?: string;
  remarks?: string;
  videoUrl?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomToken {
  user?: {
    name?: string;
    email?: string;
  };
}

export interface AdBoard {
  adBoardId: string;
  ownerId: string;
  location: string;
  description: string;
  defaultCapacity: number;
  boardName: string;
  boardLength: number;
  boardWidth: number;
  dailyRate: number;
  operationalHours: string;
  thumbnailUrl: string;
}

export interface BoardAvailability {
  boardAvailId: string;
  adBoardId: string;
  date: string;
  capacity?: number;
}

export interface Booking {
  bookingId: string;
  userId: string;
  adId: string;
  adBoardId: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface AdsWithBooking extends Ad {
  bookings: BookingWithAdBoard[];
}

export interface CreativesWithBooking extends Creative {
  bookings: BookingWithAdBoard[];
}

export interface BookingWithAdBoard extends Booking {
  adBoard: AdBoard;
}
