import express, { Application, Response, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connection } from "./database/dbConnection";
import User, { IUser } from "./database/models/User";
import { auth } from "./middlewares/auth";

// app config
const app: Application = express();
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
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
    res.cookie("jid", user.createRefreshToken(), { httpOnly: true });
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
    res.cookie("jid", user.createRefreshToken(), { httpOnly: true });
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

const main = async (): Promise<void> => {
  await connection();
  console.log("mongodb connected");
  app.listen(4000, () =>
    console.log("server is listening on https://localhost:4000")
  );
};

main();
