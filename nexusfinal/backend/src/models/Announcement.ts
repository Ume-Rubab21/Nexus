import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: String, required: true }, // who posted it (Society or Admin)
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
