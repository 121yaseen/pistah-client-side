import bcrypt from "bcryptjs";
import prisma from "@/app/libs/prismadb"; // Ensure the Prisma client is configured correctly
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        if (!user.password) {
          throw new Error("Please use a third-party provider to log in.");
        }

        // Validate password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // Return user object to be stored in the token
        return { id: user.userId, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // Attach user information to the session
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
        };
      }
      return session;
    },
    // Attach user information to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
