import mongoose from "mongoose";

let isconnected = false;

export const ConnectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("No MongoDB URL provided");

  if (isconnected) return console.log("Already connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Threads",
    });

    isconnected = true;

    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB");
    console.log(err);
  }
};
