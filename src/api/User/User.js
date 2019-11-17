import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    following: ({ id }) => prisma.user({ id }).following(),
    followers: ({ id }) => prisma.user({ id }).followers(),
    posts: ({ id }) => prisma.user({ id }).posts({ orderBy: "createdAt_DESC" }),
    likes: ({ id }) => prisma.user({ id }).likes(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    rooms: ({ id }) => prisma.user({ id }).rooms(),
    followingCount: ({ id }) =>
      prisma
        .usersConnection({ where: { followers_some: { id } } })
        .aggregate()
        .count(),
    followerCount: ({ id }) =>
      prisma
        .usersConnection({ where: { following_some: { id } } })
        .aggregate()
        .count(),
    postsCount: ({ id }) =>
      prisma
        .postsConnection({ where: { user: { id } } })
        .aggregate()
        .count(),
    fullName: parent => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: (parent, __, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return prisma.$exists.user({
        AND: [{ id: user.id }, { following_some: { id: parentId } }]
      });
    },
    isSelf: (parent, __, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
