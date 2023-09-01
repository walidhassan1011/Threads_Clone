import ThreadCard from "@/components/cards/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { getThreadById } from "@/lib/actions/thread.action";
import Comment from "@/components/forms/Comment";
const page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const thread = await getThreadById(params.id);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          commnunity={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div
        className="
            mt-7 
        "
      >
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            currentUserId={user?.id || ""}
            parentId={comment.parentId}
            content={comment.text}
            author={comment.author}
            commnunity={comment.community}
            createdAt={comment.createdAt}
            comments={comment.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
