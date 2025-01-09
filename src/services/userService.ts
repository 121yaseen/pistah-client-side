import { createUser, getUser } from "@/repositories/userRepository";
import { CustomToken, User, UserDetails } from "@/types/interface";
import { NextApiRequest } from "next";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

// Create User
export const createUserAsync = async (user: UserDetails): Promise<User> => {
  const hashedPassword = await bcrypt.hash(user.password, 12);
  const createdDbUser = await createUser(
    user.name,
    user.email,
    hashedPassword,
    user.role
  );
  return {
    id: createdDbUser.userId,
    name: createdDbUser.name,
    email: createdDbUser.email,
    role: createdDbUser.role,
  };
};

// Get User
export const getUserAsync = async (email: string): Promise<User> => {
  const user = await getUser(email);
  return user;
};

// Get LoggedIn User
export const getLoggedInUser = async (
  req: NextApiRequest
): Promise<User | null> => {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as CustomToken;

  const user = await getUserAsync(token.user?.email ?? "");
  const loggedInUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return loggedInUser;
};
