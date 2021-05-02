const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const axios = require("axios").default;
const database = require("./database");

// initialize database
database.initializeDb();

const app = express();
app.use(index);
app.use(cors());

app.use("/login", (req, res) => {
  console.log("called  request ");
  res.send({
    token: "test123",
  });
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let interval;

io.sockets.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 5000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

const getApiAndEmit = async (socket) => {
  // const response = new Date();
  // Emitting a new message. Will be consumed by the client

  // const axios = require("axios");
  let response = await getBreeds();

  socket.emit("FromAPI", response);
};

const getBreeds = async () => {
  console.log("calling ");
  try {
    let test = await axios.get(
      "https://rata.digitraffic.fi/api/v1/train-locations/latest/",
      {
        headers: {
          "Accept-Encoding": "gzip",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(test.data);
    return test.data;
  } catch (error) {
    console.error(error);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));
