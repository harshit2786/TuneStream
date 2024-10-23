"use client";
import React from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import Image from "next/image";

import { useSession, signIn, signOut } from "next-auth/react"
import LinkButton from "../Buttons/LinkButton";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex bg-[#FFF478] h-[80px] items-center justify-between border-b border-divider px-8">
      <div>
        <Image
          className=" rounded-lg"
          src={`/assets/logo.png`}
          alt={"logo"}
          width="150"
          height={80}
        />
      </div>
      <div className="flex items-center gap-4">
        {!session ? <PrimaryButton text="Sign In" disabled={false} handler={() => signIn()} ></PrimaryButton> : <LinkButton text="Sign Out" handler={() => signOut()} disabled={false}  ></LinkButton>}
      </div>
    </div>
  );
};

export default Navbar;
