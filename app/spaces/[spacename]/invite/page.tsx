"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import useFetchSpaces from "@/app/hooks/space";
import { useSession } from "next-auth/react";
const Invite = () => {
  const router = useRouter();
  const { spacename } = useParams();
  const spaceData = useFetchSpaces()?.find((it) => it?.name === spacename);
  const session = useSession();
  const handleJoin = async () => {
    if (!spaceData) {
      return;
    }
    try {
      const resp = await fetch("/api/space/adduser", {
        method: "POST",
        body: JSON.stringify({ spaceId: spaceData.id }),
      });
    } catch (error) {
      console.log(error);
    }
  };
  if (session)
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
            Request to Join Space
          </h1>
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              {spaceData?.name}
            </h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">Created by {spaceData?.creator}</p>
              <div className="flex items-center text-gray-300">
                <Users className="h-5 w-5 mr-2" />
                <span>{spaceData?.users} participants</span>
              </div>
            </div>
            {spaceData?.type === "Private" ? (
              <div className="flex items-center text-yellow-500 mb-4">
                <Lock className="h-5 w-5 mr-2" />
                <span>
                  This is a private space. You need an invitation to join.
                </span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-500 mb-4">
                <Lock className="h-5 w-5 mr-2" />
                <span>
                  This is a public space. Click button below to join the space.
                </span>
              </div>
            )}
          </div>
          <form className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
              >
                {spaceData?.type === "Private"
                  ? "Send Join Request"
                  : spaceData?.type === "Public"
                  ? "Join Now"
                  : ""}
              </Button>
            </div>
          </form>
        </div>
      </main>
    );
};

export default Invite;
