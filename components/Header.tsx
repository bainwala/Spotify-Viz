import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggler } from "./ThemeToggler";

function Header() {
  return (
    <header className="flex items-center justify-between p-2">
      <Link href="/" className="flex items-center space-x-2">
        <div className="pl-5 pu-5 flex">
          <Image
            src={
              "https://www.shareicon.net/download/128x128//2016/11/09/851218_browser_512x512.png"
            }
            alt="logo"
            width={50}
            height={50}
          />
        </div>
        <h1 className="font-bold text-xl">Spotify Viz.</h1>
      </Link>
      <div className="px-5 flex space-x-2 items-center">
        <ThemeToggler />
        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <SignInButton afterSignInUrl="/dashboard" mode="modal" />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
