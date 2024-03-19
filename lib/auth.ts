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
        token.email = user.email;
        token.name = user.name;
        token.sub = user.id;
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
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL as string;
      try {
        const res = await fetch(`${backUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: user.email
          })
        });
        console.log(res, "credentials login response");
        
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    }
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
        console.log(credentials, 'credentials in authorize');
        
        if (credentials) {
          const backUrl = process.env.NEXT_PUBLIC_BACK_URL as string;
          try {
            const response = await fetch(`${backUrl}/auth/login-student`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });
  
            if (response.ok) {
              const user = await response.json(); 
              console.log(user, 'user response credentials');
              
                return {
                  id: user.student_id,
                  ...user,
                };
            }
          } catch (error) {
            console.error('Error during user authorization:', error);
          }
        }
        return null;
      }
      
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
export const getServerAuthSession = () => getServerSession(authOptions);
