import express from "express";
import { Server } from "socket.io";
const PORT = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>HEllo from backend</h1>");
});

//! create raw http server -->
import http from "http";
const httpServer = http.createServer(app);

//! Attach socket to http server-->
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//! use socket.io to listen and emit messages -->
io.on("connection", (socket) => {
  console.log("web socket channel connected");

  //? when user wants to join a room-->
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log("joined to room")
  });

  //? listen "message" and send it to a room -->
  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data);
  });

  //? log when user disconnects -->
  socket.on("disconnect", () => {
    console.log("User disconnected !");
  });
});

httpServer.listen(PORT, () => {
  console.log(`app is running at http://localhost:${PORT}/`);
});
