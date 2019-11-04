import { prisma } from "../../../generated/prisma-client";

export default {
  Post: {
    comments: ({ id }) => prisma.post({ id }).comments(),
    files: ({ id }) => prisma.post({ id }).files(),
    user: ({ id }) => prisma.post({ id }).user(),
    isLiked: (parent, __, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return prisma.$exists.like({
        AND: [{ user: { id: user.id } }, { post: { id: parentId } }]
      });
    },
    likeCount: parent =>
      prisma
        .likesConnection({
          where: {
            post: {
              id: parent.id
            }
          }
        })
        .aggregate()
        .count(),
    commentCount: parent =>
      prisma
        .commentsConnection({
          where: {
            post: {
              id: parent.id
            }
          }
        })
        .aggregate()
        .count()
  }
};
