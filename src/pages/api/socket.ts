// src/pages/api/socket.ts
import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { setIO } from "@/lib/socket";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export default function handler(_: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Socket.IO server initializing...");

    const io = new IOServer(res.socket.server);
    setIO(io); // 🔥 Save globally

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });
  }

  res.end();
}
