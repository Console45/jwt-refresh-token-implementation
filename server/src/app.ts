import express, { Application, Response, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/dbConnection";
import { router as userRouter } from "./routers/userRouter";
import { router as authRouter } from "./routers/authRouter";
import User, { IUser } from "./database/models/User";

// app config
const app: Application = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// routers
app.get("/", (req: Request, res: Response) => {
  res.send({
    content: "hello, this is my jwt authentication with refresh tokens example",
  });
});
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.use(userRouter);
app.use(authRouter);

const main = async (): Promise<void> => {
  await connection();
  console.log("mongodb connected");
  app.listen(process.env.PORT, () => console.log("server is listening"));
};

main();
