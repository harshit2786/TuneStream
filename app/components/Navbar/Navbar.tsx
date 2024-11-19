import React from "react";
import LoginButton from "../Buttons/LoginButton";
import NavItems from "../Buttons/NavItem";
import { Music } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
      <Link className="flex items-center justify-center" href="/">
        <Music className="h-6 w-6 mr-2 text-purple-400" />
        <span className="font-bold text-purple-400">TuneStream</span>
      </Link>
      <div className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm flex items-center font-medium hover:text-purple-400 transition-colors"
          href="/spaces"
        >
          Spaces
        </Link>
        <NavItems />
        <LoginButton />
      </div>
    </header>
  );
};

export default Navbar;
