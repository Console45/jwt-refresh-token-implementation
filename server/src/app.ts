import express, { Application, Response, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { connection } from "./database/dbConnection";
import { router as userRouter } from "./routers/userRouter";
import { sendRefreshToken } from "./utils/sendRefreshToken";
import User, { IUser } from "./database/models/User";
import { revokeRefreshTokens } from "./utils/revokeRefreshTokens";

// app config
const app: Application = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    content: "hello, this is my jwt authentication with refresh tokens example",
  });
});

app.use(userRouter);

app.post("/refresh_token", async (req: any, res: Response) => {
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

  if (user.tokenVersion !== payload.tokenVersion)
    return res.status(403).send({ ok: false, accessToken: "" });

  sendRefreshToken(res, user.createRefreshToken());
  const accessToken = await user.createAccessToken();
  req.accessToken = accessToken;
  return res.send({ ok: true, accessToken });
});

app.post("/revoke_user", async ({ body }: Request, res: Response) => {
  const user: IUser | null = await User.findOne({ email: body.email });
  let isRevoked: boolean = false;
  if (user) {
    isRevoked = await revokeRefreshTokens(user._id);
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
