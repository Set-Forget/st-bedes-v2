import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
  },
  jwt: {
    async encode({ token, secret }): Promise<string> {
      if (!token) {
        throw new Error("Token is undefined");
      }
      const { sub, ...tokenProps } = token;
      return jwt.sign({ uid: sub, ...tokenProps }, secret, {
        algorithm: "HS256",
      });
    },
    async decode({ token, secret }): Promise<JWT | null> {
      if (!token) {
        throw new Error("Token is undefined");
      }
      try {
        const decodedToken = jwt.verify(token, secret, {
          algorithms: ["HS256"],
        });
        return decodedToken as JWT;
      } catch (error) {
        throw new Error(`"JWT decode error  ${error}`);
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken;
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? "/dashboard" : baseUrl;
    },
    async signIn({ user, account, profile }) {
      const dbUser = await prisma.student.findFirst({
        where: { email_address: user.email },
      });
      if (dbUser) {
        return true;
      } else {
        return false;
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (credentials) {
          // Find the user in the database
          const student = await prisma.student.findFirst({
            where: {
              email_address: credentials.email,
              password: credentials.password,
            },
          });

          const parent = await prisma.parent.findFirst({
            where: {
              email_address: credentials.email,
              password: credentials.password,
            },
          });

          if (student) {
            return {
              id: student.student_id.toString(),
              ...student,
            };
          } else if (parent) {
            return {
              id: parent.parent_id.toString(),
              ...parent,
            };
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export const getServerAuthSession = () => getServerSession(authOptions);
