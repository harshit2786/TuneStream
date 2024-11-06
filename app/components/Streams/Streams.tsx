"use client";
import { Streams, YtDetails } from "@/lib/models/stream";
import { parseYtData } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {  ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export const CurrentStreamDetail = ({ id }: { id: string }) => {
  const [details, setDetails] = useState<YtDetails | null>(null);
  const fetchYtDetails = async (id: string) => {
    try {
      const resp = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`,
        { method: "GET" }
      );
      const data = await resp.json();
      if (data.data) {
        setDetails(parseYtData(data.data));
      }
      const dummy: YtDetails = { title: "", thumbnail: "" };
      setDetails(dummy);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (id) {
      fetchYtDetails(id);
    }
  }, [id]);
  if (details) {
    <div>
      <h3 className="text-xl font-medium">{details.title}</h3>
    </div>;
  }
  else{
    return <></>
  }
};

const StreamsQueue = ({ stream,setStreams }: { stream: Streams , setStreams : React.Dispatch<React.SetStateAction<Streams[]>>}) => {
  const [details, setDetails] = useState<YtDetails | null>(null);
  const session = useSession();
  const handleUpvote = async() => {
    if(!session.data?.user.id){
      return
    }
    try{
      await fetch("/api/stream/upvote",{method:"POST" , body : JSON.stringify({streamId : stream.id})});
      setStreams((prevStreams) =>
        prevStreams.map((str) =>
          stream.id === str.id
            ? { ...str, upvotes: [...str.upvotes, session.data.user.id] }
            : str
        )
      );
    }
    catch(e){
      console.log(e)
    }
  }
  const handleDownvote = async() => {
    if(!session.data?.user.id){
      return
    }
    try{
      await fetch("/api/stream/downvote",{method:"POST" , body : JSON.stringify({streamId : stream.id})});
      setStreams((prevStreams) =>
        prevStreams.map((str) =>
          stream.id === str.id
            ? { ...str, upvotes: str.upvotes.filter((it) => it !== session.data.user.id) }
            : str
        )
      );
    }
    catch(e){
      console.log(e)
    }
  }
  const fetchYtDetails = async (id: string) => {
    try {
      const resp = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        { method: "GET" }
      );
      const data = await resp.json();
      if (data) {
        setDetails(parseYtData(data));
        return;
      }
      console.log("detail",data)
      const dummy: YtDetails = { title: "", thumbnail: "" };
      console.log("dumm")
      setDetails(dummy);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (stream?.extractId) {
      fetchYtDetails(stream.extractId);
    }
  }, [stream]);
  if (details && session.data)
    return (
      <div className="flex items-center justify-between mb-4 last:mb-0">
        <div className="flex items-center">
          <Image
            src={details.thumbnail}
            alt={`${details.title} thumbnail`}
            width={160}
            height={120}
            className="rounded-md mr-4"
          />
          <div>
            <h3 className="font-medium">{details.title}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={stream.upvotes.some((it) => it === session.data.user.id ) ?  handleDownvote : handleUpvote}
            variant="outline"
            size="sm"
            className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
          >
            {stream.upvotes.some((it) => it === session.data.user.id ) ?  <ThumbsDown className="h-4 w-4 mr-1" /> : <ThumbsUp className="h-4 w-4 mr-1" />}
            {stream.upvotes.length}
          </Button>
          
        </div>
      </div>
    );
};

export default StreamsQueue;
