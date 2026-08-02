import { UserRole, IUser } from "@/types";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: stripInternalFields },
  },
);

function stripInternalFields(_doc: unknown, ret: Record<string, any>) {
  delete ret.__v;
  delete ret.password;
  return ret;
}

export const UserModel = model<IUser>("User", userSchema);
