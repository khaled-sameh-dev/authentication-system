import { UserRole, IUser, IOAuthAccount, OAuthProvider } from "@/types";
import { Schema, model } from "mongoose";

const oauthAccountSchema = new Schema<IOAuthAccount>(
  {
    provider: {
      type: String,
      enum: Object.values(OAuthProvider),
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.oauthAccounts.length === 0;
      },
      select: false,
    },
    isEmailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    oauthAccounts: { type: [oauthAccountSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: stripInternalFields },
  },
);

userSchema.index({
  "oauthAccounts.provider": 1,
  "oauthAccounts.providerId": 1,
});

function stripInternalFields(_doc: unknown, ret: Record<string, any>) {
  delete ret.__v;
  delete ret.password;
  return ret;
}

export const UserModel = model<IUser>("User", userSchema);
