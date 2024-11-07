import { authOptions } from "@/lib/authOptions";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

const UpdateSchema = z.object({
    spaceId : z.string(),
    name : z.string(),
    public : z.boolean()
})

export const POST = async(req:NextRequest) => {
    try{
        const data = UpdateSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const creatorId = session?.user?.id;
        if(!creatorId){
            return NextResponse.json({message:"Unauthorized"},{status:403});
        }
        const findSpace = await prismaClient.space.findFirst({
            where : {
                id : data.spaceId,
                creatorId : creatorId
            }
        });
        if(!findSpace){
            return NextResponse.json({message:"Unauthorized"},{status:403});
        }
        const resp = await prismaClient.space.update({
            where : {
                id : data.spaceId,
                creatorId : creatorId
            },
            data : {
                name : data.name,
                type : data.public ? "Public" : "Private"
            }
        });
        if(!resp){
            return NextResponse.json({message:"Not able to update Space"},{status:411});
        }
        return NextResponse.json({data : resp},{status:200});
    }
    catch(e){
        console.log(e);
        return NextResponse.json({message:"Not able to update Space"},{status:411});
    }
}