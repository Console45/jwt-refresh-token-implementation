import User from "../database/models/User";

export class RevokeToken {
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
  async refreshToken(): Promise<boolean> {
    try {
      await User.findOneAndUpdate(
        { _id: this.userId },
        { $inc: { tokenVersion: 1 } }
      );
      return true;
    } catch (err) {
      return false;
    }
  }
  async resetPasswordToken(): Promise<boolean> {
    try {
      await User.findOneAndUpdate(
        { _id: this.userId },
        { $inc: { resetPasswordTokenVersion: 1 } }
      );
      return true;
    } catch (err) {
      return false;
    }
  }
}
