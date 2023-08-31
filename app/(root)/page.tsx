import { getThreads } from "@/lib/actions/thread.action";

export default async function Home() {
  const result = await getThreads(1, 30);
  console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Welcome to the home page!</h1>
    </>
  );
}
