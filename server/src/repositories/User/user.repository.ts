import { translateMongooseError } from "@/errors/DatabaseValidationError";
import { UserModel } from "@/models/user.model";
import { registerSchema } from "@/schemas/auth/register.schema";

class UserRepository {
  constructor() {}

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email }).lean();
  }
  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findOne({ id }).lean();
  }

  async create(user: Partial<IUser>): Promise<IUser | null> {
    try {
      return await UserModel.create(user);
    } catch (error) {
      throw translateMongooseError(error);
    }
  }

  async verifyEmail(userId: string) {
    return UserModel.findOneAndUpdate(
      {
        id: userId,
      },
      {
        isEmailVerified: true,
      },
      {
        new: true,
      },
    );
  }
}

export default UserRepository;
