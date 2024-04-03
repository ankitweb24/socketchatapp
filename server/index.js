const { log } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);

const socketIO = require("socket.io");

const io = socketIO(server, {
  cors: {
    origin: "*",
    methdos: ["GET", "POST"],
    Credential: true,
  },
});

io.on("connection", (socket) => {
  console.log(`user Connected ${socket.id} `);


  socket.on('userMsg', (data) => {
        socket.broadcast.emit('msg', data)
  })

  socket.on('disconnect', () => {
    console.log(`user Disconnected ${socket.id}`);
  })

});

const port = 8000;

server.listen(port, () => {
  console.log(`server is started port at ${port}`);
});
