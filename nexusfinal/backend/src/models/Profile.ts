import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  studentID: string;
  name: string;
  email: string;
  bio: string;
  interests: string; 
  department: string;
  contactInfo: string;
  student?: mongoose.Schema.Types.ObjectId; 
}

const ProfileSchema = new Schema<IProfile>({
  studentID: { 
    type: String, 
    required: true, 
    unique: true,          
    trim: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,          
    lowercase: true, 
    trim: true 
  },
  bio: { 
    type: String, 
    required: true 
  },
  interests: { type: String, required: false, default: "" },
  department: { 
    type: String, 
    required: true 
  },
  contactInfo: { 
    type: String, 
    required: true, 
    unique: true
  },
  student: { 
    type: Schema.Types.ObjectId, 
    ref: "Student", 
    required: false 
  }
});

export default mongoose.model<IProfile>("Profile", ProfileSchema);
