import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

const DeleteSchema = z.object({
    spaceId : z.string()
})

export const POST = async(req:NextRequest) => {
    try{
        const data = DeleteSchema.parse(await req.json());
        const session = await getServerSession();
        const creatorId = session?.user.id;

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
        const resp = await prismaClient.space.delete({
            where : {
                id : data.spaceId,
                creatorId : creatorId
            }
        });
        if(!resp){
            return NextResponse.json({message:"Not able to delete Space"},{status:403});
        }
        return NextResponse.json({data : resp},{status:200});
    }
    catch(e){
        console.log(e);
        return NextResponse.json({message:"Not able to delete Space"},{status:411});
    }
}