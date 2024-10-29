import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music } from "lucide-react";
import { SpaceType } from "@/lib/models/space";
import { useRecoilState } from "recoil";
import { spaceStateAtom } from "@/app/recoil/state";
const CreateModal = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (e: boolean) => void;
}) => {
  const [spaceName, setSpaceName] = useState("");
  const [spaceType, setSpaceType] = useState<SpaceType>("Public");
  const [spaceState, setSpaceState] = useRecoilState(spaceStateAtom);
  const handleSubmit = async () => {
    if (spaceName === "" || spaceState.find((it) => it.name === spaceName )) {
      return;
    }
    try {
      const formData = {
        name: spaceName,
        public: spaceType === "Public" ? true : false,
      };
      const resp = await fetch("/api/space/create", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!resp.ok) {
        throw new Error(`Error: ${resp.status} ${resp.statusText}`);
      }
      const data = await resp.json();
      console.log(data);
      setSpaceState((prevSpaces) => [...prevSpaces, data.data]);
      setIsOpen(false)
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-400 flex items-center gap-2">
            <Music className="h-6 w-6" />
            Create New Space
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up a new music space for your event. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter space name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <RadioGroup
              value={spaceType}
              onValueChange={(e) =>
                setSpaceType(e === "Private" ? "Private" : "Public")
              }
              className="col-span-3 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Public"
                  id="Public"
                  className="border-gray-600 text-purple-400 focus:ring-purple-500"
                />
                <Label htmlFor="public" className="text-gray-300">
                  Public
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Private"
                  id="Private"
                  className="border-gray-600 text-purple-400 focus:ring-purple-500"
                />
                <Label htmlFor="private" className="text-gray-300">
                  Private
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Create Space
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
