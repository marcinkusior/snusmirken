// filepath: /Users/test/Documents/Projects/snufkin/src/components/Navigation.tsx
import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <nav className="flex w-full justify-center p-5 text-white">
      <ul style={{ display: "flex", listStyle: "none", gap: "20px" }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/posts">Posts</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navigation;
