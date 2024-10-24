"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const NavItems = () => {
  const session = useSession();
  if (session.data?.user) {
    return (
      <div className="flex gap-4 items-center">
        <Link
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="#"
        >
          Create Space
        </Link>
        <Link
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="#"
        >
          Dashboard
        </Link>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default NavItems;
