import { AdBoardType } from "@/app/enums/AdBoardType";

export interface Ad {
  id?: number;
  title: string;
  downloadLink: string;
  adBoardId: string;
  adDisplayStartDate: string;
  adDisplayEndDate: string;
  adDuration: string;
  thumbnailUrl: string;
}

export interface AdWithBoard extends Ad {
  adBoard: AdBoard;
}

export interface AdBoard {
  id?: string;
  image?: File | null;
  boardType: AdBoardType;
  boardName: string;
  location: string;
  dailyRate: number;
  ownerContact: string;
  count?: number;
  size?: string;
  more?: string;
  imageUrl?: string;
}
