"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { ConnectDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function getUserPost(userId: string) {
  ConnectDB();
  try {
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (err: any) {
    throw new Error(`Error getting user: ${err.message}`);
  }
}

export async function getUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    ConnectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        { name: { $regex: regex } },
        { username: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const countQuery = await User.countDocuments(query);

    const users = await userQuery.exec();
    const isNext = countQuery > skipAmount + users.length;
    return { users, isNext };
  } catch (err: any) {
    throw new Error(`Error getting users: ${err.message}`);
  }
}

export async function getActivity(userId: string) {
  ConnectDB();
  try {
    const userThreads = await Thread.find({ author: userId });
    const chilThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);
    const replies = await Thread.find({
      _id: { $in: chilThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (err: any) {
    throw new Error(`Error getting user: ${err.message}`);
  }
}
