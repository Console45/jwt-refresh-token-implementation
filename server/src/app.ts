import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connection } from "./database/dbConnection";
import User, { IUser } from "./database/models/User";
// app config
const app: Application = express();
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(bodyParser.json());

app.post("/users", async ({ body }, res: any) => {
  try {
    const user: IUser = new User(body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err);
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
