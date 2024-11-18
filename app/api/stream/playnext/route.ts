import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import WebSocketBroadcaster from "@/lib/broadcasting";

const PlayNextSchema = z.object({
    spaceId: z.string()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = PlayNextSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorised User" }, { status: 403 });
        }
        const resp = await prismaClient.space.findFirst({
            where: {
                id: data.spaceId,
                creatorId: userId
            },
            select: {
                streams: {
                    select: {
                        id: true,
                        active: true,
                        timeStamp: true,
                        _count: {
                            select: {
                                upvotes: true
                            }
                        }
                    }
                }
            }
        });
        if (!resp) {
            return NextResponse.json({ message: "Unauthorised User" }, { status: 403 });
        }
        if (resp.streams.length === 0 || resp.streams.filter((it) => !it.active).length === 0) {
            return NextResponse.json({ message: "No available streams" }, { status: 404 });
        }
        else {
            let streams = resp.streams;
            const activeStream = streams.find((it) => it.active);
            if (activeStream) {
                await prismaClient.stream.delete({
                    where: {
                        id: activeStream.id
                    }
                });
                streams = resp.streams.filter((it) => !it.active)
            }
            const highestUpvotes = streams.sort((a, b) => b._count.upvotes - a._count.upvotes)[0]._count.upvotes;
            const topStreams = streams.filter((it) => it._count.upvotes === highestUpvotes);
            const newActive = topStreams.sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp))[0];
            try {
                await prismaClient.stream.update({
                    where: {
                        id: newActive.id
                    },
                    data: {
                        active: true
                    }
                });
                const broadcaster = WebSocketBroadcaster.getInstance(process.env.NEXT_WEBSOCKET_ENDPOINT ?? "", data.spaceId ?? "");
                broadcaster.broadcast();
                return NextResponse.json({ data: "Success" }, { status: 200 })
            }
            catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Something went wrong" }, { status: 404 })
            }
        }
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}