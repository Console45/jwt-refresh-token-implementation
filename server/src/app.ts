import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connection } from "./database/dbConnection";
// app config
const app: Application = express();
app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(bodyParser.json());

const main = async (): Promise<void> => {
  await connection();
  console.log("mongodb connected");
  app.listen(4000, () =>
    console.log("server is listening on https://localhost:4000")
  );
};

main();
