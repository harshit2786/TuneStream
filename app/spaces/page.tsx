"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Users, Clock, Search } from "lucide-react";
import Link from "next/link";

// Mock data for spaces
const mockSpaces = [
  {
    id: 1,
    name: "Summer Beach Party",
    creator: "DJ Sandy",
    participants: 45,
    songCount: 78,
    duration: "3h 45m",
  },
  {
    id: 2,
    name: "80s Retro Night",
    creator: "VintageVibes",
    participants: 30,
    songCount: 56,
    duration: "2h 30m",
  },
  {
    id: 3,
    name: "Chill Lounge Vibes",
    creator: "MellowMaster",
    participants: 25,
    songCount: 40,
    duration: "1h 50m",
  },
  {
    id: 4,
    name: "Rock Anthems",
    creator: "GuitarHero",
    participants: 50,
    songCount: 90,
    duration: "4h 15m",
  },
  {
    id: 5,
    name: "EDM Extravaganza",
    creator: "BeatDropper",
    participants: 100,
    songCount: 150,
    duration: "6h 00m",
  },
];

export default function AllSpaces() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpaces = mockSpaces.filter(
    (space) =>
      space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      space.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-400">
          All Music Spaces
        </h1>
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search spaces..."
              className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-purple-500/10 transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-purple-400">
                {space.name}
              </h2>
              <p className="text-gray-400 mb-4">Created by {space.creator}</p>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-300">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{space.participants}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Music className="h-4 w-4 mr-1" />
                  <span>{space.songCount} songs</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{space.duration}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Join Space
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
