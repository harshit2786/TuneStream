import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SpaceDetail } from "@/lib/models/space";
import { Streams } from "@/lib/models/stream";

const GetSpaceSchema = z.object({
    spaceName : z.string(),
})

export const POST = async (req: NextRequest) => {
    try {
        const data = GetSpaceSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if(!userId){
            return NextResponse.json({message:"Unauthorised User"},{status:403});
        }
        const resp = await prismaClient.space.findFirst({
            where : {
                name : data.spaceName
            },
            include : {
                streams : {
                    include : {
                        upvotes : {
                            select : {
                                userId :true
                            }
                        }
                    }
                },
                userIds : true,
                creator : true
            }
        });
        if(!resp){
            return NextResponse.json({message:"No space found."},{status:404});
        }
        if(resp.creatorId === userId || resp.userIds.some(user => user.id === userId)){
            const parseStreams : Streams[] =  resp.streams.map((it) => {
                return {
                    id : it.id,
                    timeStamp : it.timeStamp,
                    type : it.type,
                    url : it.url,
                    userId : it.userId,
                    extractId : it.extractId,
                    upvotes : it.upvotes.map((it) => {return it.userId}),
                    active : it.active,
                    spaceId : it.spaceId
                }
            })
            const dataSent : SpaceDetail = {
                id : resp.id,
                creator : resp.creator,
                name : resp.name,
                type : resp.type,
                timestamp : resp.timeStamp,
                streams : parseStreams,
                users : resp.userIds.length
            }
            return NextResponse.json({data:dataSent},{status:200});
        }
        else{
            return NextResponse.json({data : null},{status:200});
        }
        
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}