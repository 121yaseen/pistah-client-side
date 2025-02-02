import bcrypt from "bcryptjs";
import prisma from "@/app/libs/prismadb";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: "SSP" | "DSP"; // Ensuring only valid roles
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "SSP" | "DSP"; // Adding role to User type
  }
}

// Extend NextAuth JWT Type to include role
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      role: "SSP" | "DSP";
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
          throw new Error(
            "This account uses OAuth login. Try a different method."
          );
        }

        // Validate password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        // 🔹 Fix: Explicitly typecast role to "SSP" | "DSP"
        const userRole = user.role as "SSP" | "DSP";

        // Return user object including role
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userRole,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          role: token.user.role,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role ?? "DSP", // Default role to DSP if undefined
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
