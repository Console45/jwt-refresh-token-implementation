import { Schema, Document, model, HookNextFunction, Model } from "mongoose";
import validator from "validator";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

interface Token {
  token: string;
}

export enum Role {
  Admin = "Admin",
  User = "User",
}
export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: Role;
  accessTokens: Token[];
  refreshTokenVersion: number;
  resetPasswordTokenVersion: number;
  createAccessToken: () => Promise<string>;
  createRefreshToken: () => string;
  createResetPasswordToken: () => string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, trim: true, required: true },
  email: {
    type: String,
    trim: true,
    unique: true,
    rquired: true,
    validate(value: string): any {
      if (!validator.isEmail(value)) throw new Error("not an email");
    },
  },
  password: { type: String, trim: true, required: true },
  role: {
    type: String,
    trim: true,
    required: true,
    enum: ["User", "Admin"],
    default: "User",
  },
  accessTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  resetPasswordTokenVersion: {
    type: Number,
    default: 0,
  },
  refreshTokenVersion: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.toJSON = function (this: IUser): any {
  const userObject = this.toObject();
  delete userObject["__v"];
  delete userObject["password"];
  delete userObject["refreshTokenVersion"];
  delete userObject["resetPasswordTokenVersion"];
  delete userObject["accessTokens"];
  return userObject;
};

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user: IUser | null = await User.findOne({ email });
  if (!user) throw new Error("email is incorrect");
  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new Error("password is incorrect");
  return user;
};

userSchema.methods.createAccessToken = async function (
  this: IUser
): Promise<string> {
  const accessToken: string = sign(
    { userId: this._id.toString() },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
  this.accessTokens.push({ token: accessToken });
  await this.save();
  return accessToken;
};

userSchema.methods.createRefreshToken = function (this: IUser): string {
  const refreshToken: string = sign(
    { userId: this._id.toString(), tokenVersion: this.refreshTokenVersion },
    process.env.JWT_REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
  return refreshToken;
};

userSchema.methods.createResetPasswordToken = function (this: IUser): string {
  const resetPasswordToken: string = sign(
    {
      userId: this._id.toString(),
      tokenVersion: this.resetPasswordTokenVersion,
    },
    process.env.RESET_PASSWORD_TOKEN_SECRET!,
    { expiresIn: "30m" }
  );
  return resetPasswordToken;
};

export interface IUserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

userSchema.pre<IUser>("save", async function (
  next: HookNextFunction
): Promise<void> {
  if (this.isModified("password")) this.password = await hash(this.password, 8);
  next();
});

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
