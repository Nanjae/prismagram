import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { username, email, firstName = "", lastName = "", bio = "" } = args;
      const existingUser = await prisma.$exists.user({ username });
      const existingEmail = await prisma.$exists.user({ email });
      if (existingUser) {
        throw Error("이미 등록된 사용자 이름 입니다.");
      } else if (existingEmail) {
        throw Error("이미 등록된 이메일 입니다.");
      }
      await prisma.createUser({
        username,
        email,
        firstName,
        lastName,
        bio
      });
      return true;
    }
  }
};
