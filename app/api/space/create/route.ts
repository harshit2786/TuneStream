import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";

const CreateSpaceSchema = z.object({
    name: z.string(),
    public: z.boolean()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = CreateSpaceSchema.parse(await req.json());
        const session = await getServerSession();
        const creatorId = session?.user?.id;
        if(!creatorId){
            return NextResponse.json({message:"Unauthorised User"},{status:403});
        }
        const resp = await prismaClient.space.create({
            data: {
                name: data.name,
                creatorId: creatorId,
                type: data.public ? "Public" : "Private",
                timeStamp : Date.now()
            }

        });
        return NextResponse.json({data:resp},{status:200});
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}