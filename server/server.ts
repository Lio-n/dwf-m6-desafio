import { firestore, rtdb } from "./db";
import * as express from "express";
import * as cors from "cors";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

const PORT = process.env.PORT || 3000;

const roomsColl = firestore.collection("rooms");
const usersColl = firestore.collection("users");

// $ SIGNUP
app.post("/signup", (req, res) => {
  const { fullName } = req.body;
  usersColl
    .where("fullName", "==", fullName)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        usersColl
          .add({
            fullName,
          })
          .then(() => {
            res.status(201).json({
              message: "User Created",
            });
          });
      } else {
        res.status(400).json({
          message: "User Already exists",
        });
      }
    });
});

// $ CREATE A ROOM
app.post("/rooms", (req, res) => {
  const { fullName } = req.body;

  const roomRef = rtdb.ref(`rooms/${nanoid()}`);
  roomRef
    .set({
      player1: {
        fullName,
        online: false,
        ready: false,
        disconnected: false,
        choice: "null",
        score: 0,
      },
      player2: {
        fullName: "null",
        online: false,
        ready: false,
        disconnected: false,
        choice: "null",
        score: 0,
      },
    })
    .then(() => {
      const roomLongId = roomRef.key; // $ Obtiene el ID que se genera en RTDB
      const roomId = (1000 + Math.floor(Math.random() * 999)).toString();
      roomsColl
        .doc(roomId)
        .set({
          rtdbRoomId: roomLongId,
        })
        .then(() => {
          res.status(201).json({
            player: "player1",
            roomId: roomId,
            rtdbRoomId: roomLongId,
          });
        });
    });
});

// $ CHECKS IF A ROOM EXISTS
// & Path : "/rooms/${roomId}"
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  roomsColl
    .doc(roomId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(200).json({
          rtdbRoomId: doc.get("rtdbRoomId"),
        });
      } else {
        return res.status(400).json({
          message: "Room not found",
        });
      }
    });
});

// $ GET USER DATA
// & Path : "/rooms/${rtdbRoomId}/player/:${fullName}"
app.get("/rooms/:rtdbRoomId/player/:fullName", (req, res) => {
  const { rtdbRoomId, fullName } = req.params;

  rtdb
    .ref(`/rooms/${rtdbRoomId}`)
    .get()
    .then((snap) => {
      const { player1, player2 } = snap.val();

      if (player1.fullName == fullName) {
        res.status(200).json({
          player: "player1",
          fullName: player1.fullName,
          rivalName: player2.fullName,
          history: {
            myScore: player1.score,
            rivalScore: player2.score,
          },
        });
      } else if (player2.fullName == fullName) {
        res.status(200).json({
          player: "player2",
          fullName: player2.fullName,
          rivalName: player1.fullName,
          history: {
            myScore: player2.score,
            rivalScore: player1.score,
          },
        });
      } else {
        res.status(400).json({
          message: "User Not Found",
        });
      }
    });
});

// $ UPDATE THE PLAYER2 FULLNAME
// & Path : "/rooms/${rtdbRoomId}/player2/?fullName=${fullName}"
app.put("/rooms/:rtdbRoomId/player2", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { fullName } = req.query;

  rtdb.ref(`/rooms/${rtdbRoomId}/player2`).update({ fullName });
  res.json({ player: "player2" });
});

// $ UPDATE PROPERTY [READY or ONLINE]
// & Path : "/rooms/${rtdbRoomId}/player"
app.put("/rooms/:rtdbRoomId/player", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, property, value } = req.body;

  if (property == "online") {
    rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ online: value, disconnected: false });
  }
  if (property == "ready") {
    rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ ready: value });
  }
  res.status(200).json("Todo Ok");
});

// $ GET CURRENT RIVAL INFO
// & Path : "/rooms/${rtdbRoomId}/rival_player/?player=${player}"
app.get("/rooms/:rtdbRoomId/rival_player", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player } = req.query;

  rtdb.ref(`/rooms/${rtdbRoomId}`).once("value", (snap) => {
    const { player1, player2 } = snap.val();

    res.json({
      rivalName: player == "player1" ? player2.fullName : player1.fullName,
      rivalScore: player == "player1" ? player2.score : player1.score,
      myScore: player == "player1" ? player1.score : player2.score,
    });
  });
});

// $ SAVE THE CHOICE IN THE REAL TIME DATABASE
// & Path : "/rooms/${rtdbRoomId}/player/choice"
app.put("/rooms/:rtdbRoomId/player/choice", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, myPlay } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ choice: myPlay });

  res.status(200).json("Todo Ok");
});

// $ SAVE THE SCORE IN THE REAL TIME DATABASE
// & Path : "/rooms/${rtdbRoomId}/player/myScore"
app.put("/rooms/:rtdbRoomId/player/score", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, myScore } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ score: myScore });

  res.status(200).json("Todo Ok");
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
