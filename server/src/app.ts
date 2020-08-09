import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

// app config
const app: Application = express();
app.use(cors({ origin: "https://localhost:3000" }));
app.use(bodyParser.json());

const main = async (): Promise<void> => {
  app.listen(4000, () =>
    console.log("server is listening on https://localhost:4000")
  );
};

main();
