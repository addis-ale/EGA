import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prismadb";
import { compareSync } from "bcryptjs";
import { AuthOptions } from "next-auth";
import { cookies } from "next/headers";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
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
            email: credentials.email,
          },
        });
        if (!existedUser) {
          return null;
        }
        const isPasswordMatch = await compareSync(
          credentials.password,
          existedUser.password
        );
        if (!isPasswordMatch) {
          return null;
        }
        const cookieStore = await cookies();
        console.log(cookieStore);

        return {
          id: existedUser.id,
          name: existedUser.name,
          role: existedUser.role,
          email: existedUser.email,
        };
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
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
      const cookieStore = cookies(); // Access cookies
      console.log(cookieStore);
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
