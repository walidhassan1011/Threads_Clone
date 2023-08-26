import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
