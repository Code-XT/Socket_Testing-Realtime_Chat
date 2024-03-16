import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { error } from "console";

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

let users = [];
console.log(users);

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("join", (member, receiver) => {
    if (users.some((user) => user.receiver === receiver)) {
      users = users.filter((user) => user.receiver !== receiver);
    }
    users.push({ id: member, receiver });
    console.log(users);
    io.emit("joined", users);
  });

  socket.on("message", (username, receiver, message) => {
    console.log(`message: ${message}`);

    if (receiver) {
      users.forEach((user) => {
        if (user.receiver === receiver) {
          io.to(user.id).emit("response", { message, username, receiver });
        } else {
          //error
          socket.emit("response", "Invalid user");
        }
      });
    } else {
      socket.broadcast.emit("response", { message, username });
    }
  });

  socket.on("typing", ({ isTyping, memberId }) => {
    console.log(`typing: ${isTyping}`);
    console.log(`receiver: ${memberId}`);
    socket.broadcast.emit("typing_status", isTyping, memberId);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("logout", () => {
    console.log(`a user logged out: ${socket.id}`);
    users = users.filter((user) => user.id !== socket.id);
    io.emit("joined", users); // Update clients with the new users list
  });

  socket.on("disconnect", () => {
    console.log(`a user disconnected: ${socket.id}`);
    users = users.filter((user) => user.id !== socket.id);
    io.emit("joined", users); // Update clients with the new users list
  });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
