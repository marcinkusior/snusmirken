// filepath: /Users/test/Documents/Projects/snufkin/src/components/Navigation.tsx
import Link from "next/link";
import React from "react";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navigation = () => {
  return (
    <>
      <nav className="fixed flex w-full flex-row items-center justify-center gap-4 rounded-lg bg-white/10 p-5">
        <ul
          className="flex w-full justify-center"
          style={{ display: "flex", listStyle: "none", gap: "20px" }}
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          <li>
            <Link href="/trips">Trips</Link>
          </li>
          {/* Add more links as needed */}
        </ul>

        <header className="absolute right-5 flex items-center justify-end gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </nav>
      <div className="h-[64px]"></div>
    </>
  );
};

export default Navigation;
