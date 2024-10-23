import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";

const CreateSpaceSchema = z.object({
    creatorId: z.string(),
    name: z.string(),
    public: z.boolean()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = CreateSpaceSchema.parse(await req.json());
        const resp = await prismaClient.space.create({
            data: {
                name: data.name,
                creatorId: data.creatorId,
                type: data.public ? "Public" : "Private"
            }

        });
        return NextResponse.json({data:resp},{status:200});
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}