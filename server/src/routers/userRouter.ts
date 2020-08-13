import { Response, Request, Router } from "express";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import User, { IUser } from "../database/models/User";
import { auth } from "../middlewares/auth";

export const router: Router = Router();

router.get("/user/me", auth, (req: any, res: Response) => {
  res.send(req.user);
});

router.post("/users", async ({ body }: Request, res: Response) => {
  try {
    const user: IUser = new User(body);
    await user.save();
    sendRefreshToken(res, user.createRefreshToken());
    res.status(201).send({
      user,
      accessToken: user.createAccessToken(),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/users/login", async ({ body }: Request, res: Response) => {
  try {
    const user: IUser = await User.findByCredentials(body.email, body.password);
    sendRefreshToken(res, user.createRefreshToken());
    const accessToken = await user.createAccessToken();
    res.send({
      user,
      accessToken,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/user/me/logout", auth, async (req: any, res: Response) => {
  try {
    res.clearCookie("jid");
    req.user.accessTokens = req.user.accessTokens.filter(
      (token: any) => token.token !== req.accessToken
    );
    await req.user.save();
    res.send({
      message: "Logged out",
    });
  } catch (err) {
    res.status(500).send({ err });
  }
});

router.post("/user/me/logout_all", auth, async (req: any, res: Response) => {
  try {
    res.clearCookie("jid");
    req.user.accessTokens = [];
    await req.user.save();
    res.send({
      message: "logged out from all devices",
    });
  } catch (err) {
    res.status(500).send({ err });
  }
});
