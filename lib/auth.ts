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
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = String(token.accessToken);
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
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },

      // MUST REDO TOMORROW
      async authorize(credentials, req) {

        if (credentials) {
          // Find the user in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          if (user) {

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }
        return null;
      }
      
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export const getServerAuthSession = () => getServerSession(authOptions);
