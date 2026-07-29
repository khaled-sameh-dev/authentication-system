import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: stripInternalFields },
  },
);

function stripInternalFields(_doc: unknown, ret: Record<string, any>) {
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  return ret;
}

export const UserModel = model<IUser>("users", userSchema);
