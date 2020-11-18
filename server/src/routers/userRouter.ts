import { Response, Request, Router } from "express";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import User, { IUser } from "../database/models/User";
import { auth } from "../middlewares/auth";

export const router: Router = Router();

router.get("/user/me", auth, (req: any, res: Response) => {
  res.send(req.user);
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/users", async ({ body }: Request, res: Response) => {
  try {
    const user: IUser = new User(body);
    await user.save();
    sendRefreshToken(res, user.createRefreshToken());
    const accessToken = await user.createAccessToken();
    res.status(201).send({
      register: true,
      user,
      accessToken,
    });
  } catch (err) {
    res.status(500).send({ error: err.message, register: false });
  }
});

router.post("/user/me/logout", auth, async (req: any, res: Response) => {
  try {
    sendRefreshToken(res, "");
    req.user.accessTokens = req.user.accessTokens.filter(
      (token: any) => token.token !== req.accessToken
    );
    await req.user.save();
    res.send({
      message: "logged out",
      logout: true,
    });
  } catch (err) {
    res.status(500).send({ error: err.message, logout: false });
  }
});

router.post("/user/me/logout_all", auth, async (req: any, res: Response) => {
  try {
    sendRefreshToken(res, "");
    req.user.accessTokens = [];
    await req.user.save();
    res.send({
      message: "logged out from all devices",
      logout: true,
    });
  } catch (err) {
    res.status(500).send({ error: err.message, logout: false });
  }
});
