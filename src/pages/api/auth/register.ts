import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/app/libs/prismadb";
import { Role } from "@/types/interface";
import { createUser } from "@/repositories/userRepository";
import { createCompany } from "@/services/companyService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed.` });
  }

  const { name, email, password, companyName } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Invalid input. Name, email, and password are required.",
    });
  }

  const role = Role.OWNER;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newUser = await prisma.$transaction(async (prisma) => {
      // Create user
      const hashedPassword = password ? await bcrypt.hash(password, 12) : "";
      const user = await createUser(name, email, hashedPassword, role);

      // If role is ADVERTISER, create a company entry
      if (role === Role.OWNER) {
        if (!companyName || companyName.trim() === "") {
          throw new Error("Company name is required for advertisers.");
        }
        await createCompany(companyName, user.id);
      }

      return user;
    });

    return res.status(201).json({
      message: "User created successfully.",
      userId: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error creating user:", (error as Error).message);

    if (
      error instanceof Error &&
      error.message === "Company name is required for advertisers."
    ) {
      return res.status(400).json({ error: error.message });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === "P2002") {
      return res.status(400).json({ error: "Email already in use." });
    }

    return res.status(500).json({ error: "Something went wrong." });
  }
}
