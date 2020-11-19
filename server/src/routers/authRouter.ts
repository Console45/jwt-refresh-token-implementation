import { Response, Request, Router } from "express";
import { verify } from "jsonwebtoken";
import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import User, { IUser } from "../database/models/User";
import { RevokeToken } from "../utils/revokeToken";
import { sendRefreshToken } from "../utils/sendRefreshToken";
// import { sendResetPasswordEmail } from "../emails/account";

export const router: Router = Router();
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  forceRefreshOnFailure: true,
});
router.post("/google_login", async ({ body }: Request, res: Response) => {
  try {
    const idToken: string = body.idToken;
    const loginTicket: LoginTicket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const tokenPayload: TokenPayload | undefined = loginTicket.getPayload();
    if (!tokenPayload) throw new Error();
    if (!tokenPayload.email_verified) throw new Error();
    const user: IUser | null = await User.findOne({
      email: tokenPayload.email,
    });
    if (!user) {
      const genPassword: string = tokenPayload.sub;
      const newUser: IUser = new User({
        email: tokenPayload.email,
        password: genPassword,
        name: tokenPayload.name,
      });
      await newUser.save();
      sendRefreshToken(res, newUser.createRefreshToken());
      const accessToken = await newUser.createAccessToken();
      return res.status(201).send({
        login: true,
        user,
        accessToken,
      });
    }
    sendRefreshToken(res, user.createRefreshToken());
    const accessToken = await user.createAccessToken();
    return res.send({
      login: true,
      user,
      accessToken,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: "Google Login failed" });
  }
});

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
  const accessToken: string = await user.createAccessToken();
  req.accessToken = accessToken;
  return res.send({ ok: true, accessToken });
});

router.post("/forgot_password", async ({ body }: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ email: body.email });
    if (!user) return res.status(404).send({ error: "account does not exist" });
    const revoke = new RevokeToken(user._id);
    const isRevoked: boolean = await revoke.refreshToken();
    if (!isRevoked) return res.status(500).send({ revoked: false });
    const token: string = user.createResetPasswordToken();
    // await sendResetPasswordEmail(user.email, user.fullname, token);
    res.send({ revoked: true, success: true, token });
  } catch (err) {
    res.status(500).send({ error: err.message, success: false });
  }
});

router.post(
  "/reset-password",
  async ({ body, query }: Request, res: Response) => {
    const token: string = query.token as string;
    if (!token)
      return res.status(409).send({ success: false, error: "Invalid token" });
    try {
      const payload: any = verify(
        token,
        process.env.RESET_PASSWORD_TOKEN_SECRET!
      );
      const user: IUser | null = await User.findById(payload.userId);
      if (!user)
        return res
          .status(404)
          .send({ success: false, error: "Account does not exist" });
      if (user.resetPasswordTokenVersion !== payload.tokenVersion)
        return res
          .status(409)
          .send({ success: false, error: "Token has expired" });
      user.password = body.password;
      await user.save();
      const revoke = new RevokeToken(user._id);
      const isRevoked: boolean = await revoke.resetPasswordToken();
      if (!isRevoked) return res.status(500).send({ revoked: false });
      res.send({ success: true, user });
    } catch (err) {
      if (err.message === "jwt expired")
        return res
          .status(409)
          .send({ success: false, error: "Token has expired" });

      res.status(500).send({ success: false, error: err.message });
    }
  }
);
