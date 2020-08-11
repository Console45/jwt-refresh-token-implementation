import { Schema, Document, model, HookNextFunction } from "mongoose";
import validator from "validator";
import { hash } from "bcrypt";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
}

const userSchema = new Schema({
  name: { type: String, trim: true, required: true },
  email: {
    type: String,
    trim: true,
    rquired: true,
    validate(value: string): any {
      if (!validator.isEmail(value)) throw new Error("not an email");
    },
  },
  password: { type: String, trim: true, required: true },
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject["__v"];
  return userObject;
};

userSchema.pre<IUser>("save", async function (
  next: HookNextFunction
): Promise<void> {
  if (this.isModified("password")) this.password = await hash(this.password, 8);
  next();
});

export default model<IUser>("User", userSchema);
