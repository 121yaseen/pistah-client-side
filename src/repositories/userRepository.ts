import { User } from "@/types/interface";
import prisma from "../libs/prismadb";

// Create User
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });
  return user;
};

// Get User
export const getUser = async (email: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      id: "",
      name: "",
      email: "",
      role: "",
    };
  }

  return {
    id: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
