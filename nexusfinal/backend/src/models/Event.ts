import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  venue: string;
  society: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    society: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>("Event", EventSchema);
