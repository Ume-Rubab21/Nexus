import mongoose, { Schema, Document } from "mongoose";

export interface IFriendRequest extends Document {
  requestId: number; // auto-increment
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    requestId: { type: Number, unique: true, required: true }, 
    sender: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true } 
);

export default mongoose.model<IFriendRequest>("FriendRequest", friendRequestSchema);
