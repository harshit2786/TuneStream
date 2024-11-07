import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const AcceptSchema = z.object({
    spaceId : z.string(),
    userId : z.string()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = AcceptSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const creatorId = session?.user?.id;
        if(!creatorId){
            return NextResponse.json({message:"Unauthorised User"},{status:403});
        }
        const space = await prismaClient.space.findFirst({
            where : {
                id : data.spaceId,
                creatorId : creatorId,
            },
        });
        if(!space){
            return NextResponse.json({message:"Space does not exist"},{status:404});
        }
        await prismaClient.space.update({
            where : {
                id : data.spaceId,
                creatorId : creatorId,
            },
            data : {
                userIds : {
                    connect : [
                        {
                            id : data.userId
                        }
                    ]
                },
                pendingUsers : {
                    disconnect : [
                        {
                            id : data.userId
                        }
                    ]
                }
            }
        })
        return NextResponse.json({message : "User added to the space"},{status:200});
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}