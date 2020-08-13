import User, { IUser } from "./../database/models/User";
import { verify } from "jsonwebtoken";
import { Response, NextFunction } from "express";

export const auth = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string = req.header("Authorization")!.replace("Bearer ", "");
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    const user: IUser | null = await User.findOne({
      _id: (payload as any).userId,
      ["accessTokens.token"]: token,
    });

    if (!user) throw new Error();
    req.user = user;
    req.accessToken = token;
    next();
  } catch (err) {
    res.status(401).send({ error: "not authenticated" });
  }
};
