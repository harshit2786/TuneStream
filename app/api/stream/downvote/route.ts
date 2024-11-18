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
        const resp = await prismaClient.upvotes.findFirst({
            where : {
                streamId : data.streamId,
                userId : userId
            },
        });
        if(!resp){
            return NextResponse.json({ message: "Upvote not found" }, { status: 404 });
        }
        const space = await prismaClient.stream.findFirst({
            where : {
                id : data.streamId
            },
            include : {
                space : true
            }
        })
        await prismaClient.upvotes.delete({
            where : {
                id : resp.id
            }
        });
        const broadcaster = WebSocketBroadcaster.getInstance(process.env.NEXT_WEBSOCKET_ENDPOINT ?? "" , space?.id ?? "");
        broadcaster.broadcast();
        
        return NextResponse.json({ message: "Successfully downvoted" }, { status: 200});
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 });
    }
}