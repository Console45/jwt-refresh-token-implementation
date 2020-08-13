import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie("jid", token, { httpOnly: true });
};
