"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import CreateModal from "../CreateSpace/Modal";

const NavItems = () => {
  const session = useSession();
  const [open,setOpen] = useState(false);
  if (session.data?.user) {
    return (
      <div className="flex gap-4 items-center">
        <CreateModal open={open} setIsOpen={setOpen} />
        <Link
          onClick={() => setOpen(true)}
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="#"
        >
          Create Space
        </Link>
        <Link
          className="text-sm font-medium hover:text-purple-400 transition-colors"
          href="/dashboard"
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
