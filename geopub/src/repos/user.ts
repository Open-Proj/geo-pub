import { UserModel, UserCreateInput } from "../generated/prisma/models/User.ts";
import { prisma } from "../database.ts";

/**
 * Retrieve user by public ID.
 **/
export async function getUserByPublicID(publicID: string): Promise<UserModel | null> {
  return await prisma.user.findFirst({
    where: {
      public_id: publicID,
    },
  });
}

/**
 * Save a new user.
 **/
export async function createUser(input: UserCreateInput): Promise<UserModel> {
  return await prisma.user.create({ data: input });
}
