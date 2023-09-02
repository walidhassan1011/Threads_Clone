import { getUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";

const page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await getUser(user.id);

  if (!userInfo.onboarded) redirect("/onboarding");
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
    </section>
  );
};

export default page;
