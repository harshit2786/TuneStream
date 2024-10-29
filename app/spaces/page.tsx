"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Users, Search } from "lucide-react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { spaceStateAtom, spaceStateSelector } from "../recoil/state";


export default function AllSpaces() {
  const [searchTerm, setSearchTerm] = useState("");
  const [spaces,setSpaceState] = useRecoilState(spaceStateAtom);
  const spaceStateLoadable = useRecoilValueLoadable(spaceStateSelector);
  const filteredSpaces = useMemo(() => {
    return spaces.filter(
      (space) =>
        space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.creator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, spaces]);
  useEffect(() => {
    if (spaceStateLoadable.state === 'hasValue') {
      setSpaceState(spaceStateLoadable.contents);
    }
  }, [spaceStateLoadable, setSpaceState]);

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
                  <span>{space.users}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Music className="h-4 w-4 mr-1" />
                  <span>{space.streams} songs</span>
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
