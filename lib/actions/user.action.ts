"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { ConnectDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: Params): Promise<void> {
  ConnectDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (err: any) {
    throw new Error(`Error create/update user: ${err.message}`);
  }
}

export async function getUser(userId: string) {
  ConnectDB();
  try {
    return await User.findOne({ id: userId });
    //.populate({
    //   path: "communities",
    //   model: "Community",
    // })
  } catch (err: any) {
    throw new Error(`Error getting user: ${err.message}`);
  }
}
