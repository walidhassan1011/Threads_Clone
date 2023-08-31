"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { ConnectDB } from "../mongoose";

interface params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: params) {
  try {
    ConnectDB();
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error creating thread: ${err.message}`);
  }
}

export async function getThreads(pageNumber = 1, pageSize = 10) {
  try {
    ConnectDB();
    const threads = await Thread.find({
      parentId: { $in: [null, undefined] },
    }).sort({ createdAt: "desc" });
  } catch (err: any) {
    throw new Error(`Error getting threads: ${err.message}`);
  }
}
