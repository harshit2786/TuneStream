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
        return NextResponse.json({ data: resp }, { status: 200 });
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Couldn't get spaces" }, { status: 404 })
    }
}