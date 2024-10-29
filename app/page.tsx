import { Button } from "@/components/ui/button";
import { Music, Users, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-400">
                  Collaborative Music Queuing for Your Party
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Create music spaces, add songs, vote, and let the crowd decide
                  the playlist. Perfect for parties, events, and gatherings.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950">
                <Users className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">
                  Create Spaces
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Set up unique music spaces for your events with custom
                  settings.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950">
                <Music className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">Add Songs</h3>
                <p className="text-sm text-gray-400 text-center">
                  Participants can easily add songs to the queue from various
                  music services.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-800 p-6 rounded-lg bg-gray-950">
                <ThumbsUp className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">
                  Vote on Songs
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  Upvote or downvote songs to influence the playlist order.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">
              How It Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-4 bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-purple-400">
                  For Creators
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Sign up and create a new music space</li>
                  <li>Set up preferences and restrictions</li>
                  <li>Share the space code with participants</li>
                  <li>Play songs based on the crowd-sourced queue</li>
                </ol>
              </div>
              <div className="space-y-4 bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-purple-400">
                  For Participants
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Join a space using the provided code</li>
                  <li>Browse or search for songs to add</li>
                  <li>Add songs to the queue</li>
                  <li>Vote on songs to influence the playlist</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-400">
                  Ready to Revolutionize Your Party Music?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join TuneStream today and start creating collaborative music
                  experiences for your events.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  Get Started for Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2023 TuneStream. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:text-purple-400 transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:text-purple-400 transition-colors"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
