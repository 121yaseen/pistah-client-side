import { createUser, getUser } from "@/repositories/userRepository";
import { Role, User, UserDetails } from "@/types/interface";
import { NextApiRequest } from "next";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

// Create User
export const createUserAsync = async (user: UserDetails): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password ?? "", 12);
  const createdDbUser = await createUser(
    user.name,
    user.email,
    hashedPassword,
    user.role
  );
  return {
    id: createdDbUser.id,
    name: createdDbUser.name,
    email: createdDbUser.email,
    role: createdDbUser.role as Role,
  };
};

// Get User
export const getUserAsync = async (email: string): Promise<User | null> => {
  const user = await getUser(email);
  return user;
};

// Get LoggedIn User
export const getLoggedInUser = async (
  req: NextApiRequest
): Promise<User | null> => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) {
    throw new Error("Unauthorized: No token found");
  }

  const user = await getUser(token.user.email);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profilePicUrl: user.profilePicUrl ?? "",
    company: user.company
      ? { id: user.company.id, name: user.company.name }
      : null,
    role: user.role as Role,
  };
};
