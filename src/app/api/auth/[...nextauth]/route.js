import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credintial",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { UserEmail: credentials.email },
        });
        if (!user) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordValid) {
          return null;
        }
        return {
          id: user.id,
          userName: user.userName,
          UserEmail: user.UserEmail,
        };
      },
    }),
  ],

  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
        token.userName = user.userName;
        token.UserEmail = user.UserEmail;
      }
      return token;
    },

    async session(session, token) {
      if (token) {
        session.user.id = token.id;
        session.user.userName = token.userName;
        session.user.UserEmail = token.UserEmail;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
