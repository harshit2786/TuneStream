import { authOptions } from "@/lib/authOptions";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UserJoinRequestSchema = z.object({
    spaceId: z.string(),
})

export const POST = async (req: NextRequest) => {
    try {
        const data = UserJoinRequestSchema.parse(await req.json());
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        console.log(session);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }
        const findSpace = await prismaClient.space.findFirst({
            where: {
                id: data.spaceId,
            },
            select: {
                id: true,
                userIds: {
                    select: {
                        id: true
                    }
                },
                type: true,
                creatorId: true,
                pendingUsers: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!findSpace) {
            return NextResponse.json({ message: "No space found" }, { status: 404 });
        }
        if (findSpace.creatorId === userId) {
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }
        if (findSpace.userIds.find((it) => it.id === userId)) {
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }
        if (findSpace.type === "Public") {
            await prismaClient.space.update({
                where: {
                    id: data.spaceId
                },
                data: {
                    userIds: {
                        connect: [
                            {
                                id: userId,
                            }
                        ]
                    }
                }
            });
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }
        if (findSpace.type === "Private") {
            if (findSpace.pendingUsers.find((it) => it.id === userId)) {
                return NextResponse.json({ message: "Request Sent" }, { status: 200 });
            }
            await prismaClient.space.update({
                where: {
                    id: data.spaceId
                },
                data: {
                    pendingUsers: {
                        connect: [
                            {
                                id: userId,
                            }
                        ]
                    }
                }
            });
            return NextResponse.json({ message: "Request Sent" }, { status: 200 });
        }
        return NextResponse.json({ message: "Not able to add user" }, { status: 411 });
    }
    catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Not able to add user" }, { status: 411 });
    }
}