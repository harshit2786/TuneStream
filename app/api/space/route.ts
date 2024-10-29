import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";

export const GET = async () => {
    try {
        const resp = await prismaClient.space.findMany({
            select : {
                id :true,
                name : true,
                type : true,
                timeStamp : true,
                creator : {
                    select : {
                        username : true
                    }
                },
                _count : {
                    select : {
                        streams : true,
                        userIds : true
                    }
                }
            }
        });
        const refactored = resp.map((item) => ({
            id: item.id,
            creator: item.creator.username, // Map `username` to `creator`
            name: item.name,
            type: item.type, // Assuming `SpaceType` is already defined as your enum
            timestamp: item.timeStamp, // Convert `bigint` to `number`
            streams: item._count.streams, // Map `_count.streams` to `streams`
            users: item._count.userIds, // Map `_count.userIds` to `users`
        }));
        console.log("valll")
        return NextResponse.json({ data: refactored }, { status: 200 });
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Couldn't get spaces" }, { status: 404 })
    }
}