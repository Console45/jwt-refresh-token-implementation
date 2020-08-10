import { connect } from "mongoose";

const uri: string = process.env.MONGODB_URI as string;

type Connection = () => Promise<void>;

export const connection: Connection = async () => {
  await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
