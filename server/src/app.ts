import { revokeRefreshTokens } from "./utils/revokeRefreshTokens";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import { verify } from "jsonwebtoken";
import express, { Application, Response, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/dbConnection";
import User, { IUser } from "./database/models/User";
import { auth } from "./middlewares/auth";

// app config
const app: Application = express();
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    content: "hello, this is my jwt authentication with refresh tokens example",
  });
});

app.get("/bye", auth, (req: Request, res: Response) => {
  res.send({
    content: "bye, hope you liked it. See you soon",
  });
});

app.get("/user/me", auth, (req: any, res: Response) => {
  res.send(req.user);
});

app.post("/users", async ({ body }: Request, res: Response) => {
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

app.post("/users/login", async ({ body }: Request, res: Response) => {
  try {
    const user: IUser = await User.findByCredentials(body.email, body.password);
    sendRefreshToken(res, user.createRefreshToken());
    const accessToken = await user.createAccessToken();
    res.send({
      user,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

app.post("/refresh_token", async (req: Request, res: Response) => {
  const token: string = req.cookies.jid;
  if (!token) return res.send({ ok: false, accessToken: "" });
  let payload: any = null;
  try {
    payload = verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.error(err);
    return res.send({ ok: false, accessToken: "" });
  }
  const user: IUser | null = await User.findOne({ _id: payload.userId });
  if (!user) return res.send({ ok: false, accessToken: "" });

  if (user.tokenVersion !== payload.tokenVersion)
    return res.send({ ok: false, accessToken: "" });

  sendRefreshToken(res, user.createRefreshToken());
  const accessToken = await user.createAccessToken();
  return res.send({ ok: true, accessToken });
});

app.post("/revoke_user", async ({ body }: Request, res: Response) => {
  const user: IUser | null = await User.findOne({ email: body.email });
  let isRevoked: boolean = false;
  if (user) {
    isRevoked = await revokeRefreshTokens(user.id);
  }
  res.send({ isRevoked });
});

const main = async (): Promise<void> => {
  await connection();
  console.log("mongodb connected");
  app.listen(4000, () =>
    console.log("server is listening on https://localhost:4000")
  );
};

main();
