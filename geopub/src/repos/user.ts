import { UserModel } from "../generated/prisma/models/User.ts";
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
