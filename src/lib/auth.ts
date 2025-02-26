import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prismadb";
import { compareSync } from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const existedUser = await prisma.user.findFirst({
          where: {
            UserEmail: credentials.email,
          },
        });
        if (!existedUser) {
          return null;
        }
        const isPasswordMatch = compareSync(
          credentials.password,
          existedUser.password
        );
        if (!isPasswordMatch) {
          return null;
        }

        return {
          id: existedUser.id,
          name: existedUser.userName,
          role: existedUser.role,
          email: existedUser.UserEmail,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return {
          ...token,
          name: user.name,
          email: user.email,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          email: token.email,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};
