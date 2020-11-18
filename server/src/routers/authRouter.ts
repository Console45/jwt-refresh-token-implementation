import { Response, Request, Router } from "express";
import { verify } from "jsonwebtoken";
import User, { IUser } from "../database/models/User";
import { RevokeToken } from "../utils/revokeToken";
import { sendRefreshToken } from "../utils/sendRefreshToken";
// import { sendResetPasswordEmail } from "../emails/account";

export const router: Router = Router();

router.post("/refresh_token", async (req: any, res: Response) => {
  const token: string = req.cookies.jid;
  if (!token) return res.status(401).send({ ok: false, accessToken: "" });
  let payload: any = null;
  try {
    payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.status(401).send({ ok: false, accessToken: "" });
  }
  const user: IUser | null = await User.findOne({ _id: payload.userId });
  if (!user) return res.status(404).send({ ok: false, accessToken: "" });
  if (user.refreshTokenVersion !== payload.tokenVersion)
    return res.status(403).send({ ok: false, accessToken: "" });

  sendRefreshToken(res, user.createRefreshToken());
  const accessToken = await user.createAccessToken();
  req.accessToken = accessToken;
  return res.send({ ok: true, accessToken });
});

router.post("/revoke_user", async ({ body }: Request, res: Response) => {
  const user: IUser | null = await User.findOne({ email: body.email });
  let isRevoked: boolean = false;
  if (user) {
    const revokeToken = new RevokeToken(user._id);
    isRevoked = await revokeToken.refreshToken();
  }
  res.send({ isRevoked });
});
router.post(
  "/revoke_resetPasswordToken",
  async ({ body }: Request, res: Response) => {
    const user: IUser | null = await User.findOne({ email: body.email });
    let isRevoked: boolean = false;
    if (user) {
      const revokeToken = new RevokeToken(user._id);
      isRevoked = await revokeToken.resetPasswordToken();
    }
    res.send({ isRevoked });
  }
);
