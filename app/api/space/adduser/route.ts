import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

const UserJoinRequestSchema = z.object({
    spaceId : z.string(),
})

export const POST = async(req:NextRequest) => {
    try{
        const data = UserJoinRequestSchema.parse(await req.json());
        const session = await getServerSession();
        const userId = session?.user?.id;
        if(!userId){
            return NextResponse.json({message:"Unauthorized"},{status:403});
        }
        const findSpace = await prismaClient.space.findFirst({
            where : {
                id : data.spaceId,
            },
            select:{
                id:true,
                userIds : {
                    select : {
                        id:true
                    }
                },
                type:true,
                creatorId:true,
                pendingUsers: {
                    select : {
                        id:true
                    }
                }
            }
        });
        if(!findSpace){
            return NextResponse.json({message:"No space found"},{status:404});
        }
        if(findSpace.creatorId === userId){
            return NextResponse.json({message:"Creator cannot join space"},{status:411});
        }
        if(findSpace.userIds.find((it) => it.id === userId)){
            return NextResponse.json({message:"You have already joined the space"},{status:411});
        }
        if(findSpace.type === "Public"){
            await prismaClient.space.update({
                where : {
                    id : data.spaceId
                },
                data : {
                    userIds : {
                        connect : [
                            {
                                id : userId,
                            }
                        ]
                    }
                }
            });
            return NextResponse.json({message:"Joining Success"},{status:200});
        }
        if(findSpace.type === "Private"){
            if(findSpace.pendingUsers.find((it) => it.id === userId)){
                return NextResponse.json({message:"You have already sent request to join"},{status:411});
            }
            await prismaClient.space.update({
                where : {
                    id : data.spaceId
                },
                data : {
                    pendingUsers : {
                        connect : [
                            {
                                id : userId,
                            }
                        ]
                    }
                }
            });
            return NextResponse.json({message:"Joining Success"},{status:200});
        }
        return NextResponse.json({message:"Not able to add user"},{status:411});
    }
    catch(e){
        console.log(e);
        return NextResponse.json({message:"Not able to add user"},{status:411});
    }
}