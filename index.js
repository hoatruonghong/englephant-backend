import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routers/auth.js";
import mapRouter from "./routers/map.js";
import learnerRouter from "./routers/learner.js";
import quizRouter from "./routers/quiz.js";
import flashcardRouter from "./routers/flashcard.js";
import idiomRouter from "./routers/idiom.js";
import lrRouter from "./routers/lr.js";
import pronunciationRouter from "./routers/pronunciation.js";
import talkroomRouter from "./routers/talkroom.js";
import exchangeRouter from "./routers/exchange.js";
import tutorManageRouter from "./routers/admin/tutor.js";
import exchangetableManageRouter from "./routers/admin/exchange.js";
import tutorAccountRouter from "./routers/tutor/account.js";
import tutorWorkshiftRouter from "./routers/tutor/workshift.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
// export const TOKEN_LIST = {};
// export const TOKEN_BLACKLIST = {};

//Middleware
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors({ origin: true, credentials: true }));

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to Englephant" });
});

//Connect to mongoose
mongoose
  .connect('mongodb+srv://hoa:Rc0Y3bSpoyaEkqrn@cluster0.mm7ujky.mongodb.net/?retryWrites=true&w=majority', {
    dbName: "Englephant",
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log("Something wrong happened!", err);
  });

//Routes
app
  .use("/api/auth", authRouter)
  .use("/api/map", mapRouter)
  .use("/api/learner", learnerRouter)
  .use("/api/quiz", quizRouter)
  .use("/api/card", flashcardRouter)
  .use("/api/idiom", idiomRouter)
  .use("/api/lr", lrRouter)
  .use("/api/pronunciation", pronunciationRouter)
  .use("/api/talkroom", talkroomRouter)
  .use("/api/exchangetable", exchangeRouter)

  //admin routes
  .use("/api/admin/tutor", tutorManageRouter)
  .use("/api/admin/exchangetable", exchangetableManageRouter)

  //tutor routes
  .use("/api/tutor/account", tutorAccountRouter)
  .use("/api/tutor/workshift", tutorWorkshiftRouter);

//Socket.io
import { Server } from 'socket.io';
// import { roomHandler } from "./room/index.js";

import { createServer } from "http";
const server = createServer(app)

// const io = new Server(process.env.SOCKET_PORT, {
//   cors: {
//     origin: '*',
//     methods: ["GET", "POST"],
//   }
// })
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: '/io/webrtc'  
})

// io.on("connection", (socket) => {
//   console.log("user is connected");

//   roomHandler(socket);

//   socket.on('disconnect', () => {
//     console.log("user is disconnected");
//   });
// });
const peers = io.of('/webrtcPeer')

// keep a reference of all socket connections
let connectedPeers = new Map()

peers.on('connection', socket => {

  console.log(socket.id)
  socket.emit('connection-success', { success: socket.id })

  connectedPeers.set(socket.id, socket)

  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedPeers.delete(socket.id)
  })

  socket.on('offerOrAnswer', (data) => {
    // send to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload.type)
        socket.emit('offerOrAnswer', data.payload)
      }
    }
  })

  socket.on('candidate', (data) => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID) {
        console.log(socketID, data.payload)
        socket.emit('candidate', data.payload)
      }
    }
  })

})

server.listen(PORT, () => {
  console.log("Server started at PORT ", PORT);
});
server.timeout = 5 * 1000;
export default app;
