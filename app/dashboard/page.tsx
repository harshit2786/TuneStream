"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { Space } from "@/lib/models/space";
import useFetchSpaces from "../hooks/space";
import { useRouter } from "next/navigation";
import CreateModal from "../components/CreateSpace/Modal";
import { ParsedPendingUser, PendingUser } from "@/lib/models/pendingUsers";
import toast, { Toaster } from "react-hot-toast";

const DashBoard = () => {
  const { data: session, status } = useSession();
  const spaces = useFetchSpaces();
  const [createdSpaces, setCreatedSpaces] = useState<Space[]>([]);
  const [memberSpaces, setMemberSpaces] = useState<Space[]>([]);
  const [joinRequests, setJoinRequests] = useState<PendingUser[]>([]);
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const pendingRequests: ParsedPendingUser[] = useMemo(() => {
    const pen: ParsedPendingUser[] = [];
    for (let i = 0; i < joinRequests.length; i++) {
      for (let j = 0; j < joinRequests[i].pendingUsers.length; j++) {
        const pendingReq: ParsedPendingUser = {
          spaceId: joinRequests[i].id,
          spaceName: joinRequests[i].name,
          userId: joinRequests[i].pendingUsers[j].id,
          userName: joinRequests[i].pendingUsers[j].username,
          userEmail: joinRequests[i].pendingUsers[j].email,
        };
        pen.push(pendingReq);
      }
    }
    return pen;
  }, [joinRequests]);
  const acceptReq = async (
    spaceId: string,
    userId: string,
    spaceName: string
  ) => {
    try {
      await fetch("/api/space/acceptuser", {
        method: "POST",
        body: JSON.stringify({ userId, spaceId }),
      });
      toast(`User Added to ${spaceName} `, {
        duration: 2000,
        position: "top-center",
      });
      await fetchMy();
    } catch (e) {
      console.log(e);
    }
  };
  const rejectReq = async (spaceId: string, userId: string) => {
    try {
      await fetch("/api/space/rejectuser", {
        method: "POST",
        body: JSON.stringify({ userId, spaceId }),
      });
      toast("Request rejected", {
        duration: 2000,
        position: "top-center",
      });
      await fetchMy();
    } catch (e) {
      console.log(e);
    }
  };
  const fetchMy = async () => {
    try {
      const resp = await fetch("/api/my", { method: "GET" });
      const data = await resp.json();
      setJoinRequests(data.data.createdSpace);
      setCreatedSpaces(
        spaces?.filter((it) =>
          data.data.createdSpace.some((a: { id: string }) => a.id === it.id)
        )
      );
      setMemberSpaces(
        spaces?.filter((it) =>
          data.data.memberSpace.some((a: { id: string }) => a.id === it.id)
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) signIn(); // Redirect to sign in
    if (session && spaces) {
      fetchMy();
    }
  }, [session, status, spaces]);
  if (session) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Toaster />
        <CreateModal open={open} setIsOpen={setIsOpen} />
        <h1 className="text-3xl font-bold mb-8 text-purple-400">
          Your Dashboard
        </h1>

        <Tabs defaultValue="created" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="created">Created Spaces</TabsTrigger>
            <TabsTrigger value="member">Member Spaces</TabsTrigger>
            <TabsTrigger value="requests">Join Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="created">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {createdSpaces.map((space) => (
                <div
                  key={space.id}
                  className="bg-gray-900 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <Image
                      src={""}
                      alt={space.name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-400">
                        {space.name}
                      </h3>
                      <p className="text-gray-400">
                        {space.users} participants
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/spaces/${space.name}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Manage Space
                  </Button>
                </div>
              ))}
              <div className="bg-gray-900 rounded-lg p-6 shadow-lg flex items-center justify-center">
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  <Plus className="h-6 w-6 mr-2" />
                  Create New Space
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="member">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {memberSpaces.map((space) => (
                <div
                  key={space.id}
                  className="bg-gray-900 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <Image
                      src={""}
                      alt={space.name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-purple-400">
                        {space.name}
                      </h3>
                      <p className="text-gray-400">
                        Created by {space.creator}
                      </p>
                      <p className="text-gray-400">
                        {space.users} participants
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/spaces/${space.name}`)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Enter Space
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="requests">
            <ScrollArea className="h-[400px] w-full rounded-md border border-gray-800 p-4">
              {pendingRequests.map((request) => (
                <div
                  key={`${request.spaceId}-${request.userId}`}
                  className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-purple-400">
                      {request.userName}
                    </p>
                    <p className="text-sm text-gray-400">
                      wants to join {request.spaceName}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        acceptReq(
                          request.spaceId,
                          request.userId,
                          request.spaceName
                        )
                      }
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => rejectReq(request.spaceId, request.userId)}
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    );
  }
  return null;
};

export default DashBoard;
