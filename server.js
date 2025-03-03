const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let messages = []; // Store chat history in memory

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send chat history to newly connected user
  socket.emit("chatHistory", messages);

  // Handle incoming messages
  socket.on("sendMessage", (data) => {
    messages.push(data); // Save message in history
    io.emit("receiveMessage", data); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
