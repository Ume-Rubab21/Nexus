import api from "./api";
import { IAnnouncement } from "../types/Announcement";

// Fetch all announcements
export const getAnnouncements = async (): Promise<IAnnouncement[]> => {
  const res = await api.get<IAnnouncement[]>("/announcements"); // your backend route
  return res.data;
};
