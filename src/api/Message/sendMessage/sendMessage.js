import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      const existingRoom = await prisma.$exists.room({
        AND: [
          { participants_some: { id: user.id } },
          { participants_some: { id: toId } }
        ]
      });
      if (roomId === undefined) {
        if (!existingRoom) {
          if (user.id !== toId) {
            room = await prisma.createRoom({
              participants: { connect: [{ id: toId }, { id: user.id }] }
            });
          }
        } else if (existingRoom) {
          const existingRoomArray = await prisma.rooms({
            where: {
              AND: [
                { participants_some: { id: user.id } },
                { participants_some: { id: toId } }
              ]
            }
          });
          room = existingRoomArray[0];
          console.log(room);
        }
      } else {
        room = await prisma.room({ id: roomId });
      }
      if (!room) {
        throw Error("Room not found");
      }
      const getTo = await prisma
        .room({ id: room.id })
        .participants({ where: { id_not: user.id } });
      return prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id }
        },
        to: { connect: { id: roomId ? getTo[0].id : toId } },
        room: {
          connect: {
            id: room.id
          }
        }
      });
    }
  }
};
