"use client"
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import CreateModal from "../CreateSpace/Modal";

const GetStarted = () => {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    if (session.data) {
      setOpen(true);
    } else {
      signIn();
    }
  };
  return (
    <div className="w-full max-w-sm space-y-2">
      <CreateModal open={open} setIsOpen={setOpen} />
      <Button
        onClick={handleClick}
        className="w-full bg-purple-600 text-white hover:bg-purple-700"
      >
        Get Started for Free
      </Button>
    </div>
  );
};

export default GetStarted;
