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

export async function getThreads(pageNumber = 1, pageSize = 20) {
  try {
    ConnectDB();
    const skipAmount = pageSize * (pageNumber - 1);
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postsQuery.exec();
    const isNext = totalPostCount > skipAmount + posts.length;
    return { posts, isNext };
  } catch (err: any) {
    throw new Error(`Error getting threads: ${err.message}`);
  }
}

export async function getThreadById(id: string) {
  ConnectDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId  image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (err: any) {
    throw new Error(`Error getting thread by id: ${err.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  ConnectDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error adding comment to thread: ${err.message}`);
  }
}
