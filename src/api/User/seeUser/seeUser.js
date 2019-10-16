import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeUser: (_, args) => prisma.user({ id: args.id })
  }
};
