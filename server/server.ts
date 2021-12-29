import { firestore, rtdb } from "./db";
import * as express from "express";
import * as cors from "cors";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
// app.use(express.static("dist"));
app.use(cors());

const PORT = 3000;

const roomsColl = firestore.collection("rooms");
const usersColl = firestore.collection("users");

// $ SIGNUP
app.post("/signup", (req, res) => {
  const { fullName } = req.body;
  usersColl
    .where("userName", "==", fullName)
    .get()
    .then(() => {
      usersColl
        .add({
          fullName,
        })
        .then((newUserRef) => {
          res.json({
            userId: newUserRef.id,
          });
        });
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
        choice: "",
        score: 0,
      },
      player2: {
        fullName: "",
        online: false,
        ready: false,
        choice: "",
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
          res.json({
            player: "player1",
            roomId: roomId,
            rtdbRoomId: roomLongId,
          });
        });
    });
});

// $ CHECKS IF A ROOM EXISTS
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  roomsColl
    .doc(roomId.toString())
    .get()
    .then((doc) => {
      return res.status(200).json({
        rtdbRoomId: doc.get("rtdbRoomId"),
      });
    });
});

// $ UPDATE THE PLAYER2 FULLNAME
// & Path : "/rooms/:rtdbRoomId/player2/?fullName=${fullName}"
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
    rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ online: value });
  }
  if (property == "ready") {
    rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ ready: value });
  }
  res.json("Todo Ok");
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
      score: player == "player1" ? player1.score : player2.score,
    });
  });
});

// $ SAVE THE CHOICE IN THE REAL TIME DATABASE
// & Path : "/rooms/${rtdbRoomId}/player/choice"
app.put("/rooms/:rtdbRoomId/player/choice", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, myPlay } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ choice: myPlay });

  res.json("Todo Ok");
});

// $ SAVE THE SCORE IN THE REAL TIME DATABASE
// & Path : "/rooms/${rtdbRoomId}/player/myScore"
app.put("/rooms/:rtdbRoomId/player/score", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, myScore } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ score: myScore });

  res.json("Todo Ok");
});

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
