/**
 * Enum: Role
 * - Differentiates between Advertisers (DSP) and Ad Board Owners (SSP).
 */
export enum Role {
  ADVERTISER = "ADVERTISER",
  OWNER = "OWNER",
}

/**
 * Model: User
 * - Represents both Ad Board Owners (SSP) and Advertisers (DSP).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  profilePicUrl?: string;
  role: Role; // "ADVERTISER" (DSP) or "OWNER" (SSP)
  createdAt: string;
  updatedAt: string;

  // Relations
  ads?: Ad[];
  adBoards?: AdBoard[];
  bookings?: Booking[];
  accounts?: Account[];
  company?: Company | null;
}

/**
 * Model: Ad
 * - Represents advertisements created by Advertisers (DSP) or Board Owners (SSP).
 */
export interface Ad {
  id: string;
  createdById: string;
  title: string;
  downloadLink?: string;
  thumbnailUrl?: string;
  thumbnailFile?: File;
  adDuration: string;
  remarks: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  createdUser: User;
  bookings?: Booking[];
  adBoardId?: string;
  adDisplayStartDate?: string;
  adDisplayEndDate?: string;
}

/**
 * Model: AdBoard
 * - Represents advertising boards created by SSP owners.
 */
export interface AdBoard {
  id: string;
  ownerId: string;
  boardName: string;
  location: string;
  description?: string;
  dimensions: string;
  boardType: string;
  isAvailable: boolean;
  dailyRate: number;
  operationalHours: string;
  ownerContact: string;
  lastMaintenanceDate: string;
  imageUrl: string[];
  createdAt: string;
  updatedAt: string;

  // Relations
  owner: User;
  bookings?: Booking[];
  boardAvailabilities?: BoardAvailability[];
}

/**
 * Model: BoardAvailability
 * - Defines availability for specific dates and capacities.
 */
export interface BoardAvailability {
  id: string;
  adBoardId: string;
  date: string;
  capacity?: number;

  createdAt: string;
  updatedAt: string;

  // Relations
  adBoard: AdBoard;
}

/**
 * Model: Booking
 * - Associates DSP advertisers with an Ad Board over a date range.
 */
export interface Booking {
  id: string;
  userId: string;
  adId: string;
  adBoardId: string;
  startDate: string;
  endDate: string;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED";

  createdAt: string;
  updatedAt: string;

  // Relations
  user: User;
  ad: Ad;
  adBoard: AdBoard;
}

/**
 * Model: Account
 * - Handles OAuth accounts for users.
 */
export interface Account {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: string;

  user: User;
}

/**
 * Model: Company
 * - Associates a user with a company (for Advertisers in DSP).
 */
export interface Company {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;

  user: User;
}

export interface CustomToken {
  user?: {
    id: string;
    name?: string;
    email?: string;
    role: "SSP" | "DSP";
  };
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
