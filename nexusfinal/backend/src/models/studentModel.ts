import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IStudent extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
  role: "registered" | "non-registered";
  profile?: Types.ObjectId;
  friends?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["registered", "non-registered"],
      required: true,
    },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" },
    friends: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.friends = this.friends || [];
    next();
  } catch (error) {
    next(error as Error);
  }
});

StudentSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
export default Student;
