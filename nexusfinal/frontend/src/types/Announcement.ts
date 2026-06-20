// src/types/Announcement.ts
export interface IAnnouncement {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
