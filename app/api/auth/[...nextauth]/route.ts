import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                return false;
            }

            try {
                // Check if user already exists
                const existingUser = await prismaClient.user.findFirst({
                    where: { email: user.email },
                });

                // If user does not exist, create a new user
                if (!existingUser) {
                    await prismaClient.user.create({
                        data: {
                            email: user.email,
                            Provider: "Google",
                            username : user.name ?? ""
                        },
                    });
                }
            } catch (e) {
                console.log('Error during user sign-in:', e);
                return false;
            }

            return true;
        },
        async session ({session}) {
            const email = session?.user?.email;
            const userId = await prismaClient.user.findFirst({
                where : {
                    email : email ?? ""
                },
                select : {
                    id : true,
                    username : true
                }
            });
            session.user.id = userId?.id ?? "";
            session.user.username = userId?.username ?? ""
            return session;
        }
    },
})

export { handler as GET, handler as POST }