import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { YT_REGEX } from "@/lib/utils";

const AddStreamSchema = z.object({
    url: z.string(),
    spaceId: z.string()
})

export const POST = async (req: NextRequest) => {
    try {
        const data = AddStreamSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorised User" }, { status: 403 });
        }

        const resp1 = await prismaClient.space.findFirst({
            where: {
                id: data.spaceId,
                userIds: {
                    some: {
                        id: userId
                    }
                }
            }
        });
        const resp2 = await prismaClient.space.findFirst({
            where: {
                id: data.spaceId,
                creatorId: userId
            }
        });
        if (resp1 || resp2) {
            const isValid = data.url.match(YT_REGEX);
            if (!isValid) {
                return NextResponse.json({ message: "Wrong URL format" }, { status: 411 });
            }
            const extractedId = data.url.split("?v=")[1];
            await prismaClient.stream.create({
                data: {
                    spaceId: data.spaceId,
                    type: "Youtube",
                    url: data.url,
                    extractId: extractedId,
                    userId: userId,
                    active: false,
                    timeStamp: String(Date.now())
                }
            });
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }
        else {
            return NextResponse.json({ message: "Unauthorised User" }, { status: 403 });
        }
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({ message: "Incorrect Format" }, { status: 422 })
    }
}