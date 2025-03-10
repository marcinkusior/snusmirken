import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  const onClick = () => {
    navigate;
  };

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-gray-700">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Link href="/trips">
            <div className="rounded-full bg-customSalmon p-[10px]">
              <h1 className="big-font max-w-[500px] text-center text-2xl text-pink-500">
                Kitten's big trip to Japan ♥♥♥
                <br />
                じんけん の むし および けいぶ が、
              </h1>
            </div>
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
