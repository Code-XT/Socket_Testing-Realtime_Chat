import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("message", (username, receiver, message) => {
    console.log(`message: ${message}`);
    receiver
      ? socket.to(receiver).emit("response", { message, username, receiver })
      : socket.broadcast.emit("response", { message, username });
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("disconnect", () => {
    console.log(`a user disconnected: ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
