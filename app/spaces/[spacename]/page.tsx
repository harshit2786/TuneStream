"use client";
import { SpaceDetail } from "@/lib/models/space";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, SkipForward, Plus } from "lucide-react";
import StreamsQueue, { CurrentStreamDetail } from "@/app/components/Streams/Streams";
import { Input } from "@/components/ui/input";

const SpacePage = () => {
  const { spacename } = useParams();
  const router = useRouter();
  const [spaceDetails, setSpaceDetails] = useState<SpaceDetail>();
  const [extractedId, setExtractedId] = useState<string | null>("");
  const [youtubeLink, setYoutubeLink] = useState('')
  useEffect(() => {
    if (spaceDetails) {
      setExtractedId(
        spaceDetails?.streams?.find((it) => it.active)?.extractId ?? null
      );
    }
  }, [spaceDetails]);
  useEffect(() => {
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
        }
      } catch (e) {
        console.log(e);
        router.push("/spaces");
      }
    };
    fetchSpace();
  }, [spacename, router]);
  if (spaceDetails)
    return (
      <main className="container mx-auto px-4 py-8">
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

        {spaceDetails?.streams.length === 0 ?  <div className="bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center shadow-lg ">
            <form className="mb-4 flex gap-2 w-[60%]">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="flex-grow bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>
            <h2 className="text-2xl font-semibold mb-4  text-purple-400">
              No songs in the queue
            </h2>
        </div> :<div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              Now Playing
            </h2>
            <div className="aspect-video mb-4">
              {extractedId && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractedId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              {extractedId && <CurrentStreamDetail id={extractedId} />}
              <Button
                // onClick={handleSkip}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              Queue
            </h2>
            <form className="mb-4 flex gap-2">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="flex-grow bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </form>
            <ScrollArea className="h-[400px] pr-4">

              {spaceDetails.streams.filter((it) => !it.active).map((song, index) => (
                <StreamsQueue stream={song} key={index} />
              ))}
            </ScrollArea>
          </div>
        </div>}
      </main>
    );
};

export default SpacePage;
