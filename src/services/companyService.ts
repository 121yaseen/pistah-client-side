import prisma from "@/app/libs/prismadb";

// Create company
export const createCompany = async (companyName: string, userId: string) => {
  return await prisma.company.upsert({
    where: { userId }, // Ensure only one company per user
    update: { name: companyName },
    create: {
      name: companyName,
      userId: userId,
    },
  });
};
