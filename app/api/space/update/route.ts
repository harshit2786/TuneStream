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
        const session = await getServerSession();
        const creatorEmail = session?.user?.email;
        const creatorId = await prismaClient.user.findFirst({
            where : {
                email : creatorEmail ?? ""
            },
            select:{
                id: true
            }    
        });
        if(!creatorId){
            return NextResponse.json({message:"Not able to update Space"},{status:411});
        }
        const resp = await prismaClient.space.update({
            where : {
                id : data.spaceId,
                creatorId : creatorId.id
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