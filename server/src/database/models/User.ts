import { Schema, Document, model, HookNextFunction, Model } from "mongoose";
import validator from "validator";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

interface Token {
  token: string;
}
export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  accessTokens: Token[];
  tokenVersion: number;
  createAccessToken: () => Promise<string>;
  createRefreshToken: () => string;
}

const userSchema: Schema = new Schema({
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
  accessTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject["__v"];
  delete userObject["_id"];
  delete userObject["password"];
  delete userObject["tokenVersion"];
  delete userObject["accessTokens"];
  return userObject;
};

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user: IUser | null = await User.findOne({ email });
  if (!user) throw new Error("email is incorrect");
  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new Error("password is incorrect");
  return user;
};

userSchema.methods.createAccessToken = async function (this: IUser) {
  const accessToken: string = sign(
    { userId: this._id.toString() },
    process.env.JWT_ACCESS_TOKEN_SECRET!,
    { expiresIn: "10s" }
  );
  this.accessTokens.push({ token: accessToken });
  await this.save();
  return accessToken;
};

userSchema.methods.createRefreshToken = function () {
  const refreshToken: string = sign(
    { userId: this._id.toString(), tokenVersion: this.tokenVersion },
    process.env.JWT_REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
  return refreshToken;
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
