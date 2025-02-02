import { User, Role } from "@/types/interface";
import prisma from "@/app/libs/prismadb";

// Create User
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: Role
) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("User with this email already exists");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code = "P2002";
    throw error;
  }

  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
      profilePicUrl: "",
    },
  });
};

// Get User
export const getUser = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true, company: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    profilePicUrl: user.profilePicUrl ?? "",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};
