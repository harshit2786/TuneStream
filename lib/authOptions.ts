import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const prismaClient = new PrismaClient();

export const authOptions : NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
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
                            username: user.name ?? ""
                        },
                    });
                }
            } catch (e) {
                console.log('Error during user sign-in:', e);
                return false;
            }

            return true;
        },
        async jwt({ token, user }) {
            // First time jwt callback is run, user object is available
            if (user) {
                const dbUser = await prismaClient.user.findFirst({
                    where: { email: user.email ?? "" },
                    select: { id: true, username: true }
                });
                token.id = dbUser?.id ?? "";
                token.username = dbUser?.username ?? "";
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = typeof token.id === "string" ? token.id : "";
            session.user.username = typeof token.username === "string" ? token.username : "";
            return session;
        }
    }
};
