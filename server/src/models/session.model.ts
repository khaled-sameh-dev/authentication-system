import { ISession } from "@/types/Session";
import { Types, Schema, model } from "mongoose";

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    userAgent: {
      type: String,
      default: "Unknown Device",
    },
    ipAddress: {
      type: String,
      default: "0.0.0.0",
    },
    usedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    requiresReauth: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const SessionModel = model<ISession>("Session", sessionSchema);
