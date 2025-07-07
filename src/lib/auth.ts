import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./prisma";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        // Check if credentials match admin credentials from .env
        if (
          credentials.email === process.env.ADMIN_USERNAME && 
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Return a synthetic admin user
          return {
            id: 'admin-id',
            name: 'Administrator',
            email: process.env.ADMIN_USERNAME,
            role: 'ADMIN',
            image: null,
            emailVerified: new Date(),
          };
        }

        // Regular user authentication
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
    // You can add more providers here like Google, Facebook, etc.
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Ensure role is properly serialized as a string
        token.role = String((user as User).role);
        token.id = (user as User).id;
        // Add debug information
        console.log('JWT callback - user role:', (user as User).role);
        console.log('JWT callback - token role:', token.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Ensure role is properly passed to session
        session.user.role = String(token.role);
        session.user.id = token.id as string;
        // Add debug information
        console.log('Session callback - token role:', token.role);
        console.log('Session callback - session role:', session.user.role);
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Custom types for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
