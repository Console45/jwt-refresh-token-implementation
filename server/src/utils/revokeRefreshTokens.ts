import User from "../database/models/User";

export const revokeRefreshTokens = async (userId: string): Promise<boolean> => {
  try {
    await User.findOneAndUpdate({ _id: userId }, { $inc: { tokenVersion: 1 } });
    return true;
  } catch (err) {
    return false;
  }
};
