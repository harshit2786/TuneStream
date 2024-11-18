"use client";
import { SpaceDetail } from "@/lib/models/space";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, SkipForward, Plus } from "lucide-react";
import StreamsQueue, {
  CurrentStreamDetail,
} from "@/app/components/Streams/Streams";
import { Input } from "@/components/ui/input";
import { YT_REGEX } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Streams } from "@/lib/models/stream";

const SpacePage = () => {
  const { spacename } = useParams();
  const router = useRouter();
  const [spaceDetails, setSpaceDetails] = useState<SpaceDetail | null>(null);
  const [streams, setStreams] = useState<Streams[]>([]);
  const [currentStream, setCurrentStream] = useState<Streams | null>(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const session = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handlePlayNext = async () => {
    try {
      await fetch("/api/stream/playnext", {
        method: "POST",
        body: JSON.stringify({ spaceId: spaceDetails?.id }),
      });
      fetchStreams();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    const isValid = youtubeLink.match(YT_REGEX);
    if (!isValid) {
      toast("Incorrect link format", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      try {
        await fetch("/api/stream/addstream", {
          method: "POST",
          body: JSON.stringify({ spaceId: spaceDetails?.id, url: youtubeLink }),
        });
        setYoutubeLink("");
        fetchStreams();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const fetchSpace = async () => {
    try {
      const resp = await fetch("/api/space/getspace", {
        method: "POST",
        body: JSON.stringify({ spaceName: spacename }),
      });
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} ${resp.statusText}`);
      }
      const data = await resp.json();
      if (data.data === null) {
        router.push(`/spaces/${spacename}/invite`);
      } else {
        setSpaceDetails(data.data);
        setStreams(data.data.streams);
        setCurrentStream(
          data.data.streams.find((it: Streams) => it.active) ?? null
        );
      }
    } catch (e) {
      console.log(e);
      router.push("/spaces");
    }
  };

  const fetchStreams = async () => {
    try {
      const resp = await fetch("/api/space/getspace", {
        method: "POST",
        body: JSON.stringify({ spaceName: spacename }),
      });
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} ${resp?.statusText}`);
      }
      const data = await resp.json();
      setStreams(data.data.streams);
      setCurrentStream(
        data.data.streams.find((it: Streams) => it.active) ?? null
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (spacename) {
      fetchSpace();
    }
  }, [spacename]);
  useEffect(() => {
    console.log("sss", socket);
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.command === "fetch") {
        fetchStreams();
      }
    };
  }, [socket]);
  useEffect(() => {
    if (spaceDetails?.id) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS}/${spaceDetails.id}`
      );
      ws.onopen = () => {
        console.log("Connected");
        setSocket(ws);
      };
      ws.onclose = () => {
        console.log("Disconnected");
        setSocket(null);
      };
      return () => {
        ws.close();
      };
    }
  }, [spaceDetails]);

  if (!spaceDetails) return <></>;

  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-purple-400">
          {spaceDetails.name}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">
            Created by {spaceDetails.creator.username}
          </p>
          <div className="flex items-center text-gray-300">
            <Users className="h-5 w-5 mr-2" />
            <span>{spaceDetails?.users} participants</span>
          </div>
        </div>
      </div>

      {streams.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center shadow-lg ">
          <div className="mb-4 flex gap-2 w-[60%]">
            <Input
              type="text"
              placeholder="Paste YouTube link here"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="flex-grow bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
            />
            <Button
              onClick={handleSubmit}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <h2 className="text-2xl font-semibold mb-4  text-purple-400">
            No songs in the queue
          </h2>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              Now Playing
            </h2>
            <div className="aspect-video mb-4">
              {currentStream && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentStream.extractId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              {currentStream && (
                <CurrentStreamDetail id={currentStream.extractId} />
              )}
              {session.data?.user?.id === spaceDetails?.creator?.id && (
                <Button
                  onClick={handlePlayNext}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  {currentStream ? "Play Next" : "Play"}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              Queue
            </h2>
            <div className="mb-4 flex gap-2">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="flex-grow bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
              />
              <Button
                onClick={handleSubmit}
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              {streams
                .filter((it) => !it.active)
                .sort((a, b) => {
                  if (a.upvotes.length === b.upvotes.length) {
                    return Number(a.timeStamp) - Number(b.timeStamp);
                  }
                  return b.upvotes.length - a.upvotes.length;
                })
                .map((song, index) => (
                  <StreamsQueue
                    setStreams={setStreams}
                    stream={song}
                    key={index}
                  />
                ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  );
};

export default SpacePage;
