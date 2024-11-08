import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)
        const creatorId = session?.user?.id;
        if(!creatorId){
            return NextResponse.json({message:"Unauthorised User"},{status:403});
        }
        const resp1 = await prismaClient.space.findMany({
            where: {
                creatorId : creatorId
            },
            select : {
                id :true,
                name : true,
                pendingUsers : true
            }
        });
        const resp2 = await prismaClient.space.findMany({
            where : {
                userIds : {
                    some : {
                        id : creatorId
                    }
                }
            },
            select : {
                id : true
            }
        })
        return NextResponse.json({ data: {createdSpace : resp1 , memberSpace : resp2} }, { status: 200 });
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Couldn't get spaces" }, { status: 404 })
    }
}