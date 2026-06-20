import mongoose, { Schema, Document } from "mongoose";

export interface ISociety extends Document {
  name: string;
  description: string;
  president: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocietySchema = new Schema<ISociety>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    president: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Society = mongoose.model<ISociety>("Society", SocietySchema);
