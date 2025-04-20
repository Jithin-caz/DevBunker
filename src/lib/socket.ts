import { Server as IOServer } from "socket.io";

type GlobalWithIO = typeof globalThis & { io?: IOServer };

export const getIO = (): IOServer | undefined => {
  const globalWithIO = globalThis as GlobalWithIO;
  return globalWithIO.io;
};

export const setIO = (io: IOServer): void => {
  const globalWithIO = globalThis as GlobalWithIO;
  globalWithIO.io = io;
};