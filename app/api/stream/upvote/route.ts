import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import WebSocketBroadcaster from "@/lib/broadcasting";

const AddUpvoteSchema = z.object({
    streamId: z.string()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = AddUpvoteSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorised User" }, { status: 403 });
        }
        const resp = await prismaClient.stream.findFirst({
            where: {
                id: data.streamId,
            }
        });
        if (!resp) {
            return NextResponse.json({ message: "Stream not found" }, { status: 411 });
        }
        const spaceId = resp.spaceId;
        const resp1 = await prismaClient.space.findFirst({
            where: {
                id: spaceId,
                creatorId: userId
            }
        });
        const resp2 = await prismaClient.space.findFirst({
            where: {
                id: spaceId,
                userIds: {
                    some: {
                        id: userId
                    }
                }
            }
        });
        if (resp1 || resp2) {
            try {
                await prismaClient.upvotes.create({
                    data: {
                        streamId: data.streamId,
                        userId: userId
                    }
                });

                const broadcaster = WebSocketBroadcaster.getInstance(process.env.NEXT_WEBSOCKET_ENDPOINT ?? "", resp1 ? resp1.id : resp2 ? resp2.id : "");
                broadcaster.broadcast();
                return NextResponse.json({ message: "Success" }, { status: 200 });
            }
            catch (e) {
                console.log(e);
                return NextResponse.json({ message: "Incorrect Format" }, { status: 422 });
            }

        }
        else {
            return NextResponse.json({ message: "Stream not found" }, { status: 404 });
        }
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 });
    }
}