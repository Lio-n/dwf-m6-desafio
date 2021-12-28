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

// $ UPDATE ONLINE
app.post("/updateOnline", (req, res) => {
  const { rtdbRoomId, player, onlineValue } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ online: onlineValue });
  res.json("Todo Ok");
});

// $ UPDATE READY
app.post("/updateReady", (req, res) => {
  const { rtdbRoomId, player, readyValue } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ ready: readyValue });
  res.json("Todo Ok");
});

// $ Unirse una ROOM EXISTENTE
app.get("/checkId/:roomId", (req, res) => {
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

// $ VERIFICA QUE PLAYER SOY [PLAYER1] or [PLAYER2]
app.post("/rooms/:rtdbRoomId", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { fullName, roomId } = req.body;
  roomsColl
    .doc(roomId.toString())
    .get()
    .then((doc) => {
      const { player1 } = doc.data();
      if (player1 == fullName) {
        rtdb.ref(`/rooms/${rtdbRoomId}/player1`).update({ fullName });
        res.json({ player: "player1" });
      } else {
        rtdb.ref(`/rooms/${rtdbRoomId}/player2`).update({ fullName });
        res.json({ player: "player2" });
      }
    });
});

// $ OBTENER LA INFO ACTUAL DEL PLAYER
app.post("/rooms/rival_info/:rtdbRoomId", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}`).once("value", (snap) => {
    const { player1, player2 } = snap.val();

    res.json({
      rivalName: player == "player1" ? player2.fullName : player1.fullName,
      rivalScore: player == "player1" ? player2.score : player1.score,
      score: player == "player1" ? player1.score : player2.score,
    });
  });
});

// $ GUARDO EL MOVE EN LA REALTIME DATABASE
app.post("/rooms/:rtdbRoomId/set_move", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { player, myPlay } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ choice: myPlay });

  res.json("Todo Ok");
});

// ! GUARDO EL SCORE EN LA REALTIME DATABASE
app.post("/rooms/:rtdbRoomId/set_score", (req, res) => {
  const { rtdbRoomId } = req.params;
  const { myScore, player } = req.body;

  rtdb.ref(`/rooms/${rtdbRoomId}/${player}`).update({ score: myScore });

  res.json("Todo Ok");
});

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
