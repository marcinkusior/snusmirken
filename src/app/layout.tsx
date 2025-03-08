import "~/styles/globals.css";
import { Poppins, Cherry_Bomb_One } from "next/font/google";
import { type Metadata, Viewport } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cherryBombOne = Cherry_Bomb_One({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-cherry-bomb-one",
});

export const metadata: Metadata = {
  title: "Bobobo",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: 1200,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${cherryBombOne.className}`}>
        <body className="min-h-screen text-gray-700">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
