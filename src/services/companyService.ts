import prisma from "@/app/libs/prismadb";

// Create company
export const createCompany = async (name: string, userId: string) => {
  return await prisma.company.create({
    data: { name, userid: userId },
  });
};
