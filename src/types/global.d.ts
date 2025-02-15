/* eslint-disable no-var */
import { Mongoose } from "mongoose";

declare global {
  const mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

export {};
