"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const LoginButton = () => {
  const session = useSession();
  if (session?.data?.user) {
    return (
      <Button
        className="bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    );
  } else {
    return (
      <Button
        className="bg-purple-600 text-white hover:bg-purple-700"
        onClick={() => signIn()}
      >
        Login
      </Button>
    );
  }
};

export default LoginButton;
