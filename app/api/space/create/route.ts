import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const CreateSpaceSchema = z.object({
    name: z.string(),
    public: z.boolean()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = CreateSpaceSchema.parse(await req.json());
        const session = await getServerSession(authOptions)
        console.log("session",session);
        const creatorId = session?.user?.id;
        if(!creatorId){
            return NextResponse.json({message:"Unauthorised User"},{status:403});
        }
        const resp = await prismaClient.space.create({
            data: {
                name: data.name,
                creatorId: creatorId,
                type: data.public ? "Public" : "Private",
                timeStamp : String(Date.now())
            }

        });
        console.log("resp",resp)
        const dataSent = {
            id : resp.id,
            creator : session?.user?.username ?? "",
            name : resp.name,
            type : resp.type,
            timeStamp : resp.timeStamp,
            streams : 0,
            users : 0
        }
        console.log("data", dataSent)
        return NextResponse.json({data:dataSent},{status:200});
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}