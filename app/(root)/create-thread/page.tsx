import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/user.action";
import PostThread from "@/components/forms/PostThread";
async function Page() {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
